import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert, Share } from 'react-native';
import React from 'react';
import RevealScreen from './RevealScreen';
import { CharacterAnalysisResult, RelationshipHarmonyResult } from '../api/types';
import { useAppStore } from '../state/useAppStore';

const mockCaptureRef = jest.fn().mockResolvedValue('file://mock-share-card.png');
jest.mock('react-native-view-shot', () => ({
  captureRef: (...args: unknown[]) => mockCaptureRef(...args),
}));

const mockSetStringAsync = jest.fn().mockResolvedValue(undefined);
jest.mock('expo-clipboard', () => ({
  setStringAsync: (...args: unknown[]) => mockSetStringAsync(...args),
}));

// GestureCardDeck plays a swipe chime, and TapToRevealCard plays a reveal
// chime — same reasoning as AnalyzingScreen.test.tsx: mock the app's own
// sound.ts wrapper rather than expo-audio itself, since real expo-audio
// doesn't load under Jest.
jest.mock('../utils/sound', () => ({
  playSwipeChime: jest.fn().mockResolvedValue(undefined),
  playRevealChime: jest.fn().mockResolvedValue(undefined),
}));

const mockShareAsync = jest.fn().mockResolvedValue(undefined);
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: (...args: unknown[]) => mockShareAsync(...args),
}));

// Shared by every deep master card across all three modules — see
// MasterCardNarrative in api/types.ts.
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

const READING: CharacterAnalysisResult = {
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
    golden_ratio_score: { percent: 91, explanation: 'Balanced proportions with a defined jawline.' },
    structural_dominance: { brow_percent: 70, cheekbone_percent: 55, jaw_percent: 40 },
    ...narrative('Geometry hero hook.'),
  },
  animal_totem_card: {
    title: 'The Animal Totem & Primal Energy',
    spirit_animal: 'Wolf',
    instinctual_radar: [{ left_trait: 'Pack Loyalty', left_percent: 78, right_trait: 'Lone Independence' }],
    ...narrative('A steady gaze and defined jawline read as sharp awareness.'),
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
    ...narrative('Same calm-under-pressure register.'),
  },
};

const RELATIONSHIP_READING: RelationshipHarmonyResult = {
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
    guidance_checklist: [{ headline: 'Direct Communication', description: 'Say it early and plainly.' }],
    mythic_tale: mythicTale('The Bound Wayfarers'),
    ...narrative('Fits how these two balance each other.'),
  },
};

const PHOTOS = ['base64-calm', 'base64-bright'];

function reveal(testID: string) {
  fireEvent.press(screen.getByTestId(`${testID}-reveal`));
}

describe('RevealScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'reveal', reading: READING, images: PHOTOS });
    mockCaptureRef.mockClear();
    mockSetStringAsync.mockClear();
    mockShareAsync.mockClear();
    jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the captured photos and every deep master card for the module', () => {
    render(<RevealScreen />);
    expect(screen.getByTestId('reveal-photos')).toBeTruthy();
    expect(screen.getByTestId('oracle-match-card')).toBeTruthy();
    expect(screen.getByTestId('sacred-anatomy-card')).toBeTruthy();
    expect(screen.getByTestId('animal-totem-card')).toBeTruthy();
    expect(screen.getByTestId('trait-symphony-card')).toBeTruthy();
    expect(screen.getByTestId('shadow-arcana-card')).toBeTruthy();
  });

  it('veils every card until tapped, then unveils its content', () => {
    render(<RevealScreen />);
    expect(screen.queryByText('You read as someone people trust instantly.')).toBeNull();

    reveal('oracle-match-card');

    expect(screen.getByText('You read as someone people trust instantly.')).toBeTruthy();
  });

  it('unveils the oracle match card with its archetype tag, resonance and aura', () => {
    render(<RevealScreen />);
    reveal('oracle-match-card');

    // The archetype tag also appears in the off-screen ShareCard used for
    // react-native-view-shot capture, so there are legitimately two.
    expect(screen.getAllByText('Analytical Visionary').length).toBeGreaterThan(0);
    expect(screen.getByText(/94%/)).toBeTruthy();
    expect(screen.getByText(/Crimson Ember/)).toBeTruthy();
  });

  it('unveils the sacred anatomy and animal totem cards, grounded in physical features', () => {
    render(<RevealScreen />);
    reveal('sacred-anatomy-card');
    reveal('animal-totem-card');

    expect(screen.getByText('Oval')).toBeTruthy();
    expect(screen.getAllByText(/Wolf/).length).toBeGreaterThan(0);
  });

  it('unveils the trait symphony card with polarity meters and a rarity index', () => {
    render(<RevealScreen />);
    reveal('trait-symphony-card');

    expect(screen.getByText('Observant Irony')).toBeTruthy();
    expect(screen.getByText('Direct Earnestness')).toBeTruthy();
    expect(screen.getByText(/1 in 420/)).toBeTruthy();
  });

  it('unveils the chemistry geometry card with the synergy score and every sub-metric for relationship_harmony', () => {
    useAppStore.setState({ reading: RELATIONSHIP_READING });
    render(<RevealScreen />);
    reveal('chemistry-geometry-card');

    expect(screen.getByText('Empathy')).toBeTruthy();
    // The overall score also appears in the off-screen ShareCard, so there
    // are legitimately two.
    expect(screen.getAllByText('91').length).toBeGreaterThan(0);
  });

  it('unveils the shadow arcana card with its shadow traits and mythic tale', () => {
    render(<RevealScreen />);
    reveal('shadow-arcana-card');

    expect(screen.getByText('Overthinking Under Pressure')).toBeTruthy();
    expect(screen.getByText('The Trial of the Ember Wolf')).toBeTruthy();
    expect(screen.getByText('Fable paragraph one.')).toBeTruthy();
  });

  it('prompts for a rating after each completed reading instead of dropping straight back home', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByText('Done'));
    expect(useAppStore.getState().screen).toBe('review');
  });

  it('purges the captured photos once the user leaves the reading behind', () => {
    const { unmount } = render(<RevealScreen />);
    expect(useAppStore.getState().images).toEqual(PHOTOS);

    unmount();
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('opens a share options menu instead of sharing immediately', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));

    expect(screen.getByTestId('share-options-modal')).toBeTruthy();
    expect(screen.getByTestId('share-option-image')).toBeTruthy();
    expect(screen.getByTestId('share-option-text')).toBeTruthy();
    expect(screen.getByTestId('share-option-copy')).toBeTruthy();
    expect(Share.share).not.toHaveBeenCalled();
  });

  it('offers the include-photo toggle and a per-section picklist in the card builder', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));

    expect(screen.getByTestId('share-include-photo-checkbox')).toBeTruthy();
    expect(screen.getByTestId('share-section-oracle-match')).toBeTruthy();
    expect(screen.getByTestId('share-section-shadow-arcana')).toBeTruthy();
  });

  // character_analysis has exactly 5 shareable sections now (one per master
  // card), matching MAX_SELECTABLE_SECTIONS exactly — every section starts
  // selected and none is capped out, unlike the pre-redesign 6-card module.
  it('offers every section pre-selected since the module has exactly 5 master cards', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));

    expect(screen.getByTestId('share-section-shadow-arcana').props.accessibilityState.checked).toBe(true);
    expect(screen.getByTestId('share-section-shadow-arcana').props.accessibilityState.disabled).toBe(false);
  });

  it('captures the share card and opens the native share sheet once the card is built', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));
    fireEvent.press(screen.getByTestId('share-builder-create'));

    await waitFor(() => expect(mockCaptureRef).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockShareAsync).toHaveBeenCalledWith('file://mock-share-card.png', {
        mimeType: 'image/png',
        dialogTitle: 'Story Card',
      })
    );
  });

  it('excludes an unchecked section from the off-screen share card', async () => {
    render(<RevealScreen />);
    reveal('animal-totem-card');
    // Present twice pre-uncheck: once in the unveiled animal totem card,
    // once in the off-screen ShareCard (same reasoning as the archetype
    // tag/score checks above — both render the reading simultaneously).
    expect(screen.getAllByText(/Wolf/).length).toBe(2);

    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));
    fireEvent.press(screen.getByTestId('share-section-animal-totem'));

    expect(screen.getAllByText(/Wolf/).length).toBe(1);
  });

  it('shares a text summary from the quick-message option', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-text'));

    await waitFor(() =>
      expect(Share.share).toHaveBeenCalledWith({ message: expect.stringContaining('Analytical Visionary') })
    );
  });

  it('copies a text summary to the clipboard from the copy option', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-copy'));

    await waitFor(() =>
      expect(mockSetStringAsync).toHaveBeenCalledWith(expect.stringContaining('Analytical Visionary'))
    );
  });

  it('pages through the reveal one card at a time instead of one long scroll', () => {
    render(<RevealScreen />);
    expect(screen.getByTestId('reveal-page-prev').props.accessibilityState.disabled).toBe(true);
    expect(screen.getByTestId('reveal-page-next').props.accessibilityState.disabled).toBe(false);

    fireEvent.press(screen.getByTestId('reveal-page-next'));
    expect(screen.getByTestId('reveal-page-prev').props.accessibilityState.disabled).toBe(false);

    // 2 captured photos + 5 character_analysis master cards (oracle match,
    // sacred anatomy, animal totem, trait symphony, shadow arcana) = 7
    // pages total; already moved forward once above, so 5 more presses
    // reaches the last.
    for (let i = 0; i < 5; i++) fireEvent.press(screen.getByTestId('reveal-page-next'));
    expect(screen.getByTestId('reveal-page-next').props.accessibilityState.disabled).toBe(true);
  });

  it('resets back to the first page whenever a new reading loads', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('reveal-page-next'));
    expect(screen.getByTestId('reveal-page-prev').props.accessibilityState.disabled).toBe(false);

    act(() => {
      useAppStore.setState({ reading: RELATIONSHIP_READING });
    });
    expect(screen.getByTestId('reveal-page-prev').props.accessibilityState.disabled).toBe(true);
  });

  it('offers several color options for the share card and applies the chosen one', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));

    expect(screen.getByTestId('share-palette-crimson')).toBeTruthy();
    expect(screen.getByTestId('share-palette-burgundy')).toBeTruthy();
    expect(screen.getByTestId('share-palette-midnight')).toBeTruthy();
    expect(screen.getByTestId('share-palette-amethyst')).toBeTruthy();

    const flatStyleBefore = Object.assign({}, ...([] as object[]).concat(screen.getByTestId('share-card').props.style));
    fireEvent.press(screen.getByTestId('share-palette-midnight'));
    const flatStyleAfter = Object.assign({}, ...([] as object[]).concat(screen.getByTestId('share-card').props.style));

    expect(flatStyleAfter.backgroundColor).not.toBe(flatStyleBefore.backgroundColor);
  });
});
