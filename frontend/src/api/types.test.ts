import {
  CareerPathResult,
  CharacterAnalysisResult,
  MODULE_PHOTO_COUNTS,
  ReadingResult,
  RelationshipHarmonyResult,
  readingBadgeCard,
  readingScoreCard,
  readingShareableSections,
} from './types';

// These three helpers are what stand between a module's response shape and
// the surfaces that render it module-agnostically — ResultsScreen's history
// rows, RevealScreen's share-card section picker, ShareOptionsModal. Each
// one switches on `module`, so every module needs its own case exercised:
// a missed branch surfaces as a blank history row or a share card silently
// dropping a section, not as a type error.
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

const CHARACTER: CharacterAnalysisResult = {
  module: 'character_analysis',
  oracle_match_card: {
    title: 'The Archetype & Oracle Match',
    archetype_tag: 'Analytical Visionary',
    oracle_match_name: 'A Public Figure',
    facial_landmark_resonance: { percent: 94, archetype_label: 'High-Brow Deadpan Archetypes' },
    aura: { name: 'Crimson Ember', intensity_percent: 82, explanation: 'Driven by prominent brow tension.' },
    ...narrative('You read as someone people trust instantly.'),
  },
  sacred_anatomy_card: {
    title: 'Facial Geometry & Sacred Anatomy',
    shape_tag: 'Oval',
    golden_ratio_score: { percent: 91, explanation: 'Balanced forehead-to-chin ratio.' },
    structural_dominance: { brow_percent: 70, cheekbone_percent: 55, jaw_percent: 40 },
    ...narrative('Balanced proportions with a defined jawline.'),
  },
  animal_totem_card: {
    title: 'The Animal Totem & Primal Energy',
    spirit_animal: 'Wolf',
    instinctual_radar: [{ left_trait: 'Pack Loyalty', left_percent: 78, right_trait: 'Lone Independence' }],
    ...narrative('A steady gaze reads as sharp awareness.'),
  },
  trait_symphony_card: {
    title: 'Trait Symphony & Behavioral Polarities',
    polarity_meters: [{ left_trait: 'Observant Irony', left_percent: 78, right_trait: 'Direct Earnestness' }],
    rarity_index: { one_in_n: 420, trait_reason: 'This exact eye-to-brow symmetry.' },
    ...narrative('A rare blend of composure and wit.'),
  },
  shadow_arcana_card: {
    title: 'The Secret Signature & Shadow Arcana',
    signature_catchphrase: '"Quiet Storm, Loud Impact"',
    shadow_traits: ['Overthinking Under Pressure'],
    life_advice: 'Lean into the pause before you speak.',
    mythic_tale: mythicTale('The Trial of the Ember Wolf'),
    ...narrative('The line fits the steady, direct gaze.'),
  },
};

const RELATIONSHIP: RelationshipHarmonyResult = {
  module: 'relationship_harmony',
  bond_oracle_card: {
    title: 'The Bond Archetype & Oracle Match',
    bond_archetype_tag: 'Grounded & Playful Harmonizer',
    duo_oracle_match: 'A Famous Duo',
    bond_resonance: { percent: 88, archetype_label: 'Steady-Anchor & Spark Pairings' },
    aura: { name: 'Amber Tide', intensity_percent: 76, explanation: 'Driven by complementary energy levels.' },
    ...narrative('Two styles that meet in the middle.'),
  },
  chemistry_geometry_card: {
    title: 'Chemistry Geometry & Synergy Score',
    synergy_score: {
      title: 'Synergy Score',
      overall_score: 91,
      breakdown_metrics: [
        { label: 'Empathy', score: 88, icon: 'heart' },
        { label: 'Communication', score: 84, icon: 'chat' },
        { label: 'Attachment', score: 79, icon: 'shield' },
        { label: 'Energy Match', score: 95, icon: 'zap' },
      ],
    },
    ...narrative('The numbers back up what the vibe already says.'),
  },
  instinctual_dynamics_card: {
    title: 'Instinctual Dynamics & Primal Rhythm',
    dynamics_radar: [{ left_trait: 'Playful Push-Pull', left_percent: 78, right_trait: 'Steady Anchoring' }],
    ...narrative('A rhythm that balances spark with steadiness.'),
  },
  bond_shadow_arcana_card: {
    title: 'The Secret Signature & Shadow Arcana of the Bond',
    duo_catchphrase: '"Calm Meets Chaos, On Purpose"',
    shadow_traits: ['Overplanning Spontaneous Moments'],
    guidance_checklist: [
      { headline: 'Direct Communication', description: 'Say it early and plainly.' },
      { headline: 'Shared Downtime', description: 'Protect the unstructured hours.' },
    ],
    mythic_tale: mythicTale('The Bound Wayfarers'),
    ...narrative('The line fits how these two balance each other.'),
  },
};

const CAREER: CareerPathResult = {
  module: 'career_path',
  career_oracle_card: {
    title: 'The Career Archetype & Oracle Match',
    work_archetype_tag: 'Strategic Innovator',
    career_oracle_match: 'A Public Figure',
    career_resonance: { percent: 90, archetype_label: 'Calm-Under-Fire Builders' },
    aura: { name: 'Slate Ember', intensity_percent: 80, explanation: 'Driven by composed decision-making.' },
    ...narrative('You settle fastest in rooms that reward long-range thinking.'),
  },
  industry_geometry_card: {
    title: 'Industry Geometry & Work-Style Radar',
    work_style_radar: [{ left_trait: 'Deep-Focus Craft', left_percent: 74, right_trait: 'Fast-Paced Hustle' }],
    top_industry_pills: ['Product Design', 'Applied Research', 'Venture Building'],
    ...narrative('Structured environments bring out your best thinking.'),
  },
  career_trait_symphony_card: {
    title: 'Trait Symphony & Working Polarities',
    polarity_meters: [{ left_trait: 'Structured Thinking', left_percent: 82, right_trait: 'Improvised Adaptation' }],
    rarity_index: { one_in_n: 310, trait_reason: 'This exact pacing under deadline pressure.' },
    ...narrative('A rare blend of patience and drive.'),
  },
  career_shadow_arcana_card: {
    title: 'The Secret Signature & Shadow Arcana',
    work_catchphrase: '"Built the Spreadsheet, Ran the Room"',
    shadow_traits: ['Over-Preparing for Small Stakes'],
    role_recommendations: [
      { headline: 'Systems Architect', description: 'Owning the shape of a thing end to end.' },
      { headline: 'Research Lead', description: 'Setting direction rather than executing a brief.' },
    ],
    life_advice: 'Let one plan stay unfinished on purpose.',
    mythic_tale: mythicTale('The Architect of the Long Road'),
    ...narrative('The line fits the long-range, structured thinking.'),
  },
};

const ALL_READINGS: ReadingResult[] = [CHARACTER, RELATIONSHIP, CAREER];

describe('readingBadgeCard', () => {
  it('returns a normalized headline for every module', () => {
    expect(readingBadgeCard(CHARACTER)).toEqual({
      title: 'The Archetype & Oracle Match',
      badge_tag: 'Analytical Visionary',
      summary: 'You read as someone people trust instantly.',
    });
    expect(readingBadgeCard(RELATIONSHIP)).toEqual({
      title: 'The Bond Archetype & Oracle Match',
      badge_tag: 'Grounded & Playful Harmonizer',
      summary: 'Two styles that meet in the middle.',
    });
    expect(readingBadgeCard(CAREER)).toEqual({
      title: 'The Career Archetype & Oracle Match',
      badge_tag: 'Strategic Innovator',
      summary: 'You settle fastest in rooms that reward long-range thinking.',
    });
  });
});

describe('readingScoreCard', () => {
  it('returns the synergy score card for relationship harmony', () => {
    expect(readingScoreCard(RELATIONSHIP)).toBe(RELATIONSHIP.chemistry_geometry_card.synergy_score);
  });

  // Character analysis and career path deliberately carry no score card so
  // the reading opens on a hook, not a number (see api/types.ts).
  it('returns undefined for the modules that carry no score', () => {
    expect(readingScoreCard(CHARACTER)).toBeUndefined();
    expect(readingScoreCard(CAREER)).toBeUndefined();
  });
});

describe('readingShareableSections', () => {
  it('offers one section per master card of a character analysis reading', () => {
    expect(readingShareableSections(CHARACTER).map((section) => section.id)).toEqual([
      'oracle-match',
      'sacred-anatomy',
      'animal-totem',
      'trait-symphony',
      'shadow-arcana',
    ]);
  });

  it('offers one section per master card of a relationship harmony reading', () => {
    expect(readingShareableSections(RELATIONSHIP).map((section) => section.id)).toEqual([
      'bond-oracle',
      'chemistry-geometry',
      'instinctual-dynamics',
      'bond-shadow-arcana',
    ]);
  });

  it('offers one section per master card of a career path reading', () => {
    expect(readingShareableSections(CAREER).map((section) => section.id)).toEqual([
      'career-oracle',
      'industry-geometry',
      'career-trait-symphony',
      'career-shadow-arcana',
    ]);
  });

  it('titles every section with the card title straight off the reading', () => {
    expect(readingShareableSections(CAREER).map((section) => section.title)).toEqual([
      'The Career Archetype & Oracle Match',
      'Industry Geometry & Work-Style Radar',
      'Trait Symphony & Working Polarities',
      'The Secret Signature & Shadow Arcana',
    ]);
  });

  it('flattens list-shaped cards into readable prose rather than raw arrays', () => {
    const sections = readingShareableSections(CAREER);
    expect(sections.find((section) => section.id === 'industry-geometry')?.body).toBe(
      'Product Design, Applied Research, Venture Building'
    );
  });

  // The mythic tale renders on the reveal screen itself but was missing
  // from the shareable text entirely (2026-08-18 product feedback) — it's
  // part of "the results" and should travel with the rest of the shadow
  // section when shared.
  it('folds the mythic tale into the shadow arcana section body', () => {
    const body = readingShareableSections(CHARACTER).find((section) => section.id === 'shadow-arcana')?.body;
    expect(body).toContain('The Trial of the Ember Wolf');
    expect(body).toContain('Fable paragraph one.');
  });

  // Only an excerpt, not the full three-paragraph fable — flexible layout
  // renders every selected section's full body with no truncation at all,
  // so a single section ballooning in length reopens exactly the capture-
  // height risk MAX_SELECTABLE_SECTIONS exists to prevent (that cap bounds
  // section *count*, not one section's length). 2026-08-18: "make sure
  // everything still fits... create a quota if needed".
  it('caps the mythic tale excerpt instead of including the full fable', () => {
    const longTale = {
      tale_title: 'A Very Long Tale',
      paragraphs: ['X'.repeat(500), 'This paragraph should never appear.', 'Neither should this one.'],
    };
    const reading: CharacterAnalysisResult = {
      ...CHARACTER,
      shadow_arcana_card: { ...CHARACTER.shadow_arcana_card, mythic_tale: longTale },
    };
    const body = readingShareableSections(reading).find((section) => section.id === 'shadow-arcana')?.body ?? '';

    expect(body.length).toBeLessThan(400);
    expect(body).toContain('…');
    expect(body).not.toContain('This paragraph should never appear.');
  });

  // RevealScreen seeds its section picker from these ids and ShareCard keys
  // its rendered rows off them — a duplicate would collapse two cards into
  // one selectable row and drop content from the share card silently.
  it('gives every section a unique, non-empty id and body', () => {
    for (const reading of ALL_READINGS) {
      const sections = readingShareableSections(reading);
      expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
      expect(sections.every((section) => section.id && section.title && section.body)).toBe(true);
    }
  });
});

describe('MODULE_PHOTO_COUNTS', () => {
  // AnalyzingScreen refuses to call the backend unless the captured count
  // matches exactly, and the backend enforces the same numbers in
  // generateReading — these two lists have to stay in lockstep.
  it('matches the per-module counts the backend enforces', () => {
    expect(MODULE_PHOTO_COUNTS).toEqual({
      'three-expression': 3,
      'relationship-harmony': 2,
      'career-match': 1,
    });
  });
});
