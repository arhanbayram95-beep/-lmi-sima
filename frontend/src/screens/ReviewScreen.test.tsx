import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import ReviewScreen from './ReviewScreen';
import { useAppStore } from '../state/useAppStore';

describe('ReviewScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'review' });
  });

  it('lets the user pick a star rating', () => {
    render(<ReviewScreen />);
    fireEvent.press(screen.getByLabelText('Rate 4 stars'));
    expect(screen.getByLabelText('Rate 4 stars')).toBeTruthy();
  });

  it('navigates to the paywall after rating on the store', () => {
    render(<ReviewScreen />);
    fireEvent.press(screen.getByText('Rate on App Store'));
    expect(useAppStore.getState().screen).toBe('paywall');
  });
});
