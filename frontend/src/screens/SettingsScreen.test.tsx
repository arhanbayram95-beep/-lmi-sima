import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import SettingsScreen from './SettingsScreen';
import { useAppStore } from '../state/useAppStore';

describe('SettingsScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'settings' });
  });

  it('renders the Subscription, General, and Legal sections', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Subscription')).toBeTruthy();
    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('Legal')).toBeTruthy();
  });

  it('opens the paywall from Manage Subscription', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-manage-subscription'));
    expect(useAppStore.getState().screen).toBe('paywall');
  });

  it('opens the review screen from Rate Us', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-rate-us'));
    expect(useAppStore.getState().screen).toBe('review');
  });

  it('opens the privacy policy modal from the Legal section', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('settings-privacy-policy'));
    expect(screen.getByTestId('privacy-policy-modal')).toBeTruthy();
  });
});
