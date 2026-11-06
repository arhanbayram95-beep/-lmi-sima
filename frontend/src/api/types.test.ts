import { MOCK_READING_RESULTS } from './mockReading';
import {
  abilityModifier,
  characterSubtitle,
  MODULE_PHOTO_COUNTS,
  ReadingResult,
  readingBadgeCard,
  readingShareableSections,
} from './types';

// readingBadgeCard and readingShareableSections switch on `module`, so every
// mode needs its own case exercised: a missed branch surfaces as a blank
// history row or a share card silently dropping a section, not a type error.
const HERO = MOCK_READING_RESULTS.hero;
const PARTY = MOCK_READING_RESULTS.party;
const NEMESIS = MOCK_READING_RESULTS.nemesis;
const ALL: ReadingResult[] = [HERO, PARTY, NEMESIS];

describe('MODULE_PHOTO_COUNTS', () => {
  it('matches the backend: 3 hero poses, 2 party members, 1 nemesis photo', () => {
    expect(MODULE_PHOTO_COUNTS).toEqual({ hero: 3, party: 2, nemesis: 1 });
  });
});

describe('abilityModifier', () => {
  it.each([
    [8, '-1'],
    [10, '+0'],
    [11, '+0'],
    [15, '+2'],
    [18, '+4'],
  ])('maps a score of %i to %s', (score, expected) => {
    expect(abilityModifier(score)).toBe(expected);
  });
});

describe('characterSubtitle', () => {
  it('reads level, lineage, class and alignment', () => {
    const hero = HERO.module === 'hero_sheet' ? HERO.hero : undefined;
    expect(hero && characterSubtitle(hero)).toBe('Level 3 Halfling Bard · Chaotic Good');
  });
});

describe('readingBadgeCard', () => {
  it('headlines a hero sheet with the hero name and epithet', () => {
    expect(readingBadgeCard(HERO).badge_tag).toBe('Wren Ashdown, the Unhurried Storm');
  });

  it('headlines a party sheet with the party name', () => {
    expect(readingBadgeCard(PARTY).badge_tag).toBe('The Lantern Thieves');
  });

  it('names both party members in the summary', () => {
    expect(readingBadgeCard(PARTY).summary).toBe('Wren Ashdown the Bard & Corvin Vale the Bard');
  });

  it('headlines a nemesis sheet with the villain name', () => {
    expect(readingBadgeCard(NEMESIS).badge_tag).toBe('Baron Velvetgloom, the Unhurried Storm');
  });
});

describe('readingShareableSections', () => {
  it.each(ALL.map((reading) => [reading.module, reading] as const))('gives %s non-empty sections', (_kind, reading) => {
    const sections = readingShareableSections(reading);
    expect(sections.every((section) => section.title.length > 0 && section.body.length > 0)).toBe(true);
  });

  it.each(ALL.map((reading) => [reading.module, reading] as const))('gives %s unique section ids', (_kind, reading) => {
    const ids = readingShareableSections(reading).map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('puts the ability scores on the hero stats section', () => {
    const stats = readingShareableSections(HERO).find((section) => section.id === 'hero-stats');
    expect(stats?.body).toContain('CHA 17');
  });

  it('includes one stats section per party member', () => {
    const ids = readingShareableSections(PARTY).map((section) => section.id);
    expect(ids).toEqual(expect.arrayContaining(['party-stats-0', 'party-stats-1']));
  });

  it('includes the evil scheme for a nemesis', () => {
    const ids = readingShareableSections(NEMESIS).map((section) => section.id);
    expect(ids).toContain('evil-scheme');
  });
});
