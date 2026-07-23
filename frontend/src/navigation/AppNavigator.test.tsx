import { render, screen } from '@testing-library/react-native';
import React from 'react';
import AppNavigator from './AppNavigator';
import { useAppStore } from '../state/useAppStore';

describe('AppNavigator', () => {
  it('renders the screen matching the current store state', () => {
    useAppStore.setState({ screen: 'mainMenu' });
    render(<AppNavigator />);
    expect(screen.getByTestId('main-menu-screen')).toBeTruthy();
  });

  it('renders the settings screen when routed there', () => {
    useAppStore.setState({ screen: 'settings' });
    render(<AppNavigator />);
    expect(screen.getByTestId('settings-screen')).toBeTruthy();
  });

  it('renders the analyze hub when routed there', () => {
    useAppStore.setState({ screen: 'analyze' });
    render(<AppNavigator />);
    expect(screen.getByTestId('analyze-screen')).toBeTruthy();
  });

  it('renders the results screen when routed there', () => {
    useAppStore.setState({ screen: 'results' });
    render(<AppNavigator />);
    expect(screen.getByTestId('results-screen')).toBeTruthy();
  });
});
