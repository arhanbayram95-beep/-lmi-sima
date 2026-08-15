import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

describe('health route', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    const readingModelClient: ReadingModelClient = { models: { generateContent: jest.fn() } };
    app = await buildApp(readingModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('responds 200 ok', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('is exempt from rate limiting', async () => {
    let last;
    for (let i = 0; i < 25; i++) {
      last = await app.inject({ method: 'GET', url: '/health' });
    }

    expect(last?.statusCode).toBe(200);
  });
});
