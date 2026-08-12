import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

describe('security headers', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    const readingModelClient: ReadingModelClient = { models: { generateContent: jest.fn() } };
    app = await buildApp(readingModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('sets baseline helmet headers on a JSON response', async () => {
    const response = await app.inject({ method: 'GET', url: '/legal/privacy' });

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBeDefined();
    expect(response.headers['content-security-policy']).toBeDefined();
  });

  it('still serves the legal pages with their inline <style> block intact', async () => {
    const response = await app.inject({ method: 'GET', url: '/legal/privacy' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('<style>');
  });
});
