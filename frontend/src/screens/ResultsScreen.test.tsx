import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import ResultsScreen from './ResultsScreen';
import { useAppStore } from '../state/useAppStore';

describe('ResultsScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'results' });
  });

  it('shows an empty state when there are no readings yet', () => {
    render(<ResultsScreen />);
    expect(screen.getByText('No Readings Yet')).toBeTruthy();
  });

  it('routes Start Analysis through the Analyze hub', () => {
    render(<ResultsScreen />);
    fireEvent.press(screen.getByText('Start Analysis'));
    expect(useAppStore.getState().screen).toBe('analyze');
  });
});
