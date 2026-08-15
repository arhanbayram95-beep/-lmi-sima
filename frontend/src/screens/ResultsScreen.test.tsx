import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import ResultsScreen from './ResultsScreen';
import { CareerPathResult, CharacterAnalysisResult } from '../api/types';
import { useAppStore } from '../state/useAppStore';

const narrative = {
  hero_hook: 'h',
  anatomical_decoding: ['a', 'b', 'c'],
  living_scenario: ['p1', 'p2', 'p3'],
  actionable_insight: { headline: 'h', description: 'd' },
};

const mythicTale = { tale_title: 't', paragraphs: ['p1', 'p2', 'p3'] };

const CHARACTER_READING: CharacterAnalysisResult = {
  module: 'character_analysis',
  oracle_match_card: {
    title: 'The Archetype & Oracle Match',
    archetype_tag: 'Analytical Visionary',
    oracle_match_name: 'A Public Figure',
    facial_landmark_resonance: { percent: 94, archetype_label: 'High-Brow Deadpan Archetypes' },
    aura: { name: 'Crimson Ember', intensity_percent: 82, explanation: 'e' },
    ...narrative,
    hero_hook: 'You read as someone people trust instantly.',
  },
  sacred_anatomy_card: {
    title: 'Facial Geometry & Sacred Anatomy',
    shape_tag: 'Oval',
    golden_ratio_score: { percent: 91, explanation: 'Balanced proportions.' },
    structural_dominance: { brow_percent: 70, cheekbone_percent: 55, jaw_percent: 40 },
    ...narrative,
  },
  animal_totem_card: {
    title: 'The Animal Totem & Primal Energy',
    spirit_animal: 'Wolf',
    instinctual_radar: [{ left_trait: 'Pack Loyalty', left_percent: 78, right_trait: 'Lone Independence' }],
    ...narrative,
  },
  trait_symphony_card: {
    title: 'Trait Symphony & Behavioral Polarities',
    polarity_meters: [{ left_trait: 'Observant Irony', left_percent: 78, right_trait: 'Direct Earnestness' }],
    rarity_index: { one_in_n: 420, trait_reason: 'r' },
    ...narrative,
  },
  shadow_arcana_card: {
    title: 'The Secret Signature & Shadow Arcana',
    signature_catchphrase: '"Quiet Storm, Loud Impact"',
    shadow_traits: ['Overthinking Under Pressure'],
    life_advice: 'a',
    mythic_tale: mythicTale,
    ...narrative,
  },
};

const CAREER_READING: CareerPathResult = {
  module: 'career_path',
  career_oracle_card: {
    title: 'The Career Archetype & Oracle Match',
    work_archetype_tag: 'Strategic Innovator',
    career_oracle_match: 'A Public Figure',
    career_resonance: { percent: 90, archetype_label: 'Calm-Under-Fire Builders' },
    aura: { name: 'Slate Ember', intensity_percent: 80, explanation: 'e' },
    ...narrative,
    hero_hook: 'You settle fastest in long-range rooms.',
  },
  industry_geometry_card: {
    title: 'Industry Geometry & Work-Style Radar',
    work_style_radar: [{ left_trait: 'Deep-Focus Craft', left_percent: 74, right_trait: 'Fast-Paced Hustle' }],
    top_industry_pills: ['Product Design'],
    ...narrative,
  },
  career_trait_symphony_card: {
    title: 'Trait Symphony & Working Polarities',
    polarity_meters: [{ left_trait: 'Structured Thinking', left_percent: 82, right_trait: 'Improvised Adaptation' }],
    rarity_index: { one_in_n: 310, trait_reason: 'r' },
    ...narrative,
  },
  career_shadow_arcana_card: {
    title: 'The Secret Signature & Shadow Arcana',
    work_catchphrase: '"Built the Spreadsheet, Ran the Room"',
    shadow_traits: ['Over-Preparing for Small Stakes'],
    role_recommendations: [{ headline: 'Systems Architect', description: 'End-to-end ownership.' }],
    life_advice: 'a',
    mythic_tale: mythicTale,
    ...narrative,
  },
};

const HISTORY = [
  { id: 'reading-2', reading: CAREER_READING, completedAt: 1_700_000_100_000 },
  { id: 'reading-1', reading: CHARACTER_READING, completedAt: 1_700_000_000_000 },
];

describe('ResultsScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'results', history: [], reading: null });
  });

  it('shows an empty state when there are no readings yet', () => {
    render(<ResultsScreen />);
    expect(screen.getByText('No Readings Yet')).toBeTruthy();
  });

  it('routes Start Analysis through the Analyze hub', () => {
    render(<ResultsScreen />);
    fireEvent.press(screen.getByText('Start Analysis'));
    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('lists a row per logged reading instead of the empty state', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    expect(screen.queryByText('No Readings Yet')).toBeNull();
    expect(screen.getByTestId('history-entry-reading-1')).toBeTruthy();
    expect(screen.getByTestId('history-entry-reading-2')).toBeTruthy();
  });

  // Each module's row reads from its own badge card via readingBadgeCard —
  // a module whose branch is missed there renders a blank row, not an error.
  it('summarises each row with that module’s own badge card', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    expect(screen.getByText('Analytical Visionary')).toBeTruthy();
    expect(screen.getByText('You read as someone people trust instantly.')).toBeTruthy();
    expect(screen.getByText('Strategic Innovator')).toBeTruthy();
    expect(screen.getByText('You settle fastest in long-range rooms.')).toBeTruthy();
  });

  it('reopens the tapped reading on the reveal screen', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    fireEvent.press(screen.getByTestId('history-entry-reading-1'));

    expect(useAppStore.getState().reading).toEqual(CHARACTER_READING);
    expect(useAppStore.getState().screen).toBe('reveal');
  });
});
