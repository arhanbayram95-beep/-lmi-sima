import { FastifyInstance } from 'fastify';
import { ReadingModelClient } from '../services/geminiClient';
import { RevenueCatClient } from '../services/revenueCatClient';
import { generateReading, ReadingServiceError } from '../services/readingService';
import { InvalidImageError } from '../services/imageValidation';
import { createEntitlementCheck } from '../middleware/entitlement';
import { generatePortrait, PortraitServiceError, PortraitSubject } from '../services/portraitService';
import { READING_MODULE_IDS, ReadingModuleId } from '../services/readingSchema';

// maxLength guards against a single grossly-oversized photo (e.g. abuse
// stuffing tens of megabytes into one field) wasting a paid Gemini call
// before the request even looks like a real photo — 8,000,000 chars
// comfortably covers a real full-resolution phone photo at quality 0.6
// (uncapped resolution capture; see CaptureScreen.tsx's takePictureAsync)
// with room to spare, not just a synthetic small test payload. app.ts's
// bodyLimit is the real backstop for total request size across all 3
// photos — this is defense-in-depth for the per-field asymmetric case,
// not a replacement.
// maxItems: 3 matches the largest module (Character Analysis) — exact
// per-module count is enforced in generateReading, not here, since a
// single JSON schema can't express "3 if module X, 1 if module Y."
const analyzeBodySchema = {
  type: 'object',
  required: ['photos'],
  properties: {
    photos: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      items: { type: 'string', minLength: 1, maxLength: 8_000_000 },
    },
    // Optional + defaulted rather than required, so older/mocked clients
    // that never send it still get the default hero sheet.
    module: { type: 'string', enum: READING_MODULE_IDS },
  },
  additionalProperties: false,
} as const;

const shortText = { type: 'string', minLength: 1, maxLength: 200 } as const;

// One photo plus the few sheet fields the portrait prompt uses, never the
// whole sheet: keeps the paid image call's input small and bounded.
const portraitBodySchema = {
  type: 'object',
  required: ['photo', 'character'],
  properties: {
    photo: { type: 'string', minLength: 1, maxLength: 8_000_000 },
    villain: { type: 'boolean' },
    character: {
      type: 'object',
      required: ['name', 'epithet', 'lineage', 'character_class', 'alignment', 'starting_gear', 'companion_species'],
      properties: {
        name: shortText,
        epithet: shortText,
        lineage: shortText,
        character_class: shortText,
        alignment: shortText,
        starting_gear: { type: 'array', minItems: 1, maxItems: 5, items: shortText },
        companion_species: shortText,
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
} as const;

interface PortraitRequestBody {
  photo: string;
  villain?: boolean;
  character: PortraitSubject;
}

interface AnalyzeRequestBody {
  photos: string[];
  module?: ReadingModuleId;
}

export function registerReadingRoutes(
  app: FastifyInstance,
  readingModelClients: Record<ReadingModuleId, ReadingModelClient[]>,
  revenueCatClient?: RevenueCatClient
): void {
  app.post<{ Body: AnalyzeRequestBody }>(
    '/api/v1/reading/analyze',
    { preHandler: createEntitlementCheck(revenueCatClient), schema: { body: analyzeBodySchema } },
    async (request, reply) => {
      try {
        // Same default as generateReading's own moduleId parameter — the
        // client selected here has to match the module generateReading
        // actually processes, not just whatever the client is keyed by.
        const moduleId = request.body.module ?? 'hero';
        const result = await generateReading(readingModelClients[moduleId], request.body.photos, moduleId);
        return reply.status(200).send(result);
      } catch (error) {
        if (error instanceof InvalidImageError) {
          // A client/malformed-input problem, not an upstream failure — a
          // 400, not the 502 ReadingServiceError gets below.
          return reply.status(400).send({ error: error.message });
        }
        if (error instanceof ReadingServiceError) {
          // The 502 body only ever carries the sanitized message (see
          // ReadingServiceError call sites in readingService.ts) — log the
          // full error here, server-side only, so a Gemini-side failure or
          // schema mismatch is diagnosable from the terminal instead of
          // disappearing silently.
          console.error('Reading generation failed:', error.message, error.cause ?? '');
          return reply.status(502).send({ error: error.message });
        }
        throw error;
      }
    }
  );

  app.post<{ Body: PortraitRequestBody }>(
    '/api/v1/reading/portrait',
    { preHandler: createEntitlementCheck(revenueCatClient), schema: { body: portraitBodySchema } },
    async (request, reply) => {
      try {
        const { photo, character, villain } = request.body;
        const portrait = await generatePortrait(readingModelClients.hero, photo, character, villain ?? false);
        return reply.status(200).send(portrait);
      } catch (error) {
        if (error instanceof InvalidImageError) {
          return reply.status(400).send({ error: error.message });
        }
        if (error instanceof PortraitServiceError) {
          console.error('Portrait generation failed:', error.message, error.cause ?? '');
          return reply.status(502).send({ error: error.message });
        }
        throw error;
      }
    }
  );
}
