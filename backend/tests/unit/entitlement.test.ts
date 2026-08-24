import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { everyModule, ReadingModelClient } from '../../src/services/geminiClient';
import { RevenueCatClient } from '../../src/services/revenueCatClient';

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

// Shared by every deep master card across all three modules — see
// MasterCardNarrative in readingSchema.ts.
const narrative = (heroHook: string) => ({
  hero_hook: heroHook,
  anatomical_decoding: ['Jawline reads decisive.', 'Eyes read direct.', 'Brow line reads composed.'],
  living_scenario: ['Paragraph one.', 'Paragraph two.', 'Paragraph three.'],
  actionable_insight: { headline: 'Balance Point', description: 'A short growth note.' },
});

const mythicTale = (title: string) => ({
  tale_title: title,
  paragraphs: ['Fable paragraph one.', 'Fable paragraph two.', 'Fable paragraph three.'],
});

// Mirrors the character_analysis card stack the response schema forces —
// see backend/src/services/readingSchema.ts.
const CHARACTER_READING = {
  module: 'character_analysis',
  oracle_match_card: {
    title: 'The Archetype & Oracle Match',
    archetype_tag: 'Analytical Visionary',
    oracle_match_name: 'A Public Figure',
    facial_landmark_resonance: { percent: 94, archetype_label: 'High-Brow Deadpan Archetypes' },
    aura: { name: 'Crimson Ember', intensity_percent: 82, explanation: 'Driven by prominent brow tension.' },
    ...narrative('A striking hero hook.'),
  },
  sacred_anatomy_card: {
    title: 'Facial Geometry & Sacred Anatomy',
    shape_tag: 'Oval',
    golden_ratio_score: { percent: 91, explanation: 'Balanced forehead-to-chin ratio.' },
    structural_dominance: { brow_percent: 70, cheekbone_percent: 55, jaw_percent: 40 },
    ...narrative('Geometry hero hook.'),
  },
  animal_totem_card: {
    title: 'The Animal Totem & Primal Energy',
    spirit_animal: 'Wolf',
    instinctual_radar: [{ left_trait: 'Pack Loyalty', left_percent: 78, right_trait: 'Lone Independence' }],
    ...narrative('Totem hero hook.'),
  },
  trait_symphony_card: {
    title: 'Trait Symphony & Behavioral Polarities',
    polarity_meters: [{ left_trait: 'Observant Irony', left_percent: 78, right_trait: 'Direct Earnestness' }],
    rarity_index: { one_in_n: 420, trait_reason: 'This exact eye-to-brow symmetry.' },
    ...narrative('Symphony hero hook.'),
  },
  shadow_arcana_card: {
    title: 'The Secret Signature & Shadow Arcana',
    signature_catchphrase: '"Quiet Storm, Loud Impact"',
    shadow_traits: ['Overthinking Under Pressure'],
    life_advice: 'Lean into the pause before you speak.',
    mythic_tale: mythicTale('The Trial of the Ember Wolf'),
    ...narrative('Shadow hero hook.'),
  },
};

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
