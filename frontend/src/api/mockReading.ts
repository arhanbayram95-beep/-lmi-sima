import { AnalyzeReadingPayload, ReadingModuleId, ReadingResult } from './types';

// Shared by every deep master card across all three modules — see
// MasterCardNarrative in api/types.ts.
const narrative = (heroHook: string) => ({
  hero_hook: heroHook,
  anatomical_decoding: [
    'Placeholder text — a steady jawline reads as quiet decisiveness.',
    'Placeholder text — a direct gaze reads as unhurried confidence.',
    'Placeholder text — a level brow line reads as composure under pressure.',
  ],
  living_scenario: [
    'Placeholder pseudo-API output for testing, not a real reading. Paragraph one of a three-paragraph vignette.',
    'Placeholder pseudo-API output for testing, not a real reading. Paragraph two of a three-paragraph vignette.',
    'Placeholder pseudo-API output for testing, not a real reading. Paragraph three of a three-paragraph vignette.',
  ],
  actionable_insight: {
    headline: 'Balance Point',
    description: 'Placeholder text — a gentle growth edge, phrased as a tendency to balance, never a flaw.',
  },
});

const mythicTale = (title: string) => ({
  tale_title: title,
  paragraphs: [
    'Placeholder pseudo-API output for testing, not a real reading. Fable paragraph one.',
    'Placeholder pseudo-API output for testing, not a real reading. Fable paragraph two.',
    'Placeholder pseudo-API output for testing, not a real reading. Fable paragraph three.',
  ],
});

// Canned responses for USE_MOCK_API — lets the whole capture -> analyzing ->
// reveal flow be exercised end to end with no backend running and no AI
// provider key configured, one per module so mock mode can actually verify
// each module's card stack differs. Shapes match the per-module response
// schemas in backend/src/services/readingSchema.ts.
// Remove alongside the config flag before public release.
const MOCK_READING_RESULTS: Record<ReadingModuleId, ReadingResult> = {
  'three-expression': {
    module: 'character_analysis',
    oracle_match_card: {
      title: 'The Archetype & Oracle Match',
      archetype_tag: 'Analytical Visionary',
      oracle_match_name: 'A Well-Known Public Figure',
      facial_landmark_resonance: { percent: 94, archetype_label: 'High-Brow Deadpan Archetypes' },
      aura: { name: 'Crimson Ember', intensity_percent: 82, explanation: 'Placeholder text — driven by prominent brow tension and a level, unhurried gaze.' },
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    sacred_anatomy_card: {
      title: 'Facial Geometry & Sacred Anatomy',
      shape_tag: 'Oval',
      golden_ratio_score: { percent: 91, explanation: 'Placeholder text — balanced proportions with a defined jawline and a forehead slightly wider than the chin.' },
      structural_dominance: { brow_percent: 70, cheekbone_percent: 55, jaw_percent: 40 },
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    animal_totem_card: {
      title: 'The Animal Totem & Primal Energy',
      spirit_animal: 'Wolf',
      instinctual_radar: [
        { left_trait: 'Pack Loyalty', left_percent: 78, right_trait: 'Lone Independence' },
        { left_trait: 'Watchful Patience', left_percent: 66, right_trait: 'Sudden Decisiveness' },
      ],
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    trait_symphony_card: {
      title: 'Trait Symphony & Behavioral Polarities',
      polarity_meters: [
        { left_trait: 'Observant Irony', left_percent: 78, right_trait: 'Direct Earnestness' },
        { left_trait: 'Strategic Composure', left_percent: 86, right_trait: 'Raw Impulse' },
        { left_trait: 'Quiet Authority', left_percent: 71, right_trait: 'Loud Persuasion' },
      ],
      rarity_index: { one_in_n: 420, trait_reason: 'Placeholder text — this exact eye-to-brow symmetry paired with a level, unhurried gaze.' },
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    shadow_arcana_card: {
      title: 'The Secret Signature & Shadow Arcana',
      signature_catchphrase: '"Quiet Storm, Loud Impact"',
      shadow_traits: ['Overthinking Under Pressure', 'Over-Analyzing Small Decisions'],
      life_advice: 'Placeholder text — lean into the pause before you speak; it already works for you.',
      mythic_tale: mythicTale('The Trial of the Ember Wolf'),
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
  },
  'relationship-harmony': {
    module: 'relationship_harmony',
    bond_oracle_card: {
      title: 'The Bond Archetype & Oracle Match',
      bond_archetype_tag: 'Grounded & Playful Harmonizer',
      duo_oracle_match: 'A Famous On-Screen Duo',
      bond_resonance: { percent: 88, archetype_label: 'Steady-Anchor & Spark Pairings' },
      aura: { name: 'Amber Tide', intensity_percent: 76, explanation: 'Placeholder text — driven by complementary energy levels that never quite match, and never need to.' },
      ...narrative('Placeholder pseudo-API output for testing, not a real reading. One brings steady reassurance, the other brings momentum — the two meet somewhere comfortable.'),
    },
    chemistry_geometry_card: {
      title: 'Chemistry Geometry & Synergy Score',
      synergy_score: {
        title: 'Synergy Score',
        overall_score: 92,
        breakdown_metrics: [
          { label: 'Empathy', score: 89, icon: 'heart' },
          { label: 'Communication', score: 94, icon: 'chat' },
          { label: 'Attachment', score: 82, icon: 'shield' },
          { label: 'Energy Match', score: 96, icon: 'zap' },
        ],
      },
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    instinctual_dynamics_card: {
      title: 'Instinctual Dynamics & Primal Rhythm',
      dynamics_radar: [
        { left_trait: 'Spontaneous Energy', left_percent: 68, right_trait: 'Grounded Calmness' },
        { left_trait: 'Intellectual Spark', left_percent: 74, right_trait: 'Comfortable Silence' },
      ],
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    bond_shadow_arcana_card: {
      title: 'The Secret Signature & Shadow Arcana of the Bond',
      duo_catchphrase: '"Calm Meets Chaos, On Purpose"',
      shadow_traits: ['Overplanning Spontaneous Moments', 'Inconsistent Follow-Through'],
      guidance_checklist: [
        { headline: 'Direct Communication', description: 'Say what you need early, in plain calm language, rather than hinting.' },
        { headline: 'Space & Autonomy', description: 'Deep closeness works best here with real personal room built in around it.' },
      ],
      mythic_tale: mythicTale('The Bound Wayfarers'),
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
  },
  'career-match': {
    module: 'career_path',
    career_oracle_card: {
      title: 'The Career Archetype & Oracle Match',
      work_archetype_tag: 'Strategic Innovator',
      career_oracle_match: 'A Well-Known Public Figure',
      career_resonance: { percent: 90, archetype_label: 'Calm-Under-Fire Builders' },
      aura: { name: 'Slate Ember', intensity_percent: 80, explanation: 'Placeholder text — driven by composed decision-making even when the room is loud.' },
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    industry_geometry_card: {
      title: 'Industry Geometry & Work-Style Radar',
      work_style_radar: [
        { left_trait: 'Deep-Focus Craft', left_percent: 74, right_trait: 'Fast-Paced Hustle' },
        { left_trait: 'Structured Planning', left_percent: 69, right_trait: 'Improvised Adaptation' },
      ],
      top_industry_pills: ['Engineering & R&D', 'Strategic Consulting', 'Creative Tech Leadership'],
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    career_trait_symphony_card: {
      title: 'Trait Symphony & Working Polarities',
      polarity_meters: [
        { left_trait: 'Structured Thinking', left_percent: 82, right_trait: 'Improvised Adaptation' },
        { left_trait: 'Calm Under Pressure', left_percent: 88, right_trait: 'Reactive Urgency' },
      ],
      rarity_index: { one_in_n: 310, trait_reason: 'Placeholder text — this exact pacing under deadline pressure.' },
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
    career_shadow_arcana_card: {
      title: 'The Secret Signature & Shadow Arcana',
      work_catchphrase: '"Built the Spreadsheet, Ran the Room"',
      shadow_traits: ['Over-Preparing for Small Stakes', 'Delegating Too Late'],
      role_recommendations: [
        {
          headline: 'Systems Architect / Lead Engineer',
          description: 'Leverages sustained focus and structured problem-solving when the pressure is on.',
        },
        {
          headline: 'Product Strategist',
          description: 'Pairs analytical range with the observational read that makes a room feel understood.',
        },
      ],
      life_advice: 'Placeholder text — let one plan stay unfinished on purpose.',
      mythic_tale: mythicTale('The Architect of the Long Road'),
      ...narrative('Placeholder pseudo-API output for testing, not a real reading.'),
    },
  },
};

const MOCK_LATENCY_MS = 1200;

export async function analyzeReadingMock(payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return MOCK_READING_RESULTS[payload.module];
}
