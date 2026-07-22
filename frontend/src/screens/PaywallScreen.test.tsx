import { render, screen } from '@testing-library/react-native';
import React from 'react';
import PaywallScreen from './PaywallScreen';
import { useAppStore } from '../state/useAppStore';

describe('PaywallScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'paywall' });
  });

  it('always renders the entertainment disclaimer', () => {
    render(<PaywallScreen />);
    expect(screen.getByText(/entertainment purposes only/i)).toBeTruthy();
  });

  it('offers a restore purchases path', () => {
    render(<PaywallScreen />);
    expect(screen.getByText('Restore Purchases')).toBeTruthy();
  });
});
