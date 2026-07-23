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
});
