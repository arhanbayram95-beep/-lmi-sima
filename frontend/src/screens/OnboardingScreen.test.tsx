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
    expect(useAppStore.getState().screen).toBe('paywall');
  });

  it('offers a privacy policy link on the age-gate step', () => {
    render(<OnboardingScreen />);
    fireEvent.press(screen.getByText('Next'));

    fireEvent.press(screen.getByText('Read our Privacy Policy'));
    expect(screen.getByTestId('privacy-policy-modal')).toBeTruthy();
  });

  it('swiping to the age-gate page flips the button to Get Started, same as tapping Next', () => {
    render(<OnboardingScreen />);
    expect(screen.getByText('Next')).toBeTruthy();

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });
    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth } } });

    expect(screen.getByText('Get Started')).toBeTruthy();
  });
});
