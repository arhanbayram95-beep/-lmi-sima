import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import PaywallScreen from './PaywallScreen';
import { useAppStore } from '../state/useAppStore';

describe('PaywallScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'paywall', isProActive: false });
  });

  it('always renders the entertainment disclaimer', () => {
    render(<PaywallScreen />);
    expect(screen.getByText(/entertainment purposes only/i)).toBeTruthy();
  });

  it('offers a restore purchases path', () => {
    render(<PaywallScreen />);
    expect(screen.getByText('Restore Purchases')).toBeTruthy();
  });

  it('is not skippable on first launch — no close button until entitlement is active', () => {
    render(<PaywallScreen />);
    expect(screen.queryByTestId('paywall-close-button')).toBeNull();
  });

  it('shows a close button once the user already has an active entitlement', () => {
    useAppStore.setState({ isProActive: true });
    render(<PaywallScreen />);
    expect(screen.getByTestId('paywall-close-button')).toBeTruthy();
  });

  it('advertises the free trial and grants entitlement on Start Free Trial', () => {
    render(<PaywallScreen />);
    expect(screen.getAllByText(/3-day free trial/i).length).toBeGreaterThan(0);

    fireEvent.press(screen.getByText('Start Free Trial'));
    expect(useAppStore.getState().isProActive).toBe(true);
    expect(useAppStore.getState().screen).toBe('mainMenu');
  });

  it('opens the privacy policy modal from the footer link', () => {
    render(<PaywallScreen />);
    fireEvent.press(screen.getByText('Privacy Policy'));
    expect(screen.getByTestId('privacy-policy-modal')).toBeTruthy();
  });

  it('closes back to Settings, not Main Menu, when reopened from Settings with an active entitlement', () => {
    useAppStore.setState({ isProActive: true });
    useAppStore.getState().goToScreen('settings');
    useAppStore.getState().goToScreen('paywall');

    render(<PaywallScreen />);
    fireEvent.press(screen.getByTestId('paywall-close-button'));

    expect(useAppStore.getState().screen).toBe('settings');
  });
});
