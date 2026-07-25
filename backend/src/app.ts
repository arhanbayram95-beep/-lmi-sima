import Fastify, { FastifyError, FastifyInstance } from 'fastify';
import { ReadingModelClient } from './services/geminiClient';
import { registerReadingRoutes } from './routes/reading';

export function buildApp(readingModelClient: ReadingModelClient): FastifyInstance {
  const app = Fastify({ logger: false });
  registerReadingRoutes(app, readingModelClient);

  // Defense-in-depth: every expected failure path already responds with a
  // sanitized message (ReadingServiceError handling in routes/reading.ts;
  // Fastify's own schema-validation errors, passed through below, are
  // already safe — they only describe which field/constraint failed).
  // This catches anything genuinely unexpected — a bug, a dependency
  // throwing something unsanitized — before Fastify's default handler
  // would otherwise echo error.message straight back to the client.
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error.validation) {
      reply.status(error.statusCode ?? 400).send({ error: error.message });
      return;
    }
    console.error('Unhandled error in Face Reader backend:', error);
    reply.status(500).send({ error: 'Something went wrong. Please try again.' });
  });

  return app;
}
