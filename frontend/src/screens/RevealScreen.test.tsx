import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Share } from 'react-native';
import React from 'react';
import RevealScreen from './RevealScreen';
import { useAppStore } from '../state/useAppStore';

const mockCaptureRef = jest.fn().mockResolvedValue('file://mock-share-card.png');
jest.mock('react-native-view-shot', () => ({
  captureRef: (...args: unknown[]) => mockCaptureRef(...args),
}));

const READING = {
  headline: 'Effortlessly Magnetic',
  insights: [
    { label: 'Calm', insight: 'Grounded and steady.' },
    { label: 'Bright', insight: 'Genuinely warm smile.' },
  ],
  narrative: 'You read as someone people trust instantly.',
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

  it('renders the headline, per-insight cards, and narrative', () => {
    render(<RevealScreen />);
    // Headline/narrative also appear in the off-screen ShareCard used for
    // react-native-view-shot capture, so there are legitimately two.
    expect(screen.getAllByText('Effortlessly Magnetic').length).toBeGreaterThan(0);
    expect(screen.getByText('Grounded and steady.')).toBeTruthy();
    expect(screen.getAllByText('You read as someone people trust instantly.').length).toBeGreaterThan(0);
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

  it('shows the photo captured for each insight', () => {
    render(<RevealScreen />);
    expect(screen.getByTestId('insight-photo-0').props.source.uri).toBe('data:image/jpeg;base64,base64-calm');
    expect(screen.getByTestId('insight-photo-1').props.source.uri).toBe('data:image/jpeg;base64,base64-bright');
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
