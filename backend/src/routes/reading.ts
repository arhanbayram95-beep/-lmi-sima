import { FastifyInstance } from 'fastify';
import { ReadingModelClient } from '../services/geminiClient';
import { generateReading, ReadingServiceError } from '../services/readingService';
import { requireActiveEntitlement } from '../middleware/entitlement';

// maxLength guards against a single oversized field (e.g. abuse stuffing
// megabytes into one photo) wasting a paid Gemini call before the request
// even looks like 3 real photos. Fastify's global bodyLimit (1 MiB default,
// see app.ts) is the real backstop for total request size — this is
// defense-in-depth for the per-field asymmetric case, not a replacement.
const analyzeBodySchema = {
  type: 'object',
  required: ['calm', 'bright', 'deep'],
  properties: {
    calm: { type: 'string', minLength: 1, maxLength: 1_000_000 },
    bright: { type: 'string', minLength: 1, maxLength: 1_000_000 },
    deep: { type: 'string', minLength: 1, maxLength: 1_000_000 },
  },
  additionalProperties: false,
} as const;

interface AnalyzeRequestBody {
  calm: string;
  bright: string;
  deep: string;
}

export function registerReadingRoutes(app: FastifyInstance, readingModelClient: ReadingModelClient): void {
  app.post<{ Body: AnalyzeRequestBody }>(
    '/api/v1/reading/analyze',
    { preHandler: requireActiveEntitlement, schema: { body: analyzeBodySchema } },
    async (request, reply) => {
      try {
        const result = await generateReading(readingModelClient, request.body);
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
