import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { everyModule, ReadingModelClient } from '../../src/services/geminiClient';
import { MODULE_RESPONSES } from '../fixtures/characterSheets';

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

// assertLooksLikeJpeg (imageValidation.ts) rejects anything that doesn't
// start with the JPEG magic bytes, so fixtures meant to reach the (mocked)
// Gemini call have to look like a real JPEG.
function jpegBase64(label: string): string {
  return Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.from(label)]).toString('base64');
}

const PHOTOS_3 = [jpegBase64('calm'), jpegBase64('bright'), jpegBase64('deep')];

const CHARACTER_READING = MODULE_RESPONSES.hero;

describe('rate limiting on /api/v1/reading/analyze', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(async () => {
    generateContent = jest.fn().mockResolvedValue(textResponse(CHARACTER_READING));
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(everyModule([readingModelClient]));
  });

  afterEach(async () => {
    await app.close();
  });

  it('allows requests under the limit through', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: { photos: PHOTOS_3 } });
    expect(response.statusCode).toBe(200);
  });

  it('returns 429 with a sanitized message once the per-IP limit is exceeded', async () => {
    // The configured limit is 20 requests / 10 minutes (see middleware/rateLimit.ts) —
    // .inject() calls all share the same default remote address, so firing
    // 21 in a row from one test genuinely exercises the real threshold.
    let last;
    for (let i = 0; i < 21; i++) {
      last = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: { photos: PHOTOS_3 } });
    }

    expect(last?.statusCode).toBe(429);
    expect(last?.json()).toEqual({
      error: "You're doing that a bit too fast — please wait a few minutes and try again.",
    });
  });
});
