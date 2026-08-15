import { render, screen } from '@testing-library/react-native';
import React from 'react';
import ShareCard from './ShareCard';
import { ShareableSection } from '../../api/types';
import { shareCardPalette } from '../../ui/theme';

const SECTIONS: ShareableSection[] = [
  { id: 'work', title: 'Career Archetype', body: 'Strategic Innovator — You read as someone people trust instantly.' },
  { id: 'domains', title: 'Recommended Industries', body: 'Engineering & R&D' },
];

const STORY_SECTIONS: ShareableSection[] = [
  { id: 'work', title: 'Career Archetype', body: 'Strategic Innovator' },
  { id: 'catchphrase', title: 'Work Catchphrase', body: '"Built the Spreadsheet, Ran the Room"' },
  { id: 'domains', title: 'Recommended Industries', body: 'Engineering & R&D' },
  { id: 'growth', title: 'Strengths & Growth Areas', body: 'Structured Thinking' },
  { id: 'roles', title: 'Ideal Role Matches', body: 'Systems Architect' },
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

  it('defaults to the flexible layout, rendering every section as a full paragraph', () => {
    render(<ShareCard sections={STORY_SECTIONS} />);
    expect(screen.queryByTestId('share-card-hero')).toBeNull();
    expect(screen.getByText('Ideal Role Matches')).toBeTruthy();
  });

  it('story layout makes the first section a hero and caps the rest at 3 compact badges', () => {
    render(<ShareCard sections={STORY_SECTIONS} layout="story" />);
    expect(screen.getByTestId('share-card-hero')).toBeTruthy();
    expect(screen.getByText('Career Archetype')).toBeTruthy();
    expect(screen.getByText('Strategic Innovator')).toBeTruthy();
    // First 3 of the remaining 4 sections become badges...
    expect(screen.getByText('Work Catchphrase')).toBeTruthy();
    expect(screen.getByText('Recommended Industries')).toBeTruthy();
    expect(screen.getByText('Strengths & Growth Areas')).toBeTruthy();
    // ...the 4th is dropped rather than overflowing the fixed canvas.
    expect(screen.queryByText('Ideal Role Matches')).toBeNull();
  });

  // Regression (2026-08-15): story layout's fixed 9:16 canvas has to fit
  // branding, the photo, the hero text and badges all at once. A
  // full-square photo (aspectRatio 1 at the card's own width) alone left
  // too little of the fixed canvas for `body` — which wasn't itself
  // flex-bounded — to lay out the hero text within the card's actual
  // captured bounds, so react-native-view-shot's captureRef silently
  // cropped it out of the resulting image even though it still mounted.
  // First fix (flex-bounding + a capped photo height) turned out to only
  // narrow the failure, not close it — a long enough hero sentence plus
  // wrapped badges could still exceed the space actually left. This is
  // the hardened version: badges drop to 1 (not 3) when a photo is also
  // present, and the hero text itself gets a hard numberOfLines cap
  // rather than relying on the remaining space "probably" being enough.
  it('still renders the hero text when a photo is included in story layout', () => {
    render(<ShareCard sections={STORY_SECTIONS} photo="ZmFrZS1iYXNlNjQ=" layout="story" />);

    expect(screen.getByTestId('share-card-photo')).toBeTruthy();
    expect(screen.getByTestId('share-card-hero')).toBeTruthy();
    expect(screen.getByText('Strategic Innovator')).toBeTruthy();
  });

  it('drops to a single badge when a photo is also present in story layout, to guarantee the hero text room', () => {
    render(<ShareCard sections={STORY_SECTIONS} photo="ZmFrZS1iYXNlNjQ=" layout="story" />);

    expect(screen.getByText('Work Catchphrase')).toBeTruthy();
    expect(screen.queryByText('Recommended Industries')).toBeNull();
    expect(screen.queryByText('Strengths & Growth Areas')).toBeNull();
  });

  it('caps the hero text to fewer lines when a photo is present, more when it is not', () => {
    const { rerender } = render(<ShareCard sections={STORY_SECTIONS} photo="ZmFrZS1iYXNlNjQ=" layout="story" />);
    expect(screen.getByText('Strategic Innovator').props.numberOfLines).toBe(3);

    rerender(<ShareCard sections={STORY_SECTIONS} layout="story" />);
    expect(screen.getByText('Strategic Innovator').props.numberOfLines).toBe(5);
  });

  it('caps the photo to a fixed height instead of a full square specifically in story layout', () => {
    render(<ShareCard sections={STORY_SECTIONS} photo="ZmFrZS1iYXNlNjQ=" layout="story" />);
    const flatStyle = Object.assign(
      {},
      ...([] as object[]).concat(screen.getByTestId('share-card-photo').props.style)
    );
    expect(flatStyle.aspectRatio).toBeUndefined();
    expect(flatStyle.height).toBe(150);
  });

  it('keeps the full-square photo in flexible layout, unaffected by the story-layout cap', () => {
    render(<ShareCard sections={SECTIONS} photo="ZmFrZS1iYXNlNjQ=" />);
    const flatStyle = Object.assign(
      {},
      ...([] as object[]).concat(screen.getByTestId('share-card-photo').props.style)
    );
    expect(flatStyle.aspectRatio).toBe(1);
  });
});
