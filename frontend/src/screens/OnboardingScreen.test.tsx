import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import OnboardingScreen from './OnboardingScreen';
import { useAppStore } from '../state/useAppStore';

describe('OnboardingScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'onboarding', ageVerified: false, imageConsentGiven: false });
  });

  it('blocks continuing past the age gate until both checkboxes are checked', () => {
    render(<OnboardingScreen />);

    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Get Started'));
    expect(useAppStore.getState().screen).toBe('onboarding');

    fireEvent.press(screen.getByTestId('age-gate-checkbox'));
    fireEvent.press(screen.getByText('Get Started'));
    expect(useAppStore.getState().screen).toBe('onboarding');

    fireEvent.press(screen.getByTestId('consent-checkbox'));
    fireEvent.press(screen.getByText('Get Started'));
    expect(useAppStore.getState().screen).toBe('review');
  });
});
