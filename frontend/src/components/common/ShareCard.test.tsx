import { render, screen } from '@testing-library/react-native';
import React from 'react';
import ShareCard from './ShareCard';
import { ShareableSection } from '../../api/types';
import { shareCardPalette } from '../../ui/theme';

const SECTIONS: ShareableSection[] = [
  { id: 'work', title: 'Career Archetype', body: 'Strategic Innovator — You read as someone people trust instantly.' },
  { id: 'domains', title: 'Recommended Industries', body: 'Engineering & R&D' },
];

describe('ShareCard', () => {
  it('renders every selected section', () => {
    render(<ShareCard sections={SECTIONS} />);
    expect(screen.getByText('Career Archetype')).toBeTruthy();
    expect(screen.getByText(/Strategic Innovator/)).toBeTruthy();
    expect(screen.getByText('Recommended Industries')).toBeTruthy();
  });

  it('renders only the sections it was given, not any others', () => {
    render(<ShareCard sections={[SECTIONS[0]]} />);
    expect(screen.getByText('Career Archetype')).toBeTruthy();
    expect(screen.queryByText('Recommended Industries')).toBeNull();
  });

  it('renders with no sections selected without erroring', () => {
    render(<ShareCard sections={[]} />);
    expect(screen.queryByTestId('share-card-photo')).toBeNull();
  });

  it('omits the photo by default', () => {
    render(<ShareCard sections={SECTIONS} />);
    expect(screen.queryByTestId('share-card-photo')).toBeNull();
  });

  it('includes the photo when explicitly opted into', () => {
    render(<ShareCard sections={SECTIONS} photo="ZmFrZS1iYXNlNjQ=" />);
    expect(screen.getByTestId('share-card-photo')).toBeTruthy();
  });

  it('defaults to the crimson palette when none is given', () => {
    render(<ShareCard sections={SECTIONS} />);
    const flatStyle = Object.assign({}, ...([] as object[]).concat(screen.getByTestId('share-card').props.style));
    expect(flatStyle.backgroundColor).toBe(shareCardPalette('crimson').background);
  });

  it('applies the requested palette background', () => {
    render(<ShareCard sections={SECTIONS} paletteId="midnight" />);
    const flatStyle = Object.assign({}, ...([] as object[]).concat(screen.getByTestId('share-card').props.style));
    expect(flatStyle.backgroundColor).toBe(shareCardPalette('midnight').background);
  });
});
