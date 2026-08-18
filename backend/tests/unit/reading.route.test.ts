import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { everyModule, ReadingModelClient } from '../../src/services/geminiClient';

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

const CAREER_READING = {
  module: 'career_path',
  career_oracle_card: {
    title: 'The Career Archetype & Oracle Match',
    work_archetype_tag: 'Strategic Innovator',
    career_oracle_match: 'A Public Figure',
    career_resonance: { percent: 90, archetype_label: 'Calm-Under-Fire Builders' },
    aura: { name: 'Slate Ember', intensity_percent: 80, explanation: 'Driven by composed decision-making.' },
    ...narrative('Career hero hook.'),
  },
  industry_geometry_card: {
    title: 'Industry Geometry & Work-Style Radar',
    work_style_radar: [{ left_trait: 'Deep-Focus Craft', left_percent: 74, right_trait: 'Fast-Paced Hustle' }],
    top_industry_pills: ['Engineering & R&D'],
    ...narrative('Industry hero hook.'),
  },
  career_trait_symphony_card: {
    title: 'Trait Symphony & Working Polarities',
    polarity_meters: [{ left_trait: 'Structured Thinking', left_percent: 82, right_trait: 'Improvised Adaptation' }],
    rarity_index: { one_in_n: 310, trait_reason: 'This exact pacing under deadline pressure.' },
    ...narrative('Trait hero hook.'),
  },
  career_shadow_arcana_card: {
    title: 'The Secret Signature & Shadow Arcana',
    work_catchphrase: '"Built the Spreadsheet, Ran the Room"',
    shadow_traits: ['Over-Preparing for Small Stakes'],
    role_recommendations: [{ headline: 'Systems Architect', description: 'Structured problem-solving.' }],
    life_advice: 'Let one plan stay unfinished on purpose.',
    mythic_tale: mythicTale('The Architect of the Long Road'),
    ...narrative('Career shadow hero hook.'),
  },
};

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
    expect(response.json().oracle_match_card.archetype_tag).toBe('Analytical Visionary');
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
    // three-expression (the default module) needs exactly 3 photos.
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
    generateContent.mockResolvedValue(textResponse(CAREER_READING));

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      // career-match needs exactly 1 photo.
      payload: { photos: [jpegBase64('solo')], module: 'career-match' },
    });

    expect(response.statusCode).toBe(200);
    const [[callArgs]] = generateContent.mock.calls;
    expect(callArgs.config.systemInstruction).toMatch(/career/i);
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
