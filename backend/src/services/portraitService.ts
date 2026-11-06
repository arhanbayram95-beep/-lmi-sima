import { ApiError, Modality } from '@google/genai';
import { ReadingModelClient } from './geminiClient';
import { assertLooksLikeJpeg } from './imageValidation';

// On-demand illustrated portrait of a generated character, rendered from
// the user's own photo plus the sheet (PROJECT_SPEC.md §0, "Portraits").
// The product owner chose a likeness on purpose (2026-11-06), knowing it
// sends the photo to the image model too; PORTRAIT_RULES is what keeps it a
// costume rather than a judgement or an alteration of the person.
// Process-and-discard as everywhere else: nothing here is persisted.

export class PortraitServiceError extends Error {}

// Model IDs come from Google's 2026 image-model lineup; the -lite model is a
// separate capacity pool, so the retry tries it instead of re-hitting the
// primary (same reasoning as readingService.ts's FALLBACK_MODEL).
export const PORTRAIT_MODEL = 'gemini-3.1-flash-image';
export const PORTRAIT_FALLBACK_MODEL = 'gemini-3.1-flash-lite-image';

const TIMEOUT_MS_PER_ATTEMPT = 60_000;
const NON_RETRYABLE_STATUS_CODES = new Set([400, 401, 403]);

export interface PortraitSubject {
  name: string;
  epithet: string;
  lineage: string;
  character_class: string;
  alignment: string;
  starting_gear: string[];
  companion_species: string;
}

export interface PortraitResult {
  mime_type: string;
  data: string;
}

// Load-bearing safety copy: changes need the same explicit flag as
// systemPrompt.ts's SAFETY_RULES (CLAUDE.md "What NOT to Do").
export const PORTRAIT_RULES = `Rules, non-negotiable:
- Paint a stylized fantasy illustration (painterly, storybook or game-card art), never a photorealistic image.
- Keep the person recognizable through their expression, hairstyle, and overall look, but do not change their apparent age, skin tone, ethnicity, body shape, or facial features, and do not "beautify", slim, sexualize, or age them. Fully clothed in the character's costume.
- No text, letters, logos, watermarks, or trademarked characters or costumes in the image.
- If the photo does not clearly show one adult human face, or the person appears to be a minor, do not draw a person: paint only the character's gear and companion as a still-life emblem instead.`;

export function buildPortraitPrompt(subject: PortraitSubject, villain: boolean): string {
  const tone = villain
    ? 'as a campy, theatrical fantasy villain: dramatic and fun, never frightening or gruesome'
    : 'as a heroic fantasy adventurer';
  return `Paint the person in this photo ${tone}: ${subject.name}, ${subject.epithet}, a ${subject.alignment} ${subject.lineage} ${subject.character_class}. Costume and props drawn from their gear: ${subject.starting_gear.join('; ')}. Include their companion, a ${subject.companion_species}. Portrait framing, head and shoulders to waist, dramatic lighting, rich crimson and gold palette.

${PORTRAIT_RULES}`;
}

function isRetryable(error: unknown): boolean {
  if (error instanceof ApiError && typeof error.status === 'number') {
    return !NON_RETRYABLE_STATUS_CODES.has(error.status);
  }
  return true;
}

export async function generatePortrait(
  clients: ReadingModelClient[],
  photo: string,
  subject: PortraitSubject,
  villain = false
): Promise<PortraitResult> {
  assertLooksLikeJpeg(photo);
  const prompt = buildPortraitPrompt(subject, villain);
  const attempts = [
    { client: clients[0], model: PORTRAIT_MODEL },
    { client: clients[1 % clients.length], model: PORTRAIT_FALLBACK_MODEL },
  ];

  let response: Awaited<ReturnType<ReadingModelClient['models']['generateContent']>> | undefined;
  for (const [index, { client, model }] of attempts.entries()) {
    try {
      response = await client.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [{ inlineData: { mimeType: 'image/jpeg', data: photo } }, { text: prompt }],
          },
        ],
        config: {
          responseModalities: [Modality.IMAGE],
          imageConfig: { aspectRatio: '3:4' },
          httpOptions: { timeout: TIMEOUT_MS_PER_ATTEMPT },
        },
      });
      break;
    } catch (cause) {
      if (!isRetryable(cause) || index === attempts.length - 1) {
        throw new PortraitServiceError('Failed to reach the image model.', { cause });
      }
      console.error(`Portrait call failed on ${model}, retrying on fallback:`, cause);
    }
  }

  const image = response?.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData;
  if (!image?.data) {
    // Usually a safety block: the model answered with text or nothing.
    throw new PortraitServiceError('The image model did not return a portrait.');
  }
  return { mime_type: image.mimeType ?? 'image/png', data: image.data };
}
