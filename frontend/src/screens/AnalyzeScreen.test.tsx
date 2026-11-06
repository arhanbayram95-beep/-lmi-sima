import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import AnalyzeScreen from './AnalyzeScreen';
import { useAppStore } from '../state/useAppStore';

describe('AnalyzeScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'analyze', selectedModule: 'hero' });
  });

  it('lets the user pick the hero mode', () => {
    render(<AnalyzeScreen />);
    fireEvent.press(screen.getByTestId('analyze-module-hero'));
    expect(useAppStore.getState().screen).toBe('capture');
    expect(useAppStore.getState().selectedModule).toBe('hero');
  });

  it('does not jump straight into capture on its own', () => {
    render(<AnalyzeScreen />);
    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('lets the user pick the party mode', () => {
    render(<AnalyzeScreen />);
    expect(screen.getByLabelText('Assemble a Party')).toBeTruthy();

    fireEvent.press(screen.getByTestId('analyze-module-party'));

    expect(useAppStore.getState().screen).toBe('capture');
    expect(useAppStore.getState().selectedModule).toBe('party');
  });

  it('lets the user pick the nemesis mode', () => {
    render(<AnalyzeScreen />);
    expect(screen.getByLabelText('Summon Your Nemesis')).toBeTruthy();

    fireEvent.press(screen.getByTestId('analyze-module-nemesis'));

    expect(useAppStore.getState().screen).toBe('capture');
    expect(useAppStore.getState().selectedModule).toBe('nemesis');
  });
});
