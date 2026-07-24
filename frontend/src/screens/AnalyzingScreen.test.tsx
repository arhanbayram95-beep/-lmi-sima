import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import AnalyzingScreen from './AnalyzingScreen';
import { ReadingApiError } from '../api/reading';
import { useAppStore } from '../state/useAppStore';

// AnalyzingScreen runs two continuous Animated.loop calls with no native
// driver available under Jest, so they fall back to real JS timers — on a
// loaded dev machine that reliably pushes this file past Jest's 5000ms
// default per-test timeout even though the actual assertions resolve fine
// given more time. Not a fix for slowness, a correction to an unrealistic
// default for a component that never stops animating during the test.
jest.setTimeout(20000);

const mockAnalyzeReading = jest.fn();

jest.mock('../api/reading', () => {
  const actual = jest.requireActual('../api/reading');
  return {
    ...actual,
    analyzeReading: (...args: unknown[]) => mockAnalyzeReading(...args),
  };
});

const mockStop = jest.fn().mockResolvedValue(undefined);
jest.mock('../utils/sound', () => ({
  startAmbientShimmerLoop: jest.fn().mockResolvedValue({ stop: () => mockStop() }),
}));

const PHOTOS = { calm: 'base64-calm', bright: 'base64-bright', deep: 'base64-deep' };
const READING = { headline: 'Effortlessly Magnetic', expression_insights: [], narrative: 'n' };

describe('AnalyzingScreen', () => {
  beforeEach(() => {
    mockAnalyzeReading.mockReset();
    mockStop.mockClear();
    useAppStore.setState({
      screen: 'analyzing',
      images: { ...PHOTOS },
      reading: null,
      selectedModule: 'three-expression',
    });
  });

  it('sends the captured photos and selected module, stores the reading, clears images, and moves to the reveal', async () => {
    mockAnalyzeReading.mockResolvedValue(READING);
    const { unmount } = render(<AnalyzingScreen />);

    await waitFor(() =>
      expect(mockAnalyzeReading).toHaveBeenCalledWith({ ...PHOTOS, module: 'three-expression' })
    );
    await waitFor(() => expect(useAppStore.getState().screen).toBe('reveal'));
    expect(useAppStore.getState().reading).toEqual(READING);
    expect(useAppStore.getState().images).toEqual({});

    unmount();
    await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(1));
  });

  it('sends whichever module was selected on the Analyze hub', async () => {
    useAppStore.setState({ selectedModule: 'career-match' });
    mockAnalyzeReading.mockResolvedValue(READING);
    render(<AnalyzingScreen />);

    await waitFor(() =>
      expect(mockAnalyzeReading).toHaveBeenCalledWith({ ...PHOTOS, module: 'career-match' })
    );
  });

  it('shows a retry option when the API call fails', async () => {
    mockAnalyzeReading.mockRejectedValue(new ReadingApiError('Could not reach the FaceAI server. Check your connection and try again.'));
    render(<AnalyzingScreen />);

    await waitFor(() => expect(screen.getByTestId('analyzing-retry-button')).toBeTruthy());
    expect(useAppStore.getState().screen).toBe('analyzing');

    mockAnalyzeReading.mockResolvedValue(READING);
    fireEvent.press(screen.getByTestId('analyzing-retry-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('reveal'));
  });

  it('routes to the no-face-detected screen on a NO_FACE_DETECTED error', async () => {
    mockAnalyzeReading.mockRejectedValue(new ReadingApiError('No face found in one of the photos.', 'NO_FACE_DETECTED'));
    render(<AnalyzingScreen />);

    await waitFor(() => expect(useAppStore.getState().screen).toBe('noFaceDetected'));
  });
});
