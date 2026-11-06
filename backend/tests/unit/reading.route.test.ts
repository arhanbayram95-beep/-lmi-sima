import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { everyModule, ReadingModelClient } from '../../src/services/geminiClient';
import { MODULE_RESPONSES } from '../fixtures/characterSheets';

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

// assertLooksLikeJpeg (imageValidation.ts) rejects anything that doesn't
// start with the JPEG magic bytes, so every fixture meant to actually
// reach the (mocked) Gemini call has to look like a real JPEG.
function jpegBase64(label: string): string {
  return Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.from(label)]).toString('base64');
}

const PHOTOS_3 = [jpegBase64('calm'), jpegBase64('bright'), jpegBase64('deep')];
const VALID_BODY = { photos: PHOTOS_3 };

const CHARACTER_READING = MODULE_RESPONSES.hero;
const NEMESIS_READING = MODULE_RESPONSES.nemesis;

describe('POST /api/v1/reading/analyze', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(async () => {
    generateContent = jest.fn();
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(everyModule([readingModelClient]));
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 200 with the structured reading on success', async () => {
    generateContent.mockResolvedValue(textResponse(CHARACTER_READING));

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: VALID_BODY });

    expect(response.statusCode).toBe(200);
    expect(response.json().hero.name).toBe('Wren Ashdown');
  });

  it('returns 400 when photos is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('returns 400 when more than 3 photos are sent', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: [...PHOTOS_3, 'one-too-many'] },
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('returns 502 when the photo count does not match the module', async () => {
    // hero (the default module) needs exactly 3 photos.
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: ['only-one'] },
    });

    expect(response.statusCode).toBe(502);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('returns 502 when the Gemini API call fails mid-analysis', async () => {
    generateContent.mockRejectedValue(new Error('network failure'));

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: VALID_BODY });

    expect(response.statusCode).toBe(502);
  });

  it('rejects a single oversized photo before calling the model', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: ['a'.repeat(8_000_001), PHOTOS_3[1], PHOTOS_3[2]] },
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('accepts a valid module and forwards it to the reading service', async () => {
    generateContent.mockResolvedValue(textResponse(NEMESIS_READING));

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      // nemesis needs exactly 1 photo.
      payload: { photos: [jpegBase64('solo')], module: 'nemesis' },
    });

    expect(response.statusCode).toBe(200);
    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.systemInstruction).toMatch(/evil twin/i);
  });

  it('accepts a realistic multi-photo payload larger than the default 1 MiB body limit', async () => {
    generateContent.mockResolvedValue(textResponse(CHARACTER_READING));

    // ~3MB per photo is in the realistic range for a real, uncapped-
    // resolution phone photo at quality 0.6 (see CaptureScreen.tsx) -
    // comfortably exceeds Fastify's default 1 MiB *total* bodyLimit even
    // alone, which is what real camera captures hit in practice, not just
    // a contrived edge case. Regression test for that gap. Prefixed with
    // the JPEG magic bytes so it still passes assertLooksLikeJpeg.
    const bigPhoto = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(3_000_000, 'A')]).toString(
      'base64'
    );
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: [bigPhoto, bigPhoto, bigPhoto] },
    });

    expect(response.statusCode).toBe(200);
  });

  it('rejects an unknown module value', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { ...VALID_BODY, module: 'not-a-real-module' },
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });
});
