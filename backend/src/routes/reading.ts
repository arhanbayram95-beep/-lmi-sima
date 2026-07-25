import { FastifyInstance } from 'fastify';
import { ReadingModelClient } from '../services/geminiClient';
import { generateReading, ReadingServiceError } from '../services/readingService';
import { requireActiveEntitlement } from '../middleware/entitlement';
import { READING_MODULE_IDS, ReadingModuleId } from '../services/readingSchema';

// maxLength guards against a single oversized photo (e.g. abuse stuffing
// megabytes into one field) wasting a paid Gemini call before the request
// even looks like a real photo. Fastify's global bodyLimit (1 MiB default,
// see app.ts) is the real backstop for total request size — this is
// defense-in-depth for the per-field asymmetric case, not a replacement.
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
      items: { type: 'string', minLength: 1, maxLength: 1_000_000 },
    },
    // Optional + defaulted rather than required, so older/mocked clients
    // that never send it still get the original three-expression reading.
    module: { type: 'string', enum: READING_MODULE_IDS },
  },
  additionalProperties: false,
} as const;

interface AnalyzeRequestBody {
  photos: string[];
  module?: ReadingModuleId;
}

export function registerReadingRoutes(app: FastifyInstance, readingModelClient: ReadingModelClient): void {
  app.post<{ Body: AnalyzeRequestBody }>(
    '/api/v1/reading/analyze',
    { preHandler: requireActiveEntitlement, schema: { body: analyzeBodySchema } },
    async (request, reply) => {
      try {
        const result = await generateReading(readingModelClient, request.body.photos, request.body.module);
        return reply.status(200).send(result);
      } catch (error) {
        if (error instanceof ReadingServiceError) {
          return reply.status(502).send({ error: error.message });
        }
        throw error;
      }
    }
  );
}
