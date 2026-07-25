import { ReadingModelClient } from '../../src/services/geminiClient';
import { generateReading, ReadingServiceError } from '../../src/services/readingService';
import { ReadingModuleId } from '../../src/services/readingSchema';
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

function makeClient(generateContent: ReadingModelClient['models']['generateContent']): ReadingModelClient {
  return { models: { generateContent } };
}

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

describe('generateReading', () => {
  it('returns the structured reading parsed from the JSON response text', async () => {
    const generateContent = jest.fn().mockResolvedValue(
      textResponse({
        headline: 'Effortlessly Magnetic',
        insights: [
          { label: 'Calm', insight: 'Grounded and steady.' },
          { label: 'Bright', insight: 'Genuinely warm smile.' },
          { label: 'Deep', insight: 'A hint of quiet mystery.' },
        ],
        narrative: 'You read as someone people trust instantly.',
      })
    );

    const result = await generateReading(makeClient(generateContent), PHOTOS_3);

    expect(result.headline).toBe('Effortlessly Magnetic');
    expect(result.insights).toHaveLength(3);
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('sends the images before the text content, per PROJECT_SPEC.md §4', async () => {
    const generateContent = jest.fn().mockResolvedValue(textResponse({ headline: 'h', insights: [], narrative: 'n' }));

    await generateReading(makeClient(generateContent), PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    const parts = callArgs.contents[0].parts;
    expect(parts.slice(0, 3).every((part: { inlineData?: unknown }) => !!part.inlineData)).toBe(true);
    expect(parts[3].text).toBeDefined();
  });

  it('forces JSON structured output via responseSchema', async () => {
    const generateContent = jest.fn().mockResolvedValue(textResponse({ headline: 'h', insights: [], narrative: 'n' }));

    await generateReading(makeClient(generateContent), PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.responseMimeType).toBe('application/json');
    expect(callArgs.config.responseSchema).toBeDefined();
  });

  it('wraps a network failure as a ReadingServiceError', async () => {
    const generateContent = jest.fn().mockRejectedValue(new Error('ECONNRESET'));

    await expect(generateReading(makeClient(generateContent), PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the model responds with no text output', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: undefined });

    await expect(generateReading(makeClient(generateContent), PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the response text is not valid JSON', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: 'not json' });

    await expect(generateReading(makeClient(generateContent), PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the parsed body does not match the expected schema', async () => {
    const generateContent = jest.fn().mockResolvedValue(textResponse({ headline: 'h' }));

    await expect(generateReading(makeClient(generateContent), PHOTOS_3)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('defaults to the three-expression system prompt when no module is given', async () => {
    const generateContent = jest.fn().mockResolvedValue(textResponse({ headline: 'h', insights: [], narrative: 'n' }));

    await generateReading(makeClient(generateContent), PHOTOS_3);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.systemInstruction).toBe(READING_SYSTEM_PROMPTS['three-expression']);
  });

  it.each(['three-expression', 'relationship-harmony', 'career-match'] as const)(
    "uses the %s module's own system prompt",
    async (moduleId) => {
      const generateContent = jest.fn().mockResolvedValue(textResponse({ headline: 'h', insights: [], narrative: 'n' }));

      await generateReading(makeClient(generateContent), MODULE_PHOTOS[moduleId], moduleId);

      const [[callArgs]] = generateContent.mock.calls;
      expect(callArgs.config.systemInstruction).toBe(READING_SYSTEM_PROMPTS[moduleId]);
    }
  );

  it.each(['three-expression', 'relationship-harmony', 'career-match'] as const)(
    'accepts the correct photo count for %s',
    async (moduleId) => {
      const generateContent = jest.fn().mockResolvedValue(textResponse({ headline: 'h', insights: [], narrative: 'n' }));

      await expect(generateReading(makeClient(generateContent), MODULE_PHOTOS[moduleId], moduleId)).resolves.toBeDefined();
      expect(generateContent).toHaveBeenCalledTimes(1);
    }
  );

  it('rejects a photo count that does not match the module', async () => {
    const generateContent = jest.fn();

    await expect(
      generateReading(makeClient(generateContent), PHOTOS_1, 'three-expression')
    ).rejects.toBeInstanceOf(ReadingServiceError);
    expect(generateContent).not.toHaveBeenCalled();
  });
});
