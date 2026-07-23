import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import ReviewScreen from './ReviewScreen';
import { useAppStore } from '../state/useAppStore';

const mockIsAvailableAsync = jest.fn().mockResolvedValue(true);
const mockRequestReview = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-store-review', () => ({
  isAvailableAsync: () => mockIsAvailableAsync(),
  requestReview: () => mockRequestReview(),
}));

describe('ReviewScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'review' });
    mockIsAvailableAsync.mockClear();
    mockRequestReview.mockClear();
  });

  it('lets the user pick a star rating', () => {
    render(<ReviewScreen />);
    fireEvent.press(screen.getByLabelText('Rate 4 stars'));
    expect(screen.getByLabelText('Rate 4 stars')).toBeTruthy();
  });

  it('triggers the native store review prompt and returns to the main menu', async () => {
    render(<ReviewScreen />);
    fireEvent.press(screen.getByText('Rate on App Store'));

    await waitFor(() => expect(mockRequestReview).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(useAppStore.getState().screen).toBe('mainMenu'));
  });

  it('skips the native prompt when it is unavailable on this device', async () => {
    mockIsAvailableAsync.mockResolvedValueOnce(false);
    render(<ReviewScreen />);
    fireEvent.press(screen.getByText('Rate on App Store'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('mainMenu'));
    expect(mockRequestReview).not.toHaveBeenCalled();
  });
});
