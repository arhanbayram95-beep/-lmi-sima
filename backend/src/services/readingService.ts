import { ReadingModelClient } from './geminiClient';
import {
  MODULE_PHOTO_COUNTS,
  MODULE_RESULT_KEYS,
  MODULE_RESULT_KIND,
  READING_SCHEMAS,
  ReadingModuleId,
  ReadingResult,
} from './readingSchema';
import { READING_SYSTEM_PROMPTS } from './systemPrompt';

export class ReadingServiceError extends Error {}

const MODEL = 'gemini-2.5-flash';

// process-and-discard per PROJECT_SPEC.md §3: this function never persists
// the incoming base64 strings anywhere (no disk, no db, no in-memory cache
// outside its own call stack), and holds no reference to them after it
// returns. That is the extent "memory clearing" means in a Node/JS
// process — there is no secure-wipe primitive to reach for here.
export async function generateReading(
  client: ReadingModelClient,
  photos: string[],
  moduleId: ReadingModuleId = 'three-expression'
): Promise<ReadingResult> {
  const expectedCount = MODULE_PHOTO_COUNTS[moduleId];
  if (photos.length !== expectedCount) {
    throw new ReadingServiceError(
      `The ${moduleId} reading needs exactly ${expectedCount} photo(s), got ${photos.length}.`
    );
  }

  let responseText: string | undefined;
  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            ...photos.map((data) => ({ inlineData: { mimeType: 'image/jpeg', data } })),
            { text: `These are ${photos.length} photo(s) captured for this reading, in order. Generate the reading now.` },
          ],
        },
      ],
      config: {
        systemInstruction: READING_SYSTEM_PROMPTS[moduleId],
        responseMimeType: 'application/json',
        responseSchema: READING_SCHEMAS[moduleId],
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

  return validateReadingResult(parsed, moduleId);
}

// Structural check only — that every card the module's renderer expects came
// back as an object. The response schema already constrains the inside of
// each card, and the frontend is the only consumer.
function validateReadingResult(input: unknown, moduleId: ReadingModuleId): ReadingResult {
  if (typeof input !== 'object' || input === null) {
    throw new ReadingServiceError('Gemini response body was not an object.');
  }

  const body = input as Record<string, unknown>;

  for (const key of MODULE_RESULT_KEYS[moduleId]) {
    if (typeof body[key] !== 'object' || body[key] === null) {
      throw new ReadingServiceError(`Gemini response body was missing the ${key} card.`);
    }
  }

  // Stamped here rather than trusted from the model: the module that was
  // asked for is the authoritative answer to which shape came back.
  return { ...body, module: MODULE_RESULT_KIND[moduleId] } as ReadingResult;
}
