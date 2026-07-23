import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import AnalyzeScreen from './AnalyzeScreen';
import { useAppStore } from '../state/useAppStore';

describe('AnalyzeScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'analyze' });
  });

  it('lets the user pick the 3-expression reading module', () => {
    render(<AnalyzeScreen />);
    fireEvent.press(screen.getByTestId('analyze-module-three-expression'));
    expect(useAppStore.getState().screen).toBe('capture');
  });

  it('does not jump straight into capture on its own', () => {
    render(<AnalyzeScreen />);
    expect(useAppStore.getState().screen).toBe('analyze');
  });
});
