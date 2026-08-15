import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

const PHOTOS_3 = ['base64-calm', 'base64-bright', 'base64-deep'];

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

describe('rate limiting on /api/v1/reading/analyze', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(async () => {
    generateContent = jest.fn().mockResolvedValue(textResponse(CHARACTER_READING));
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = await buildApp(readingModelClient);
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
