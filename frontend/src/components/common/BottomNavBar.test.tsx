import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import BottomNavBar from './BottomNavBar';
import { useAppStore } from '../../state/useAppStore';

describe('BottomNavBar', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'mainMenu' });
  });

  it('navigates to capture when Analyze is pressed', () => {
    render(<BottomNavBar active="analyze" />);
    fireEvent.press(screen.getByLabelText('Analyze'));
    expect(useAppStore.getState().screen).toBe('capture');
  });

  it('navigates to settings when Settings is pressed', () => {
    render(<BottomNavBar active="analyze" />);
    fireEvent.press(screen.getByLabelText('Settings'));
    expect(useAppStore.getState().screen).toBe('settings');
  });
});
