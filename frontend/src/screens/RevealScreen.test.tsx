import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Share } from 'react-native';
import React from 'react';
import RevealScreen from './RevealScreen';
import { CharacterAnalysisResult, RelationshipHarmonyResult } from '../api/types';
import { useAppStore } from '../state/useAppStore';

const mockCaptureRef = jest.fn().mockResolvedValue('file://mock-share-card.png');
jest.mock('react-native-view-shot', () => ({
  captureRef: (...args: unknown[]) => mockCaptureRef(...args),
}));

const READING: CharacterAnalysisResult = {
  module: 'character_analysis',
  archetype_card: {
    title: 'Character Archetype',
    badge_tag: 'Analytical Visionary',
    summary: 'You read as someone people trust instantly.',
  },
  traits_card: {
    title: 'Facial Trait Analysis',
    metadata_badges: [{ key: 'Eye Energy', value: 'Direct & Piercing' }],
    strength_pills: ['Strategic Thinking'],
    growth_pills: ['Pacing Energy'],
  },
  celebrity_match_card: {
    title: 'Celebrity Archetype Match',
    match_name: 'A Public Figure',
    match_description: 'Same calm-under-pressure register.',
  },
};
const RELATIONSHIP_READING: RelationshipHarmonyResult = {
  module: 'relationship_harmony',
  vibe_card: {
    title: 'Relational Archetype',
    badge_tag: 'Grounded & Playful Harmonizer',
    summary: 'Two styles that meet in the middle.',
  },
  chemistry_score_card: {
    title: 'Chemistry & Synergy Score',
    overall_score: 91,
    breakdown_metrics: [
      { label: 'Empathy', score: 88, icon: 'heart' },
      { label: 'Communication', score: 84, icon: 'chat' },
      { label: 'Attachment', score: 79, icon: 'shield' },
      { label: 'Energy Match', score: 95, icon: 'zap' },
    ],
  },
  dynamics_card: {
    title: 'Relationship Dynamics',
    best_chemistry_pills: ['Grounded Calmness'],
    vibes_to_avoid_pills: ['Superficial Drama'],
  },
  guidance_card: {
    title: 'Harmony Recommendations',
    checklist_items: [{ headline: 'Direct Communication', description: 'Say it early and plainly.' }],
  },
};

const PHOTOS = ['base64-calm', 'base64-bright'];

describe('RevealScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'reveal', reading: READING, images: PHOTOS });
    mockCaptureRef.mockClear();
    jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the captured photos, badge tag, and detail cards for the module', () => {
    render(<RevealScreen />);
    // The badge tag and summary also appear in the off-screen ShareCard used
    // for react-native-view-shot capture, so there are legitimately two.
    expect(screen.getAllByText('Analytical Visionary').length).toBeGreaterThan(0);
    expect(screen.getByTestId('reveal-photos')).toBeTruthy();
    expect(screen.getByTestId('traits-card')).toBeTruthy();
    expect(screen.getByTestId('celebrity-card')).toBeTruthy();
  });

  it('does not render a score card for character_analysis — only relationship_harmony kept one', () => {
    render(<RevealScreen />);
    expect(screen.queryByTestId('score-card')).toBeNull();
  });

  it('renders the overall score and every sub-score for relationship_harmony', () => {
    useAppStore.setState({ reading: RELATIONSHIP_READING });
    render(<RevealScreen />);
    expect(screen.getByTestId('score-card')).toBeTruthy();
    expect(screen.getByText('Empathy')).toBeTruthy();
    // The overall score also appears in the off-screen ShareCard, so there
    // are legitimately two — same reasoning as the badge tag check above.
    expect(screen.getAllByText('91').length).toBeGreaterThan(0);
  });

  it('renders growth edges without alarming framing', () => {
    render(<RevealScreen />);
    expect(screen.getByText('Pacing Energy')).toBeTruthy();
    expect(screen.getByText('Strategic Thinking')).toBeTruthy();
  });

  it('always renders the entertainment disclaimer', () => {
    render(<RevealScreen />);
    expect(screen.getAllByText(/entertainment purposes only/i).length).toBeGreaterThan(0);
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

  it('captures the share card and opens the native share sheet', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));

    await waitFor(() => expect(mockCaptureRef).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(Share.share).toHaveBeenCalledWith({ url: 'file://mock-share-card.png' })
    );
  });
});
