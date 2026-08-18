import { ApiError } from '@google/genai';
import { ReadingModelClient } from '../../src/services/geminiClient';
import { generateReading, ReadingServiceError } from '../../src/services/readingService';
import { READING_SCHEMAS, ReadingModuleId } from '../../src/services/readingSchema';
import { READING_SYSTEM_PROMPTS } from '../../src/services/systemPrompt';

const PHOTOS_3 = ['base64-calm', 'base64-bright', 'base64-deep'];
const PHOTOS_2 = ['base64-person1', 'base64-person2'];
const PHOTOS_1 = ['base64-solo'];

// Matches MODULE_PHOTO_COUNTS in readingSchema.ts — used by tests that need
// a valid photo count for a given module without hardcoding it themselves.
const MODULE_PHOTOS: Record<ReadingModuleId, string[]> = {
  'three-expression': PHOTOS_3,
  'relationship-harmony': PHOTOS_2,
  'career-match': PHOTOS_1,
};

const scoreCard = (title: string, labels: string[]) => ({
  title,
  overall_score: 88,
  breakdown_metrics: labels.map((label, i) => ({ label, score: 80 + i * 3, icon: 'eye' })),
});

// Shared by every deep master card across all three modules — see
// MasterCardNarrative in readingSchema.ts.
const narrative = (heroHook: string) => ({
  hero_hook: heroHook,
  anatomical_decoding: ['Jawline reads decisive.', 'Eyes read direct.', 'Brow line reads composed.'],
  living_scenario: ['Paragraph one.', 'Paragraph two.', 'Paragraph three.'],
  actionable_insight: { headline: 'Balance Point', description: 'A short growth note.' },
});

const mythicTale = (title: string) => ({
  tale_title: title,
  paragraphs: ['Fable paragraph one.', 'Fable paragraph two.', 'Fable paragraph three.'],
});

// Fixtures mirror the shape each module's responseSchema forces — see
// readingSchema.ts. Never the real API in tests, per CLAUDE.md.
const MODULE_RESPONSES: Record<ReadingModuleId, Record<string, unknown>> = {
  'three-expression': {
    module: 'character_analysis',
    oracle_match_card: {
      title: 'The Archetype & Oracle Match',
      archetype_tag: 'Analytical Visionary',
      oracle_match_name: 'A Public Figure',
      facial_landmark_resonance: { percent: 94, archetype_label: 'High-Brow Deadpan Archetypes' },
      aura: { name: 'Crimson Ember', intensity_percent: 82, explanation: 'Driven by prominent brow tension.' },
      ...narrative('A striking hero hook.'),
    },
    sacred_anatomy_card: {
      title: 'Facial Geometry & Sacred Anatomy',
      shape_tag: 'Oval',
      golden_ratio_score: { percent: 91, explanation: 'Balanced forehead-to-chin ratio.' },
      structural_dominance: { brow_percent: 70, cheekbone_percent: 55, jaw_percent: 40 },
      ...narrative('Geometry hero hook.'),
    },
    animal_totem_card: {
      title: 'The Animal Totem & Primal Energy',
      spirit_animal: 'Wolf',
      instinctual_radar: [{ left_trait: 'Pack Loyalty', left_percent: 78, right_trait: 'Lone Independence' }],
      ...narrative('Totem hero hook.'),
    },
    trait_symphony_card: {
      title: 'Trait Symphony & Behavioral Polarities',
      polarity_meters: [{ left_trait: 'Observant Irony', left_percent: 78, right_trait: 'Direct Earnestness' }],
      rarity_index: { one_in_n: 420, trait_reason: 'This exact eye-to-brow symmetry.' },
      ...narrative('Symphony hero hook.'),
    },
    shadow_arcana_card: {
      title: 'The Secret Signature & Shadow Arcana',
      signature_catchphrase: '"Quiet Storm, Loud Impact"',
      shadow_traits: ['Overthinking Under Pressure'],
      life_advice: 'Lean into the pause before you speak.',
      mythic_tale: mythicTale('The Trial of the Ember Wolf'),
      ...narrative('Shadow hero hook.'),
    },
  },
  'relationship-harmony': {
    module: 'relationship_harmony',
    bond_oracle_card: {
      title: 'The Bond Archetype & Oracle Match',
      bond_archetype_tag: 'Grounded & Playful Harmonizer',
      duo_oracle_match: 'A Famous Duo',
      bond_resonance: { percent: 88, archetype_label: 'Steady-Anchor & Spark Pairings' },
      aura: { name: 'Amber Tide', intensity_percent: 76, explanation: 'Driven by complementary energy levels.' },
      ...narrative('Bond hero hook.'),
    },
    chemistry_geometry_card: {
      title: 'Chemistry Geometry & Synergy Score',
      synergy_score: scoreCard('Synergy Score', ['Empathy', 'Communication', 'Attachment', 'Energy Match']),
      ...narrative('Chemistry hero hook.'),
    },
    instinctual_dynamics_card: {
      title: 'Instinctual Dynamics & Primal Rhythm',
      dynamics_radar: [{ left_trait: 'Playful Push-Pull', left_percent: 78, right_trait: 'Steady Anchoring' }],
      ...narrative('Dynamics hero hook.'),
    },
    bond_shadow_arcana_card: {
      title: 'The Secret Signature & Shadow Arcana of the Bond',
      duo_catchphrase: '"Calm Meets Chaos, On Purpose"',
      shadow_traits: ['Overplanning Spontaneous Moments'],
      guidance_checklist: [{ headline: 'Direct Communication', description: 'Say it early and plainly.' }],
      mythic_tale: mythicTale('The Bound Wayfarers'),
      ...narrative('Bond shadow hero hook.'),
    },
  },
  'career-match': {
    module: 'career_path',
    career_oracle_card: {
      title: 'The Career Archetype & Oracle Match',
      work_archetype_tag: 'Strategic Innovator',
      career_oracle_match: 'A Public Figure',
      career_resonance: { percent: 90, archetype_label: 'Calm-Under-Fire Builders' },
      aura: { name: 'Slate Ember', intensity_percent: 80, explanation: 'Driven by composed decision-making.' },
      ...narrative('Career hero hook.'),
    },
    industry_geometry_card: {
      title: 'Industry Geometry & Work-Style Radar',
      work_style_radar: [{ left_trait: 'Deep-Focus Craft', left_percent: 74, right_trait: 'Fast-Paced Hustle' }],
      top_industry_pills: ['Engineering & R&D'],
      ...narrative('Industry hero hook.'),
    },
    career_trait_symphony_card: {
      title: 'Trait Symphony & Working Polarities',
      polarity_meters: [{ left_trait: 'Structured Thinking', left_percent: 82, right_trait: 'Improvised Adaptation' }],
      rarity_index: { one_in_n: 310, trait_reason: 'This exact pacing under deadline pressure.' },
      ...narrative('Trait hero hook.'),
    },
    career_shadow_arcana_card: {
      title: 'The Secret Signature & Shadow Arcana',
      work_catchphrase: '"Built the Spreadsheet, Ran the Room"',
      shadow_traits: ['Over-Preparing for Small Stakes'],
      role_recommendations: [{ headline: 'Systems Architect', description: 'Structured problem-solving under pressure.' }],
      life_advice: 'Let one plan stay unfinished on purpose.',
      mythic_tale: mythicTale('The Architect of the Long Road'),
      ...narrative('Career shadow hero hook.'),
    },
  },
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
  it('returns the structured card stack parsed from the JSON response text', async () => {
    const generateContent = clientFor('three-expression');

    const result = await generateReading([makeClient(generateContent)], PHOTOS_3);

    expect(result).toMatchObject({ oracle_match_card: { archetype_tag: 'Analytical Visionary' } });
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('stamps the module discriminator from the requested module, not the model output', async () => {
    const generateContent = jest.fn().mockResolvedValue(
      textResponse({ ...MODULE_RESPONSES['career-match'], module: 'something_else' })
    );

    const result = await generateReading([makeClient(generateContent)], PHOTOS_1, 'career-match');

    expect(result.module).toBe('career_path');
  });

  it('sends the images before the text content, per PROJECT_SPEC.md §4', async () => {
    const generateContent = clientFor('three-expression');

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    const parts = callArgs.contents[0].parts;
    expect(parts.slice(0, 3).every((part: { inlineData?: unknown }) => !!part.inlineData)).toBe(true);
    expect(parts[3].text).toBeDefined();
  });

  it('forces JSON structured output via responseSchema', async () => {
    const generateContent = clientFor('three-expression');

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.responseMimeType).toBe('application/json');
    expect(callArgs.config.responseSchema).toBeDefined();
  });

  it('raises the temperature above the default to widen variety in open-ended picks', async () => {
    const generateContent = clientFor('three-expression');

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.temperature).toBeGreaterThan(1);
  });

  it.each(['three-expression', 'relationship-harmony', 'career-match'] as const)(
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
      .mockResolvedValueOnce(textResponse(MODULE_RESPONSES['three-expression']));

    const result = await generateReading([makeClient(generateContent)], PHOTOS_3);

    expect(result).toMatchObject({ oracle_match_card: { archetype_tag: 'Analytical Visionary' } });
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
    const workingContent = jest.fn().mockResolvedValue(textResponse(MODULE_RESPONSES['three-expression']));

    const result = await generateReading(
      [makeClient(failingContent), makeClient(workingContent)],
      PHOTOS_3
    );

    expect(result).toMatchObject({ oracle_match_card: { archetype_tag: 'Analytical Visionary' } });
    expect(failingContent).toHaveBeenCalledTimes(1);
    expect(workingContent).toHaveBeenCalledTimes(1);
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
      .mockResolvedValueOnce(textResponse(MODULE_RESPONSES['three-expression']));

    const result = await generateReading([makeClient(generateContent)], PHOTOS_3);

    expect(result).toMatchObject({ oracle_match_card: { archetype_tag: 'Analytical Visionary' } });
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

  it('throws when a card the module renders is missing from the response', async () => {
    const { shadow_arcana_card, ...withoutShadowArcana } = MODULE_RESPONSES['three-expression'];
    const generateContent = jest.fn().mockResolvedValue(textResponse(withoutShadowArcana));

    await expect(generateReading([makeClient(generateContent)], PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  // Regression: a live Gemini response once came back with a card present
  // but missing one of its own array fields, which an old top-level-only
  // check let through — ReadingCards.tsx's `.map()` over the missing array
  // then crashed RevealScreen for the career-match module in production.
  it('throws when a card is present but missing one of its own required nested fields', async () => {
    const { top_industry_pills, ...industryGeometryWithoutPills } = MODULE_RESPONSES['career-match'].industry_geometry_card as Record<
      string,
      unknown
    >;
    const malformed = {
      ...MODULE_RESPONSES['career-match'],
      industry_geometry_card: industryGeometryWithoutPills,
    };
    const generateContent = jest.fn().mockResolvedValue(textResponse(malformed));

    await expect(
      generateReading([makeClient(generateContent)], PHOTOS_1, 'career-match')
    ).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when a required array field comes back as the wrong type', async () => {
    const malformed = {
      ...MODULE_RESPONSES['career-match'],
      career_shadow_arcana_card: {
        ...(MODULE_RESPONSES['career-match'].career_shadow_arcana_card as Record<string, unknown>),
        role_recommendations: 'not an array',
      },
    };
    const generateContent = jest.fn().mockResolvedValue(textResponse(malformed));

    await expect(
      generateReading([makeClient(generateContent)], PHOTOS_1, 'career-match')
    ).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('defaults to the three-expression system prompt when no module is given', async () => {
    const generateContent = clientFor('three-expression');

    await generateReading([makeClient(generateContent)], PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.systemInstruction).toBe(READING_SYSTEM_PROMPTS['three-expression']);
  });

  it.each(['three-expression', 'relationship-harmony', 'career-match'] as const)(
    "uses the %s module's own system prompt",
    async (moduleId) => {
      const generateContent = clientFor(moduleId);

      await generateReading([makeClient(generateContent)], MODULE_PHOTOS[moduleId], moduleId);

      const [[callArgs]] = generateContent.mock.calls;
      expect(callArgs.config.systemInstruction).toBe(READING_SYSTEM_PROMPTS[moduleId]);
    }
  );

  it.each(['three-expression', 'relationship-harmony', 'career-match'] as const)(
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
      generateReading([makeClient(generateContent)], PHOTOS_1, 'three-expression')
    ).rejects.toBeInstanceOf(ReadingServiceError);
    expect(generateContent).not.toHaveBeenCalled();
  });
});
