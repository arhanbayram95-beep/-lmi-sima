import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import RevealScreen from './RevealScreen';
import { useAppStore } from '../state/useAppStore';

const READING = {
  headline: 'Effortlessly Magnetic',
  expression_insights: [
    { expression: 'calm' as const, insight: 'Grounded and steady.' },
    { expression: 'bright' as const, insight: 'Genuinely warm smile.' },
  ],
  narrative: 'You read as someone people trust instantly.',
};

describe('RevealScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'reveal', reading: READING });
  });

  it('renders the headline, per-expression insights, and narrative', () => {
    render(<RevealScreen />);
    expect(screen.getByText('Effortlessly Magnetic')).toBeTruthy();
    expect(screen.getByText('Grounded and steady.')).toBeTruthy();
    expect(screen.getByText('You read as someone people trust instantly.')).toBeTruthy();
  });

  it('always renders the entertainment disclaimer', () => {
    render(<RevealScreen />);
    expect(screen.getByText(/entertainment purposes only/i)).toBeTruthy();
  });

  it('prompts for a rating after each completed reading instead of dropping straight back home', () => {
    render(<RevealScreen />);
    fireEvent.press(screen.getByText('Done'));
    expect(useAppStore.getState().screen).toBe('review');
  });
});
