import { ReadingModelClient } from '../../src/services/geminiClient';
import { generateReading, ReadingServiceError } from '../../src/services/readingService';

const PHOTOS = { calm: 'base64-calm', bright: 'base64-bright', deep: 'base64-deep' };

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
        expression_insights: [
          { expression: 'calm', insight: 'Grounded and steady.' },
          { expression: 'bright', insight: 'Genuinely warm smile.' },
          { expression: 'deep', insight: 'A hint of quiet mystery.' },
        ],
        narrative: 'You read as someone people trust instantly.',
      })
    );

    const result = await generateReading(makeClient(generateContent), PHOTOS);

    expect(result.headline).toBe('Effortlessly Magnetic');
    expect(result.expression_insights).toHaveLength(3);
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('sends the three images before the text content, per PROJECT_SPEC.md §4', async () => {
    const generateContent = jest.fn().mockResolvedValue(
      textResponse({ headline: 'h', expression_insights: [], narrative: 'n' })
    );

    await generateReading(makeClient(generateContent), PHOTOS);

    const [[callArgs]] = generateContent.mock.calls;
    const parts = callArgs.contents[0].parts;
    expect(parts.slice(0, 3).every((part: { inlineData?: unknown }) => !!part.inlineData)).toBe(true);
    expect(parts[3].text).toBeDefined();
  });

  it('forces JSON structured output via responseSchema', async () => {
    const generateContent = jest.fn().mockResolvedValue(
      textResponse({ headline: 'h', expression_insights: [], narrative: 'n' })
    );

    await generateReading(makeClient(generateContent), PHOTOS);

    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.responseMimeType).toBe('application/json');
    expect(callArgs.config.responseSchema).toBeDefined();
  });

  it('wraps a network failure as a ReadingServiceError', async () => {
    const generateContent = jest.fn().mockRejectedValue(new Error('ECONNRESET'));

    await expect(generateReading(makeClient(generateContent), PHOTOS)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the model responds with no text output', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: undefined });

    await expect(generateReading(makeClient(generateContent), PHOTOS)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the response text is not valid JSON', async () => {
    const generateContent = jest.fn().mockResolvedValue({ text: 'not json' });

    await expect(generateReading(makeClient(generateContent), PHOTOS)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the parsed body does not match the expected schema', async () => {
    const generateContent = jest.fn().mockResolvedValue(textResponse({ headline: 'h' }));

    await expect(generateReading(makeClient(generateContent), PHOTOS)).rejects.toBeInstanceOf(ReadingServiceError);
  });
});
