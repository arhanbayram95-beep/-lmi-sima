import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';
import { RevenueCatClient } from '../../src/services/revenueCatClient';

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

const PHOTOS_3 = ['base64-calm', 'base64-bright', 'base64-deep'];
const CHARACTER_READING = {
  module: 'character_analysis',
  archetype_card: { title: 'Character Archetype', badge_tag: 'Analytical Visionary', summary: 'One punchy sentence.' },
  facial_structure_card: { title: 'Facial Structure', shape_tag: 'Oval', description: 'Structural description.' },
  spirit_animal_card: { title: 'Spirit Animal Match', animal: 'Wolf', description: 'Symbolic description.' },
  traits_card: {
    title: 'Facial Trait Analysis',
    metadata_badges: [{ key: 'Eye Energy', value: 'Direct & Piercing' }],
    strength_pills: ['Strategic Thinking'],
    growth_pills: ['Pacing Energy'],
  },
  celebrity_match_card: { title: 'Celebrity Archetype Match', match_name: 'A Public Figure', match_description: 'Same register.' },
};

describe('entitlement check (monitor mode — never blocks yet)', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    generateContent = jest.fn().mockResolvedValue(textResponse(CHARACTER_READING));
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(async () => {
    await app.close();
    warnSpy.mockRestore();
  });

  it('allows the request through and logs nothing when no RevenueCat client is configured', async () => {
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(readingModelClient); // no revenueCatClient passed — matches an unset REVENUECAT_API_KEY

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: { photos: PHOTOS_3 } });

    expect(response.statusCode).toBe(200);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('allows the request through but warns when the client sends no app-user-id header', async () => {
    const revenueCatClient: RevenueCatClient = { fetchSubscriber: jest.fn() };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(readingModelClient, revenueCatClient);

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: { photos: PHOTOS_3 } });

    expect(response.statusCode).toBe(200);
    expect(revenueCatClient.fetchSubscriber).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no x-revenuecat-app-user-id header'));
  });

  it('allows the request through without warning when the subscriber has an active entitlement', async () => {
    const revenueCatClient: RevenueCatClient = {
      fetchSubscriber: jest.fn().mockResolvedValue({ entitlements: { aura_pro_access: { expires_date: null } } }),
    };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(readingModelClient, revenueCatClient);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: PHOTOS_3 },
      headers: { 'x-revenuecat-app-user-id': 'user-123' },
    });

    expect(response.statusCode).toBe(200);
    expect(revenueCatClient.fetchSubscriber).toHaveBeenCalledWith('user-123');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('allows the request through but warns when the subscriber has no active entitlement', async () => {
    const revenueCatClient: RevenueCatClient = {
      fetchSubscriber: jest.fn().mockResolvedValue({ entitlements: {} }),
    };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(readingModelClient, revenueCatClient);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: PHOTOS_3 },
      headers: { 'x-revenuecat-app-user-id': 'user-456' },
    });

    expect(response.statusCode).toBe(200);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('user-456'));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no active'));
  });

  it('allows the request through even when the RevenueCat lookup itself fails', async () => {
    const revenueCatClient: RevenueCatClient = {
      fetchSubscriber: jest.fn().mockRejectedValue(new Error('RevenueCat is down')),
    };
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(readingModelClient, revenueCatClient);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { photos: PHOTOS_3 },
      headers: { 'x-revenuecat-app-user-id': 'user-789' },
    });

    expect(response.statusCode).toBe(200);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('lookup failed'), expect.any(Error));
  });
});
