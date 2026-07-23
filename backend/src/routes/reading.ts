import { FastifyInstance } from 'fastify';
import { AnthropicMessagesClient } from '../services/anthropicClient';
import { generateReading, ReadingServiceError } from '../services/readingService';
import { requireActiveEntitlement } from '../middleware/entitlement';

const analyzeBodySchema = {
  type: 'object',
  required: ['calm', 'bright', 'deep'],
  properties: {
    calm: { type: 'string', minLength: 1 },
    bright: { type: 'string', minLength: 1 },
    deep: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;

interface AnalyzeRequestBody {
  calm: string;
  bright: string;
  deep: string;
}

export function registerReadingRoutes(app: FastifyInstance, anthropicClient: AnthropicMessagesClient): void {
  app.post<{ Body: AnalyzeRequestBody }>(
    '/api/v1/reading/analyze',
    { preHandler: requireActiveEntitlement, schema: { body: analyzeBodySchema } },
    async (request, reply) => {
      try {
        const result = await generateReading(anthropicClient, request.body);
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
