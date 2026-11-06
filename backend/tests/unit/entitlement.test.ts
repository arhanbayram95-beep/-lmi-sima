import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { everyModule, ReadingModelClient } from '../../src/services/geminiClient';
import { RevenueCatClient } from '../../src/services/revenueCatClient';
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

describe('entitlement check (hard gate — every reading requires an active subscription)', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    generateContent = jest.fn().mockResolvedValue(textResponse(CHARACTER_READING));
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(async () => {
    await app.close();
    errorSpy.mockRestore();
  });

  it('allows the request through when no RevenueCat client is configured (local dev/CI)', async () => {
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(everyModule([readingModelClient])); // no revenueCatClient passed — matches an unset REVENUECAT_API_KEY

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: { photos: PHOTOS_3 } });

    expect(response.statusCode).toBe(200);
  });

  it('rejects with 403 when the client sends no app-user-id header', async () => {
    const revenueCatClient: RevenueCatClient = { fetchSubscriber: jest.fn() };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(everyModule([readingModelClient]), revenueCatClient);

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: { photos: PHOTOS_3 } });

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({ code: 'ENTITLEMENT_REQUIRED' });
    expect(revenueCatClient.fetchSubscriber).not.toHaveBeenCalled();
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('gates the portrait endpoint too, before any paid image call', async () => {
    const revenueCatClient: RevenueCatClient = { fetchSubscriber: jest.fn() };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(everyModule([readingModelClient]), revenueCatClient);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/portrait',
      payload: {
        photo: PHOTOS_3[0],
        character: {
          name: 'Wren',
          epithet: 'the Bold',
          lineage: 'Elf',
          character_class: 'Bard',
          alignment: 'Chaotic Good',
          starting_gear: ['Lute'],
          companion_species: 'Owl',
        },
      },
    });

    expect([response.statusCode, generateContent.mock.calls.length]).toEqual([403, 0]);
  });

  it('allows the request through when the subscriber has an active entitlement', async () => {
    const revenueCatClient: RevenueCatClient = {
      fetchSubscriber: jest.fn().mockResolvedValue({ entitlements: { aura_pro_access: { expires_date: null } } }),
    };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(everyModule([readingModelClient]), revenueCatClient);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: PHOTOS_3 },
      headers: { 'x-revenuecat-app-user-id': 'user-123' },
    });

    expect(response.statusCode).toBe(200);
    expect(revenueCatClient.fetchSubscriber).toHaveBeenCalledWith('user-123');
  });

  it('rejects with 403 when the subscriber has no active entitlement', async () => {
    const revenueCatClient: RevenueCatClient = {
      fetchSubscriber: jest.fn().mockResolvedValue({ entitlements: {} }),
    };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(everyModule([readingModelClient]), revenueCatClient);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: PHOTOS_3 },
      headers: { 'x-revenuecat-app-user-id': 'user-456' },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({ code: 'ENTITLEMENT_REQUIRED' });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('rejects with 403 (fails closed) when the RevenueCat lookup itself fails', async () => {
    const revenueCatClient: RevenueCatClient = {
      fetchSubscriber: jest.fn().mockRejectedValue(new Error('RevenueCat is down')),
    };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(everyModule([readingModelClient]), revenueCatClient);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: PHOTOS_3 },
      headers: { 'x-revenuecat-app-user-id': 'user-789' },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({ code: 'ENTITLEMENT_REQUIRED' });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('lookup failed'), expect.any(Error));
  });
});
