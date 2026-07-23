import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import AnalyzingScreen from './AnalyzingScreen';
import { ReadingApiError } from '../api/reading';
import { useAppStore } from '../state/useAppStore';

const mockAnalyzeReading = jest.fn();

jest.mock('../api/reading', () => {
  const actual = jest.requireActual('../api/reading');
  return {
    ...actual,
    analyzeReading: (...args: unknown[]) => mockAnalyzeReading(...args),
  };
});

const PHOTOS = { calm: 'base64-calm', bright: 'base64-bright', deep: 'base64-deep' };
const READING = { headline: 'Effortlessly Magnetic', expression_insights: [], narrative: 'n' };

describe('AnalyzingScreen', () => {
  beforeEach(() => {
    mockAnalyzeReading.mockReset();
    useAppStore.setState({ screen: 'analyzing', images: { ...PHOTOS }, reading: null });
  });

  it('sends the captured photos, stores the reading, clears images, and moves to the reveal', async () => {
    mockAnalyzeReading.mockResolvedValue(READING);
    render(<AnalyzingScreen />);

    await waitFor(() => expect(mockAnalyzeReading).toHaveBeenCalledWith(PHOTOS));
    await waitFor(() => expect(useAppStore.getState().screen).toBe('reveal'));
    expect(useAppStore.getState().reading).toEqual(READING);
    expect(useAppStore.getState().images).toEqual({});
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
});
