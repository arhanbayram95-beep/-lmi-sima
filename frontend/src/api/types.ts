// Mirrors backend/src/services/readingSchema.ts — kept as a separate copy
// here rather than shared across the frontend/backend boundary (no shared
// package between them, per the project's architecture). Any change to the
// backend's response schema has to land here too.
export type ReadingModuleId = 'hero' | 'party' | 'nemesis';

// Hero: 3 poses of one person. Party: one photo per adventurer. Nemesis: 1.
export const MODULE_PHOTO_COUNTS: Record<ReadingModuleId, number> = {
  hero: 3,
  party: 2,
  nemesis: 1,
};

// The discriminator the backend stamps on every payload — this is what the
// reveal screen switches on to pick a card stack.
export type ModuleResultKind = 'hero_sheet' | 'party_sheet' | 'nemesis_sheet';

export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface AbilityScore {
  ability: Ability;
  score: number;
  flair: string;
}

export interface NamedFeature {
  name: string;
  description: string;
}

export interface Story {
  title: string;
  paragraphs: string[];
}

// One shape for every character in every mode, so one component
// (components/common/CharacterSheetCard.tsx) renders them all.
export interface CharacterSheet {
  name: string;
  epithet: string;
  lineage: string;
  character_class: string;
  alignment: string;
  level: number;
  hit_points: number;
  armor_class: number;
  ability_scores: AbilityScore[];
  signature_abilities: NamedFeature[];
  starting_gear: string[];
  personality: {
    trait: string;
    ideal: string;
    bond: string;
    quirk: string;
  };
  companion: {
    name: string;
    species: string;
    description: string;
  };
  battle_cry: string;
  backstory: string[];
  forged_from: string[];
}

export interface HeroSheetResult {
  module: 'hero_sheet';
  hero: CharacterSheet;
  quest_hook: Story;
}

export interface PartySheetResult {
  module: 'party_sheet';
  party_name: string;
  heroes: CharacterSheet[];
  combo_move: NamedFeature;
  party_dynamic: string;
  shared_quest: Story;
}

export interface NemesisSheetResult {
  module: 'nemesis_sheet';
  villain: CharacterSheet;
  evil_scheme: string;
  lair: string;
  comedic_weakness: string;
  showdown: Story;
}

export type ReadingResult = HeroSheetResult | PartySheetResult | NemesisSheetResult;

// Standard tabletop modifier: floor((score - 10) / 2), shown signed.
export function abilityModifier(score: number): string {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function characterTitle(sheet: CharacterSheet): string {
  return `${sheet.name}, ${sheet.epithet}`;
}

export function characterSubtitle(sheet: CharacterSheet): string {
  return `Level ${sheet.level} ${sheet.lineage} ${sheet.character_class} · ${sheet.alignment}`;
}

// A normalized headline for ResultsScreen's history list and the share
// text, regardless of mode.
export interface BadgeCard {
  title: string;
  badge_tag: string;
  summary: string;
}

// badge_tag is the headline (history rows, share text); summary sits under it.
export function readingBadgeCard(reading: ReadingResult): BadgeCard {
  switch (reading.module) {
    case 'hero_sheet':
      return {
        title: characterSubtitle(reading.hero),
        badge_tag: characterTitle(reading.hero),
        summary: `${characterSubtitle(reading.hero)} — “${reading.hero.battle_cry}”`,
      };
    case 'party_sheet':
      return {
        title: reading.combo_move.name,
        badge_tag: reading.party_name,
        summary: reading.heroes.map((hero) => `${hero.name} the ${hero.character_class}`).join(' & '),
      };
    case 'nemesis_sheet':
      return {
        title: characterSubtitle(reading.villain),
        badge_tag: characterTitle(reading.villain),
        summary: `${characterSubtitle(reading.villain)} — “${reading.villain.battle_cry}”`,
      };
  }
}

export interface ShareableSection {
  id: string;
  title: string;
  body: string;
}

function statLine(sheet: CharacterSheet): string {
  return sheet.ability_scores.map(({ ability, score }) => `${ability} ${score}`).join(' · ');
}

function characterSections(prefix: string, sheet: CharacterSheet): ShareableSection[] {
  return [
    {
      id: `${prefix}-identity`,
      title: characterTitle(sheet),
      body: `${characterSubtitle(sheet)}\n"${sheet.battle_cry}"`,
    },
    {
      id: `${prefix}-stats`,
      title: 'Ability Scores',
      body: `${statLine(sheet)}\nHP ${sheet.hit_points} · AC ${sheet.armor_class}`,
    },
    {
      id: `${prefix}-abilities`,
      title: 'Signature Abilities',
      body: sheet.signature_abilities.map((feature) => feature.name).join(' · '),
    },
    {
      id: `${prefix}-companion`,
      title: 'Companion',
      body: `${sheet.companion.name}, ${sheet.companion.species}`,
    },
  ];
}

// Flattened into a picklist for the share card builder (see
// ShareOptionsModal) — the user chooses which of these go on their card.
export function readingShareableSections(reading: ReadingResult): ShareableSection[] {
  switch (reading.module) {
    case 'hero_sheet':
      return [
        ...characterSections('hero', reading.hero),
        { id: 'quest-hook', title: reading.quest_hook.title, body: reading.quest_hook.paragraphs[0] ?? '' },
      ];
    case 'party_sheet':
      return [
        {
          id: 'party-identity',
          title: reading.party_name,
          body: reading.heroes.map((hero) => `${characterTitle(hero)} (${hero.character_class})`).join('\n'),
        },
        { id: 'combo-move', title: reading.combo_move.name, body: reading.combo_move.description },
        ...reading.heroes.map((hero, index) => ({
          id: `party-stats-${index}`,
          title: `${hero.name}'s Stats`,
          body: statLine(hero),
        })),
        { id: 'shared-quest', title: reading.shared_quest.title, body: reading.shared_quest.paragraphs[0] ?? '' },
      ];
    case 'nemesis_sheet':
      return [
        ...characterSections('villain', reading.villain),
        { id: 'evil-scheme', title: 'The Evil Scheme', body: reading.evil_scheme },
      ];
  }
}

export interface AnalyzeReadingPayload {
  photos: string[];
  module: ReadingModuleId;
}
