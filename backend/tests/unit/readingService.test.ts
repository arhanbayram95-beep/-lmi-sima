import { ApiError } from '@google/genai';
import { ReadingModelClient } from '../../src/services/geminiClient';
import { InvalidImageError } from '../../src/services/imageValidation';
import { generateReading, ReadingServiceError } from '../../src/services/readingService';
import { READING_SCHEMAS, ReadingModuleId } from '../../src/services/readingSchema';
import { READING_SYSTEM_PROMPTS } from '../../src/services/systemPrompt';
import { MODULE_RESPONSES } from '../fixtures/characterSheets';

// assertLooksLikeJpeg (imageValidation.ts) now rejects anything that
// doesn't start with the JPEG magic bytes, so every fixture that's meant
// to reach the (mocked) Gemini call has to actually look like a JPEG —
// plain placeholder strings like 'base64-calm' no longer pass.
function jpegBase64(label: string): string {
  return Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.from(label)]).toString('base64');
}

const PHOTOS_3 = [jpegBase64('calm'), jpegBase64('bright'), jpegBase64('deep')];
const PHOTOS_2 = [jpegBase64('person1'), jpegBase64('person2')];
const PHOTOS_1 = [jpegBase64('solo')];

// Matches MODULE_PHOTO_COUNTS in readingSchema.ts — used by tests that need
// a valid photo count for a given module without hardcoding it themselves.
const MODULE_PHOTOS: Record<ReadingModuleId, string[]> = {
  hero: PHOTOS_3,
  party: PHOTOS_2,
  nemesis: PHOTOS_1,
};

function makeClient(generateContent: ReadingModelClient['models']['generateContent']): ReadingModelClient {
  return { models: { generateContent } };
}

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

function clientFor(moduleId: ReadingModuleId) {
  return jest.fn().mockResolvedValue(textResponse(MODULE_RESPONSES[moduleId]));
}

describe('generateReading', () => {
  it('returns the character sheet parsed from the JSON response text', async () => {
    const generateContent = clientFor('hero');

    const result = await generateReading([makeClient(generateContent)], PHOTOS_3);

    expect(result).toMatchObject({ hero: { name: 'Wren Ashdown' } });
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('stamps the module discriminator from the requested module, not the model output', async () => {
    const generateContent = jest.fn().mockResolvedValue(
      textResponse({ ...MODULE_RESPONSES['nemesis'], module: 'something_else' })
    );

    const result = await generateReading([makeClient(generateContent)], PHOTOS_1, 'nemesis');

    expect(result.module).toBe('nemesis_sheet');
  });

  it('sends the images before the text content, per PROJECT_SPEC.md §4', async () => {
    const generateContent = clientFor('hero');

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    const parts = callArgs.contents[0].parts;
    expect(parts.slice(0, 3).every((part: { inlineData?: unknown }) => !!part.inlineData)).toBe(true);
    expect(parts[3].text).toBeDefined();
  });

  it('forces JSON structured output via responseSchema', async () => {
    const generateContent = clientFor('hero');

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.responseMimeType).toBe('application/json');
    expect(callArgs.config.responseSchema).toBeDefined();
  });

  it('raises the temperature above the default to widen variety in open-ended picks', async () => {
    const generateContent = clientFor('hero');

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.temperature).toBeGreaterThan(1);
  });

  it.each(['hero', 'party', 'nemesis'] as const)(
    "sends the %s module's own response schema",
    async (moduleId) => {
      const generateContent = clientFor(moduleId);

      await generateReading([makeClient(generateContent)], MODULE_PHOTOS[moduleId], moduleId);

      const [[callArgs]] = generateContent.mock.calls;
      expect(callArgs.config.responseSchema).toBe(READING_SCHEMAS[moduleId]);
    }
  );

  it('wraps a network failure as a ReadingServiceError', async () => {
    const generateContent = jest.fn().mockRejectedValue(new Error('ECONNRESET'));

    await expect(generateReading([makeClient(generateContent)], PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  // 2026-08-15: live testing found gemini-flash-latest returning a real
  // 503 "high demand" on a large fraction of calls in a short burst —
  // confirmed via direct SDK calls, Google's model capacity, not this
  // app's key/config. Every occurrence surfaced as a hard 502 with no
  // retry, so a single short-lived blip looked like a broken feature.
  it('retries once on a transient 503 from Gemini and succeeds', async () => {
    const generateContent = jest
      .fn()
      .mockRejectedValueOnce(new ApiError({ message: 'high demand', status: 503 }))
      .mockResolvedValueOnce(textResponse(MODULE_RESPONSES['hero']));

    const result = await generateReading([makeClient(generateContent)], PHOTOS_3);

    expect(result).toMatchObject({ hero: { name: 'Wren Ashdown' } });
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it('gives up as a ReadingServiceError after repeated 503s', async () => {
    const generateContent = jest.fn().mockRejectedValue(new ApiError({ message: 'high demand', status: 503 }));

    await expect(generateReading([makeClient(generateContent)], PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
    // Initial attempt + 2 retries — a single-client call gets the
    // original 3-attempt cushion (see maxAttemptsFor), since same-key
    // retry is the only resilience available with no second key to fall
    // over to.
    expect(generateContent).toHaveBeenCalledTimes(3);
  });

  it('does not retry a non-retryable API error (e.g. a real 400)', async () => {
    const generateContent = jest.fn().mockRejectedValue(new ApiError({ message: 'bad request', status: 400 }));

    await expect(generateReading([makeClient(generateContent)], PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  // 2026-08-18: a second Gemini key was added specifically to cut the
  // failure rate ("minimize reading fails as much as you can with those
  // two keys") — retries now cycle through every client passed in,
  // trying the second key if the first fails, instead of hammering the
  // same one four times.
  it('falls over to the second client when the first is exhausted/erroring', async () => {
    const failingContent = jest.fn().mockRejectedValue(new ApiError({ message: 'quota exceeded', status: 429 }));
    const workingContent = jest.fn().mockResolvedValue(textResponse(MODULE_RESPONSES['hero']));

    const result = await generateReading(
      [makeClient(failingContent), makeClient(workingContent)],
      PHOTOS_3
    );

    expect(result).toMatchObject({ hero: { name: 'Wren Ashdown' } });
    expect(failingContent).toHaveBeenCalledTimes(1);
    expect(workingContent).toHaveBeenCalledTimes(1);
  });

  // Direct product ask: "after first fail tell it to switch models" — the
  // primary model (gemini-flash-latest) gets exactly the first attempt;
  // every retry after that switches to the fallback model instead of
  // trying the primary again, since a same-model retry doesn't help
  // during a model-specific capacity storm.
  it('uses the primary model on the first attempt, then switches to the fallback model on retry', async () => {
    const generateContent = jest
      .fn()
      .mockRejectedValueOnce(new ApiError({ message: 'high demand', status: 503 }))
      .mockResolvedValueOnce(textResponse(MODULE_RESPONSES['hero']));

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(generateContent.mock.calls[0][0].model).toBe('gemini-flash-latest');
    expect(generateContent.mock.calls[1][0].model).toBe('gemini-flash-lite-latest');
  });

  it('never retries on the primary model — every attempt after the first uses the fallback', async () => {
    const generateContent = jest.fn().mockRejectedValue(new ApiError({ message: 'high demand', status: 503 }));

    await expect(generateReading([makeClient(generateContent)], PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);

    const models = generateContent.mock.calls.map((call) => call[0].model);
    expect(models).toEqual(['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-flash-lite-latest']);
  });

  // 2026-08-18 (later same day): "it takes too long" — an earlier
  // version of this retried each client twice (4 total attempts),
  // which roughly doubled worst-case wait to 100+ seconds. Trying each
  // key once already captures the failover benefit; a second try on
  // the same key during a sustained outage rarely helps and mostly
  // just adds wait, so maxAttemptsFor caps at exactly one try per
  // client when there's more than one available.
  it('tries each client exactly once (not twice) before giving up, when more than one is available', async () => {
    const clientA = jest.fn().mockRejectedValue(new ApiError({ message: 'high demand', status: 503 }));
    const clientB = jest.fn().mockRejectedValue(new ApiError({ message: 'high demand', status: 503 }));

    await expect(
      generateReading([makeClient(clientA), makeClient(clientB)], PHOTOS_3)
    ).rejects.toBeInstanceOf(ReadingServiceError);

    expect(clientA).toHaveBeenCalledTimes(1);
    expect(clientB).toHaveBeenCalledTimes(1);
  });

  // 2026-08-15 (later same day): a hung request in production showed the
  // SDK doesn't always fail with a clean ApiError — a stalled connection
  // or an aborted timeout throws whatever shape the underlying fetch/abort
  // layer produces, which isn't guaranteed to be `instanceof ApiError`.
  // Retryability switched from an allowlist of known-good statuses to a
  // denylist of known-bad ones specifically so this class of error still
  // gets retried instead of silently falling through as non-retryable.
  it('retries a non-ApiError failure (e.g. a timed-out or stalled connection)', async () => {
    const generateContent = jest
      .fn()
      .mockRejectedValueOnce(new Error('The operation was aborted due to timeout'))
      .mockResolvedValueOnce(textResponse(MODULE_RESPONSES['hero']));

    const result = await generateReading([makeClient(generateContent)], PHOTOS_3);

    expect(result).toMatchObject({ hero: { name: 'Wren Ashdown' } });
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it('throws when the model responds with no text output', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: undefined });

    await expect(generateReading([makeClient(generateContent)], PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the response text is not valid JSON', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: 'not json' });

    await expect(generateReading([makeClient(generateContent)], PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when a section the mode renders is missing from the response', async () => {
    const { quest_hook, ...withoutQuestHook } = MODULE_RESPONSES.hero;
    const generateContent = jest.fn().mockResolvedValue(textResponse(withoutQuestHook));

    await expect(generateReading([makeClient(generateContent)], PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  // Regression: a live Gemini response once came back with a section
  // present but missing one of its own array fields, which an old
  // top-level-only check let through, and the frontend's `.map()` over the
  // missing array crashed RevealScreen in production.
  it('throws when a nested character sheet is missing one of its required fields', async () => {
    const villain = MODULE_RESPONSES.nemesis.villain as Record<string, unknown>;
    const { ability_scores, ...villainWithoutScores } = villain;
    const malformed = { ...MODULE_RESPONSES.nemesis, villain: villainWithoutScores };
    const generateContent = jest.fn().mockResolvedValue(textResponse(malformed));

    await expect(generateReading([makeClient(generateContent)], PHOTOS_1, 'nemesis')).rejects.toBeInstanceOf(
      ReadingServiceError
    );
  });

  it('throws when a hero inside the party array is malformed', async () => {
    const [first, second] = MODULE_RESPONSES.party.heroes as Record<string, unknown>[];
    const malformed = { ...MODULE_RESPONSES.party, heroes: [first, { ...second, starting_gear: 'not an array' }] };
    const generateContent = jest.fn().mockResolvedValue(textResponse(malformed));

    await expect(generateReading([makeClient(generateContent)], PHOTOS_2, 'party')).rejects.toBeInstanceOf(
      ReadingServiceError
    );
  });

  it('defaults to the hero system prompt when no module is given', async () => {
    const generateContent = clientFor('hero');

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.systemInstruction).toBe(READING_SYSTEM_PROMPTS.hero);
  });

  it.each(['hero', 'party', 'nemesis'] as const)(
    "uses the %s module's own system prompt",
    async (moduleId) => {
      const generateContent = clientFor(moduleId);

      await generateReading([makeClient(generateContent)], MODULE_PHOTOS[moduleId], moduleId);

      const [[callArgs]] = generateContent.mock.calls;
      expect(callArgs.config.systemInstruction).toBe(READING_SYSTEM_PROMPTS[moduleId]);
    }
  );

  it.each(['hero', 'party', 'nemesis'] as const)(
    'accepts the correct photo count for %s',
    async (moduleId) => {
      const generateContent = clientFor(moduleId);

      await expect(generateReading([makeClient(generateContent)], MODULE_PHOTOS[moduleId], moduleId)).resolves.toBeDefined();
      expect(generateContent).toHaveBeenCalledTimes(1);
    }
  );

  it('rejects a photo count that does not match the module', async () => {
    const generateContent = jest.fn();

    await expect(
      generateReading([makeClient(generateContent)], PHOTOS_1, 'hero')
    ).rejects.toBeInstanceOf(ReadingServiceError);
    expect(generateContent).not.toHaveBeenCalled();
  });

  // Security boundary: a client that skipped the app entirely (or a
  // rewritten frontend) could otherwise submit arbitrary non-image bytes
  // and have this service forward them into Gemini's vision input on a
  // paid call. Rejecting before generateContent is ever reached both
  // closes that off and avoids wasting the call.
  it('rejects a photo that is not a real JPEG, before calling the model', async () => {
    const generateContent = jest.fn();
    const notAPhoto = Buffer.from('definitely not an image').toString('base64');

    await expect(
      generateReading([makeClient(generateContent)], [notAPhoto, PHOTOS_3[1], PHOTOS_3[2]])
    ).rejects.toBeInstanceOf(InvalidImageError);
    expect(generateContent).not.toHaveBeenCalled();
  });
});
