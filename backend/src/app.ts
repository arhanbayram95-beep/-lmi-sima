import Fastify, { FastifyInstance } from 'fastify';
import { ReadingModelClient } from './services/geminiClient';
import { registerReadingRoutes } from './routes/reading';

export function buildApp(readingModelClient: ReadingModelClient): FastifyInstance {
  const app = Fastify({ logger: false });
  registerReadingRoutes(app, readingModelClient);
  return app;
}
