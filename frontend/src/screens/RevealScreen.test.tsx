import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert, Share } from 'react-native';
import React from 'react';
import RevealScreen from './RevealScreen';
import { MOCK_READING_RESULTS } from '../api/mockReading';
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

const mockGeneratePortrait = jest.fn();
jest.mock('../api/reading', () => ({
  generatePortrait: (...args: unknown[]) => mockGeneratePortrait(...args),
}));

const READING = MOCK_READING_RESULTS.hero;

const PARTY_READING = MOCK_READING_RESULTS.party;

const NEMESIS_READING = MOCK_READING_RESULTS.nemesis;

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
    mockGeneratePortrait.mockReset();
    jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the captured photos and every character sheet page for a hero', () => {
    render(<RevealScreen />);
    expect(screen.getByTestId('reveal-photos')).toBeTruthy();
    expect(screen.getByTestId('hero-identity-page')).toBeTruthy();
    expect(screen.getByTestId('hero-scores-page')).toBeTruthy();
    expect(screen.getByTestId('hero-abilities-page')).toBeTruthy();
    expect(screen.getByTestId('hero-backstory-page')).toBeTruthy();
    expect(screen.getByTestId('quest-hook-page')).toBeTruthy();
  });

  it('veils every page until tapped, then unveils its content', () => {
    render(<RevealScreen />);
    expect(screen.queryByText('“Play it louder!”')).toBeNull();

    reveal('hero-identity-page');

    expect(screen.getByText('“Play it louder!”')).toBeTruthy();
  });

  it('unveils the identity page with class line, vitals and photo inspiration notes', () => {
    render(<RevealScreen />);
    reveal('hero-identity-page');

    expect(screen.getAllByText('Level 3 Halfling Bard · Chaotic Good').length).toBeGreaterThan(0);
    expect(screen.getByText('21')).toBeTruthy();
    expect(screen.getByText('Placeholder — that grin became the stage swagger.')).toBeTruthy();
  });

  it('unveils all six ability scores with their modifiers', () => {
    render(<RevealScreen />);
    reveal('hero-scores-page');

    ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].forEach((ability) => {
      expect(screen.getByTestId(`ability-${ability}`)).toBeTruthy();
    });
    expect(screen.getByText('+3')).toBeTruthy();
  });

  it('unveils signature abilities, gear and companion', () => {
    render(<RevealScreen />);
    reveal('hero-abilities-page');

    expect(screen.getAllByText('Encore of Thunder').length).toBeGreaterThan(0);
    expect(screen.getByText('A lute with one cursed string')).toBeTruthy();
    expect(screen.getByText('Pip · Clockwork sparrow')).toBeTruthy();
  });

  it('unveils the quest hook story', () => {
    render(<RevealScreen />);
    reveal('quest-hook-page');

    expect(screen.getByText('Placeholder story paragraph two.')).toBeTruthy();
  });

  it('renders a full sheet for each party member plus the combo move', () => {
    useAppStore.setState({ reading: PARTY_READING });
    render(<RevealScreen />);
    reveal('party-synergy-page');

    expect(screen.getByTestId('party-0-identity-page')).toBeTruthy();
    expect(screen.getByTestId('party-1-identity-page')).toBeTruthy();
    expect(screen.getAllByText('Lantern Gambit').length).toBeGreaterThan(0);
  });

  it('unveils the evil scheme, lair and weakness for a nemesis', () => {
    useAppStore.setState({ reading: NEMESIS_READING, images: ['base64-solo'] });
    render(<RevealScreen />);
    reveal('evil-scheme-page');

    expect(screen.getByText('Placeholder — a clocktower that runs backwards.')).toBeTruthy();
    expect(screen.getByText('Placeholder — cannot resist monologuing to pigeons.')).toBeTruthy();
  });

  it('offers to paint a portrait on the identity page while the photos are in memory', () => {
    render(<RevealScreen />);
    reveal('hero-identity-page');

    expect(screen.getByTestId('paint-portrait-button')).toBeTruthy();
  });

  it('paints the portrait from the first photo and shows it in place of the button', async () => {
    mockGeneratePortrait.mockResolvedValue({ mime_type: 'image/png', data: 'cG5n' });
    render(<RevealScreen />);
    reveal('hero-identity-page');

    fireEvent.press(screen.getByTestId('paint-portrait-button'));

    expect(await screen.findByTestId('portrait-image')).toBeTruthy();
    expect(mockGeneratePortrait).toHaveBeenCalledWith(
      expect.objectContaining({ photo: 'base64-calm', villain: false, character: expect.objectContaining({ name: 'Wren Ashdown' }) })
    );
  });

  it('paints a nemesis portrait in villain mode', async () => {
    mockGeneratePortrait.mockResolvedValue({ mime_type: 'image/png', data: 'cG5n' });
    useAppStore.setState({ reading: NEMESIS_READING, images: ['base64-solo'] });
    render(<RevealScreen />);
    reveal('villain-identity-page');

    fireEvent.press(screen.getByTestId('paint-portrait-button'));

    await screen.findByTestId('portrait-image');
    expect(mockGeneratePortrait).toHaveBeenCalledWith(expect.objectContaining({ villain: true }));
  });

  it('shows a retry state when painting fails', async () => {
    mockGeneratePortrait.mockRejectedValue(new Error('no image'));
    render(<RevealScreen />);
    reveal('hero-identity-page');

    fireEvent.press(screen.getByTestId('paint-portrait-button'));

    expect(await screen.findByText('Try Painting Again')).toBeTruthy();
  });

  it('hides the paint option for a reading reopened from history, since the photos are gone', () => {
    useAppStore.setState({ images: [] });
    render(<RevealScreen />);
    reveal('hero-identity-page');

    expect(screen.queryByTestId('paint-portrait-button')).toBeNull();
  });

  it('drops a portrait that finishes after the user has left, keeping process-and-discard', async () => {
    let finish: (value: unknown) => void = () => {};
    mockGeneratePortrait.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { unmount } = render(<RevealScreen />);
    reveal('hero-identity-page');
    fireEvent.press(screen.getByTestId('paint-portrait-button'));

    unmount();
    await act(async () => finish({ mime_type: 'image/png', data: 'cG5n' }));

    expect(useAppStore.getState().portraits).toEqual({});
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
    expect(screen.getByTestId('share-section-hero-identity')).toBeTruthy();
    expect(screen.getByTestId('share-section-quest-hook')).toBeTruthy();
  });

  // A hero sheet has exactly 5 shareable sections, matching
  // MAX_SELECTABLE_SECTIONS — every section starts selected, none capped out.
  it('offers every section pre-selected since a hero sheet has exactly 5 sections', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));

    expect(screen.getByTestId('share-section-quest-hook').props.accessibilityState.checked).toBe(true);
    expect(screen.getByTestId('share-section-quest-hook').props.accessibilityState.disabled).toBe(false);
  });

  // Photo and text sections used to be freely combinable, which needed a
  // stack of hard caps in ShareCard (badge/line limits, overflow: hidden)
  // to keep from silently clipping content out of the captured image
  // (2026-08-15/16) — product decision (2026-08-19): stop offering the
  // combination as a pick at all, not just discourage it.
  it('makes the include-photo checkbox and the section picklist mutually exclusive', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));

    // Sections start pre-selected (up to MAX_SELECTABLE_SECTIONS), so the
    // photo checkbox starts disabled.
    expect(screen.getByTestId('share-include-photo-checkbox').props.accessibilityState.disabled).toBe(true);

    ['hero-identity', 'hero-stats', 'hero-abilities', 'hero-companion', 'quest-hook'].forEach((id) => {
      fireEvent.press(screen.getByTestId(`share-section-${id}`));
    });

    expect(screen.getByTestId('share-include-photo-checkbox').props.accessibilityState.disabled).toBe(false);
    fireEvent.press(screen.getByTestId('share-include-photo-checkbox'));

    expect(screen.getByTestId('share-section-hero-identity').props.accessibilityState.disabled).toBe(true);
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
    reveal('hero-abilities-page');
    // Present twice pre-uncheck: once in the unveiled companion row, once
    // in the off-screen ShareCard — both render the reading simultaneously.
    expect(screen.getAllByText(/Clockwork sparrow/).length).toBe(2);

    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-image'));
    fireEvent.press(screen.getByTestId('share-section-hero-companion'));

    expect(screen.getAllByText(/Clockwork sparrow/).length).toBe(1);
  });

  it('shares a text summary from the quick-message option', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-text'));

    await waitFor(() =>
      expect(Share.share).toHaveBeenCalledWith({ message: expect.stringContaining('Wren Ashdown, the Unhurried Storm') })
    );
  });

  it('copies a text summary to the clipboard from the copy option', async () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('share-reading-button'));
    fireEvent.press(screen.getByTestId('share-option-copy'));

    await waitFor(() =>
      expect(mockSetStringAsync).toHaveBeenCalledWith(expect.stringContaining('Wren Ashdown, the Unhurried Storm'))
    );
  });

  it('pages through the reveal one card at a time instead of one long scroll', () => {
    render(<RevealScreen />);
    expect(screen.getByTestId('reveal-page-prev').props.accessibilityState.disabled).toBe(true);
    expect(screen.getByTestId('reveal-page-next').props.accessibilityState.disabled).toBe(false);

    fireEvent.press(screen.getByTestId('reveal-page-next'));
    expect(screen.getByTestId('reveal-page-prev').props.accessibilityState.disabled).toBe(false);

    // 2 captured photos + 5 hero pages (identity, scores, abilities,
    // backstory, quest hook) = 7 pages total; already moved forward once
    // above, so 5 more presses reaches the last.
    for (let i = 0; i < 5; i++) fireEvent.press(screen.getByTestId('reveal-page-next'));
    expect(screen.getByTestId('reveal-page-next').props.accessibilityState.disabled).toBe(true);
  });

  it('resets back to the first page whenever a new reading loads', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByTestId('reveal-page-next'));
    expect(screen.getByTestId('reveal-page-prev').props.accessibilityState.disabled).toBe(false);

    act(() => {
      useAppStore.setState({ reading: PARTY_READING });
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
