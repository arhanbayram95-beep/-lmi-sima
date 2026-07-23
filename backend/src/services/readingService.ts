import { AnthropicMessagesClient } from './anthropicClient';
import { ExpressionInsight, ReadingResult, submitReadingTool, SUBMIT_READING_TOOL_NAME } from './readingSchema';
import { READING_SYSTEM_PROMPT } from './systemPrompt';

export interface ExpressionPhotos {
  calm: string;
  bright: string;
  deep: string;
}

export class ReadingServiceError extends Error {}

const MODEL = 'claude-sonnet-5';

// process-and-discard per PROJECT_SPEC.md §3: this function never persists
// the incoming base64 strings anywhere (no disk, no db, no in-memory cache
// outside its own call stack), and holds no reference to them after it
// returns. That is the extent "memory clearing" means in a Node/JS
// process — there is no secure-wipe primitive to reach for here.
export async function generateReading(
  client: AnthropicMessagesClient,
  photos: ExpressionPhotos
): Promise<ReadingResult> {
  let response;
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: READING_SYSTEM_PROMPT,
      tools: [submitReadingTool],
      tool_choice: { type: 'tool', name: SUBMIT_READING_TOOL_NAME },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: photos.calm } },
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: photos.bright } },
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: photos.deep } },
            {
              type: 'text',
              text: 'These are three photos in order: Calm, Bright, Deep. Generate the reading now.',
            },
          ],
        },
      ],
    });
  } catch (cause) {
    throw new ReadingServiceError('Failed to reach the Anthropic API.', { cause });
  }

  const toolUseBlock = response.content.find(
    (block): block is Extract<typeof block, { type: 'tool_use' }> => block.type === 'tool_use'
  );

  if (!toolUseBlock || toolUseBlock.name !== SUBMIT_READING_TOOL_NAME) {
    throw new ReadingServiceError('Anthropic response did not include the expected submit_reading tool call.');
  }

  return validateReadingResult(toolUseBlock.input);
}

function validateReadingResult(input: unknown): ReadingResult {
  if (typeof input !== 'object' || input === null) {
    throw new ReadingServiceError('submit_reading tool input was not an object.');
  }

  const { headline, expression_insights: insights, narrative } = input as Record<string, unknown>;

  if (typeof headline !== 'string' || typeof narrative !== 'string' || !Array.isArray(insights)) {
    throw new ReadingServiceError('submit_reading tool input did not match the expected schema.');
  }

  return {
    headline,
    narrative,
    expression_insights: insights as ExpressionInsight[],
  };
}
