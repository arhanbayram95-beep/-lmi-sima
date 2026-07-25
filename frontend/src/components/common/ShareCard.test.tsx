import { render, screen } from '@testing-library/react-native';
import React from 'react';
import ShareCard from './ShareCard';

const READING = {
  headline: 'Effortlessly Magnetic',
  insights: [],
  narrative: 'You read as someone people trust instantly.',
};

describe('ShareCard', () => {
  it('renders the headline and narrative for capture', () => {
    render(<ShareCard reading={READING} />);
    expect(screen.getByText('Effortlessly Magnetic')).toBeTruthy();
    expect(screen.getByText('You read as someone people trust instantly.')).toBeTruthy();
  });
});
