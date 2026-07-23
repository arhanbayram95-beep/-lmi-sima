import { AnthropicMessagesClient } from '../../src/services/anthropicClient';
import { generateReading, ReadingServiceError } from '../../src/services/readingService';
import { SUBMIT_READING_TOOL_NAME } from '../../src/services/readingSchema';

const PHOTOS = { calm: 'base64-calm', bright: 'base64-bright', deep: 'base64-deep' };

function makeClient(create: AnthropicMessagesClient['messages']['create']): AnthropicMessagesClient {
  return { messages: { create } };
}

function toolUseResponse(input: unknown) {
  return {
    content: [{ type: 'tool_use', id: 'tool_1', name: SUBMIT_READING_TOOL_NAME, input }],
  };
}

describe('generateReading', () => {
  it('returns the structured reading parsed from the submit_reading tool call', async () => {
    const create = jest.fn().mockResolvedValue(
      toolUseResponse({
        headline: 'Effortlessly Magnetic',
        expression_insights: [
          { expression: 'calm', insight: 'Grounded and steady.' },
          { expression: 'bright', insight: 'Genuinely warm smile.' },
          { expression: 'deep', insight: 'A hint of quiet mystery.' },
        ],
        narrative: 'You read as someone people trust instantly.',
      })
    );

    const result = await generateReading(makeClient(create), PHOTOS);

    expect(result.headline).toBe('Effortlessly Magnetic');
    expect(result.expression_insights).toHaveLength(3);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('sends the three images before the text content, per PROJECT_SPEC.md §4', async () => {
    const create = jest.fn().mockResolvedValue(
      toolUseResponse({ headline: 'h', expression_insights: [], narrative: 'n' })
    );

    await generateReading(makeClient(create), PHOTOS);

    const [[callArgs]] = create.mock.calls;
    const content = callArgs.messages[0].content;
    expect(content.slice(0, 3).every((block: { type: string }) => block.type === 'image')).toBe(true);
    expect(content[3].type).toBe('text');
  });

  it('forces the submit_reading tool via tool_choice', async () => {
    const create = jest.fn().mockResolvedValue(
      toolUseResponse({ headline: 'h', expression_insights: [], narrative: 'n' })
    );

    await generateReading(makeClient(create), PHOTOS);

    const [[callArgs]] = create.mock.calls;
    expect(callArgs.tool_choice).toEqual({ type: 'tool', name: SUBMIT_READING_TOOL_NAME });
  });

  it('wraps a network failure as a ReadingServiceError', async () => {
    const create = jest.fn().mockRejectedValue(new Error('ECONNRESET'));

    await expect(generateReading(makeClient(create), PHOTOS)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the model responds without calling submit_reading', async () => {
    const create = jest.fn().mockResolvedValue({ content: [{ type: 'text', text: 'no tool use here' }] });

    await expect(generateReading(makeClient(create), PHOTOS)).rejects.toBeInstanceOf(ReadingServiceError);
  });

  it('throws when the tool input does not match the expected schema', async () => {
    const create = jest.fn().mockResolvedValue(toolUseResponse({ headline: 'h' }));

    await expect(generateReading(makeClient(create), PHOTOS)).rejects.toBeInstanceOf(ReadingServiceError);
  });
});
