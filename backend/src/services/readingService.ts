import { ApiError, Schema, Type } from '@google/genai';
import { ReadingModelClient } from './geminiClient';
import {
  MODULE_PHOTO_COUNTS,
  MODULE_RESULT_KIND,
  READING_SCHEMAS,
  ReadingModuleId,
  ReadingResult,
} from './readingSchema';
import { READING_SYSTEM_PROMPTS } from './systemPrompt';

export class ReadingServiceError extends Error {}

// 2026-07-28: gemini-2.5-flash returns a 404 ("no longer available to new
// users") on newly-created API keys/projects — confirmed via a live
// generateContent call, not a guess. gemini-flash-latest is Google's
// auto-updating alias for the current recommended flash model, chosen over
// pinning another specific version so this doesn't need another manual
// swap next time a dated model gets deprecated. See PROJECT_SPEC.md §4.
const MODEL = 'gemini-flash-latest';

// Product ask (2026-07-28): open-ended picks (celebrity matches, spirit
// animals, archetype tags) were clustering on the model's own "safe"
// defaults at the API's default temperature. Pushed up (valid range is
// (0, 2] per the SDK) to genuinely widen the pool — paired with
// VARIETY_GUIDANCE in systemPrompt.ts, which does the same job in words.
const READING_TEMPERATURE = 1.3;

// 2026-08-15: live testing found `gemini-flash-latest` returning a real
// 503 UNAVAILABLE ("This model is currently experiencing high demand...")
// on roughly 2 of every 3 calls in a short burst — confirmed via direct
// SDK calls bypassing this app entirely, so it's Google's model capacity,
// not this app's key/config/code. Reported on-device as a 502 "couldn't
// complete your reading" on every occurrence, with no retry — a single
// short-lived capacity blip was surfacing as a hard failure.
//
// 2026-08-15 (later same day): a second, distinct failure mode showed up
// in production — a request that hung with zero bytes back for 90+
// seconds, not a fast structured error. Root cause: nothing anywhere in
// this call chain ever set a timeout (the `@google/genai` client has none
// by default — see its `HttpOptions.timeout`), so a stalled connection to
// Gemini just hung the request indefinitely instead of failing and
// retrying. `TIMEOUT_MS_PER_ATTEMPT` below closes that gap. A timed-out
// request throws whatever the SDK's underlying fetch/abort layer throws
// (not necessarily an `ApiError`), which is exactly why retryability
// switched from an allowlist of known-good `ApiError` statuses to a
// denylist below: an allowlist silently treats every error shape it
// wasn't written for — including a timeout — as non-retryable, which is
// the wrong default here. Real, structural failures (bad request, bad
// auth, unknown model) are the only things actually worth failing fast
// on; everything else — 429, 5xx, a raw network error, a timeout abort —
// is worth one more try before giving up.
// 2026-08-18: a second Gemini key was added specifically to cut the
// failure rate further ("minimize reading fails as much as you can with
// those two keys") -- generateReading now takes an ordered list of
// clients (server.ts puts each module's own key first, the other key
// second) instead of one. Retries cycle through every client in the
// list rather than hammering the same one, so a request can still
// succeed on the second key even if the first is quota-exhausted or
// mid-outage -- a purely module-based split doesn't help an individual
// request when its assigned key is the one having a bad moment.
//
// 2026-08-18 (later same day): first version of this bumped attempts to
// a flat 4 (two tries per key), which roughly doubled worst-case wait
// time to 100+ seconds and was reported as "it takes too long" -- live-
// verified against a real 503 storm where a single un-timed-out direct
// call took 104 seconds to fail. A second try on the *same* key during
// a sustained Gemini-wide outage rarely changes the outcome and mostly
// just adds wait time -- the actual value of a second key is trying it
// at all, not trying it twice. maxAttemptsFor now scales with how many
// clients there are: exactly one attempt per client when there's more
// than one (so 2 keys -> 2 attempts, ~50s worst case instead of ~100s),
// falling back to the original 3-attempt cushion for a single-client
// deploy, since same-key retry is the only resilience available there.
const NON_RETRYABLE_STATUS_CODES = new Set([400, 401, 403, 404]);
const RETRY_BASE_DELAY_MS = 600;
const TIMEOUT_MS_PER_ATTEMPT = 25_000;

function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError && typeof error.status === 'number') {
    return !NON_RETRYABLE_STATUS_CODES.has(error.status);
  }
  return true;
}

function maxAttemptsFor(clientCount: number): number {
  return clientCount > 1 ? clientCount : 3;
}

async function generateContentWithRetry(
  clients: ReadingModelClient[],
  params: Parameters<ReadingModelClient['models']['generateContent']>[0]
): ReturnType<ReadingModelClient['models']['generateContent']> {
  const maxAttempts = maxAttemptsFor(clients.length);
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const client = clients[(attempt - 1) % clients.length];
    try {
      return await client.models.generateContent(params);
    } catch (error) {
      if (!isRetryableError(error) || attempt === maxAttempts) {
        throw error;
      }
      console.error(`Gemini call failed (attempt ${attempt}/${maxAttempts}), retrying:`, error);
      await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_DELAY_MS * attempt));
    }
  }
  // Unreachable — the loop always either returns or throws — but keeps
  // TypeScript satisfied that every path returns a value.
  throw new Error('unreachable');
}

// process-and-discard per PROJECT_SPEC.md §3: this function never persists
// the incoming base64 strings anywhere (no disk, no db, no in-memory cache
// outside its own call stack), and holds no reference to them after it
// returns. That is the extent "memory clearing" means in a Node/JS
// process — there is no secure-wipe primitive to reach for here.
export async function generateReading(
  clients: ReadingModelClient[],
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
    const response = await generateContentWithRetry(clients, {
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
        temperature: READING_TEMPERATURE,
        httpOptions: { timeout: TIMEOUT_MS_PER_ATTEMPT },
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

// Walks the module's own responseSchema (readingSchema.ts) recursively,
// rather than a hand-maintained list of top-level keys — Gemini's
// `responseSchema` is a strong constraint but not a guarantee, and the
// frontend's card renderers (ReadingCards.tsx) call .map() on nested arrays
// like `domains_card.top_industry_pills` with no defensive fallback, per
// this project's "validate at the boundary, trust it past that point"
// convention (CLAUDE.md). A response missing a nested array must fail here
// as a clean 502, not reach RevealScreen as a render crash.
function assertConformsToSchema(value: unknown, schema: Schema, path: string): void {
  switch (schema.type) {
    case Type.OBJECT: {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new ReadingServiceError(`Gemini response ${path} was not an object.`);
      }
      const body = value as Record<string, unknown>;
      for (const key of schema.required ?? []) {
        if (!(key in body)) {
          throw new ReadingServiceError(`Gemini response ${path} was missing "${key}".`);
        }
        const propSchema = schema.properties?.[key];
        if (propSchema) {
          assertConformsToSchema(body[key], propSchema, `${path}.${key}`);
        }
      }
      return;
    }
    case Type.ARRAY: {
      if (!Array.isArray(value)) {
        throw new ReadingServiceError(`Gemini response ${path} was not an array.`);
      }
      if (schema.items) {
        value.forEach((item, index) => assertConformsToSchema(item, schema.items as Schema, `${path}[${index}]`));
      }
      return;
    }
    default:
      // STRING/INTEGER/etc. leaves: the schema already constrains their
      // shape and enum values at generation time — only presence is worth
      // re-checking here.
      if (value === undefined || value === null) {
        throw new ReadingServiceError(`Gemini response ${path} was missing.`);
      }
  }
}

function validateReadingResult(input: unknown, moduleId: ReadingModuleId): ReadingResult {
  assertConformsToSchema(input, READING_SCHEMAS[moduleId], 'body');

  // Stamped here rather than trusted from the model: the module that was
  // asked for is the authoritative answer to which shape came back.
  return { ...(input as Record<string, unknown>), module: MODULE_RESULT_KIND[moduleId] } as ReadingResult;
}
