import { ReadingModelClient } from './geminiClient';
import { ExpressionInsight, ReadingResult, readingResponseSchema } from './readingSchema';
import { READING_SYSTEM_PROMPT } from './systemPrompt';

export interface ExpressionPhotos {
  calm: string;
  bright: string;
  deep: string;
}

export class ReadingServiceError extends Error {}

const MODEL = 'gemini-2.5-flash';

// process-and-discard per PROJECT_SPEC.md §3: this function never persists
// the incoming base64 strings anywhere (no disk, no db, no in-memory cache
// outside its own call stack), and holds no reference to them after it
// returns. That is the extent "memory clearing" means in a Node/JS
// process — there is no secure-wipe primitive to reach for here.
export async function generateReading(
  client: ReadingModelClient,
  photos: ExpressionPhotos
): Promise<ReadingResult> {
  let responseText: string | undefined;
  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: photos.calm } },
            { inlineData: { mimeType: 'image/jpeg', data: photos.bright } },
            { inlineData: { mimeType: 'image/jpeg', data: photos.deep } },
            { text: 'These are three photos in order: Calm, Bright, Deep. Generate the reading now.' },
          ],
        },
      ],
      config: {
        systemInstruction: READING_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: readingResponseSchema,
      },
    });
    responseText = response.text;
  } catch (cause) {
    throw new ReadingServiceError('Failed to reach the Gemini API.', { cause });
  }

  if (!responseText) {
    throw new ReadingServiceError('Gemini response did not include any text output.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch (cause) {
    throw new ReadingServiceError('Gemini response was not valid JSON.', { cause });
  }

  return validateReadingResult(parsed);
}

function validateReadingResult(input: unknown): ReadingResult {
  if (typeof input !== 'object' || input === null) {
    throw new ReadingServiceError('Gemini response body was not an object.');
  }

  const { headline, expression_insights: insights, narrative } = input as Record<string, unknown>;

  if (typeof headline !== 'string' || typeof narrative !== 'string' || !Array.isArray(insights)) {
    throw new ReadingServiceError('Gemini response body did not match the expected schema.');
  }

  return {
    headline,
    narrative,
    expression_insights: insights as ExpressionInsight[],
  };
}
