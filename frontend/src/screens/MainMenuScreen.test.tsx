import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import MainMenuScreen from './MainMenuScreen';
import { useAppStore } from '../state/useAppStore';

describe('MainMenuScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'mainMenu' });
  });

  it('routes Start Analysis through the Analyze hub, not straight into capture', () => {
    render(<MainMenuScreen />);
    fireEvent.press(screen.getByText('Start Analysis'));
    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('does not falsely highlight the Analyze tab — Main Menu is Home, not Analyze', () => {
    render(<MainMenuScreen />);
    const analyzeTab = screen.getByLabelText('Analyze');
    expect(analyzeTab.props.accessibilityState?.selected).toBeFalsy();
  });
});
