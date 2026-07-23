import Fastify, { FastifyInstance } from 'fastify';
import { AnthropicMessagesClient } from './services/anthropicClient';
import { registerReadingRoutes } from './routes/reading';

export function buildApp(anthropicClient: AnthropicMessagesClient): FastifyInstance {
  const app = Fastify({ logger: false });
  registerReadingRoutes(app, anthropicClient);
  return app;
}
