import { Schema, Type } from '@google/genai';

// Questborn's three creation modes and their response shapes — see
// PROJECT_SPEC.md §2.3 and §4. Every mode produces original tabletop-RPG
// *fiction* that a photo inspired; nothing here describes the real person.
// That distinction is the product's whole reason for existing in this form
// (App Store 4.3(b) rejection, 2026-11-06: face-reading/character-analysis
// content counts as fortune telling), so field descriptions below steer the
// model toward costume/expression/scene inspiration and away from anything
// that reads as a claim about who the user is.
export type ReadingModuleId = 'hero' | 'party' | 'nemesis';

export const READING_MODULE_IDS: ReadingModuleId[] = ['hero', 'party', 'nemesis'];

// Hero: 3 poses of one person (Calm, Battle Cry, Brooding). Party: one photo
// per adventurer. Nemesis: a single photo.
export const MODULE_PHOTO_COUNTS: Record<ReadingModuleId, number> = {
  hero: 3,
  party: 2,
  nemesis: 1,
};

export const MODULE_RESULT_KIND = {
  hero: 'hero_sheet',
  party: 'party_sheet',
  nemesis: 'nemesis_sheet',
} as const;

export type ModuleResultKind = (typeof MODULE_RESULT_KIND)[ReadingModuleId];

// Generic SRD-style game vocabulary only — no trademarked setting names,
// monsters, or product names (PROJECT_SPEC.md §1). Lineages are invented
// fantasy ancestries chosen for story fit; the prompt forbids tying them to
// a real person's skin tone, ethnicity, body size, or looks.
export const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
export type Ability = (typeof ABILITIES)[number];

export const HERO_CLASSES = [
  'Fighter',
  'Wizard',
  'Rogue',
  'Cleric',
  'Ranger',
  'Bard',
  'Paladin',
  'Druid',
  'Sorcerer',
  'Warlock',
  'Monk',
  'Barbarian',
  'Artificer',
] as const;
export type HeroClass = (typeof HERO_CLASSES)[number];

export const LINEAGES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Fae-touched', 'Dragonkin', 'Starborn', 'Stoneborn'] as const;
export type Lineage = (typeof LINEAGES)[number];

export const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
] as const;
export type Alignment = (typeof ALIGNMENTS)[number];

const GOOD_OR_NEUTRAL_ALIGNMENTS = ALIGNMENTS.filter((a) => !a.endsWith('Evil'));
const VILLAIN_ALIGNMENTS = ALIGNMENTS.filter((a) => a.endsWith('Evil') || a === 'Chaotic Neutral');

export interface AbilityScore {
  ability: Ability;
  score: number;
  flair: string;
}

export interface NamedFeature {
  name: string;
  description: string;
}

export interface CharacterSheet {
  name: string;
  epithet: string;
  lineage: Lineage;
  character_class: HeroClass;
  alignment: Alignment;
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
  quest_hook: {
    title: string;
    paragraphs: string[];
  };
}

export interface PartySheetResult {
  module: 'party_sheet';
  party_name: string;
  heroes: CharacterSheet[];
  combo_move: NamedFeature;
  party_dynamic: string;
  shared_quest: {
    title: string;
    paragraphs: string[];
  };
}

export interface NemesisSheetResult {
  module: 'nemesis_sheet';
  villain: CharacterSheet;
  evil_scheme: string;
  lair: string;
  comedic_weakness: string;
  showdown: {
    title: string;
    paragraphs: string[];
  };
}

export type ReadingResult = HeroSheetResult | PartySheetResult | NemesisSheetResult;

function moduleDiscriminator(kind: ModuleResultKind): Schema {
  return { type: Type.STRING, enum: [kind], description: `Always exactly "${kind}".` };
}

function stringArray(description: string, min: number, max: number, itemDescription: string): Schema {
  return {
    type: Type.ARRAY,
    minItems: String(min),
    maxItems: String(max),
    description,
    items: { type: Type.STRING, description: itemDescription },
  };
}

function namedFeatureSchema(description: string): Schema {
  return {
    type: Type.OBJECT,
    description,
    properties: {
      name: { type: Type.STRING, description: 'An evocative, original name, two to five words, title case.' },
      description: { type: Type.STRING, description: 'Two sentences: what it does in play, with a little flavor.' },
    },
    required: ['name', 'description'],
  };
}

function storySchema(description: string, paragraphCount: number): Schema {
  return {
    type: Type.OBJECT,
    description,
    properties: {
      title: { type: Type.STRING, description: 'A short, evocative title, three to six words.' },
      paragraphs: stringArray(
        `Exactly ${paragraphCount} paragraphs.`,
        paragraphCount,
        paragraphCount,
        'One paragraph, three to five sentences.'
      ),
    },
    required: ['title', 'paragraphs'],
  };
}

interface SheetOptions {
  alignments: readonly string[];
  backstoryParagraphs: number;
  role: string;
}

// Shared by every mode so the frontend can render any character with one
// component (see frontend/src/components/common/CharacterSheetCard.tsx).
function characterSheetSchema({ alignments, backstoryParagraphs, role }: SheetOptions): Schema {
  return {
    type: Type.OBJECT,
    description: `A complete, original tabletop-RPG character sheet for ${role}.`,
    properties: {
      name: {
        type: Type.STRING,
        description:
          'An original fantasy name, first name plus optional family name. Never the real person\'s name, never a famous fictional character\'s name.',
      },
      epithet: { type: Type.STRING, description: 'A title that follows the name, e.g. "the Unhurried Storm". Two to five words.' },
      lineage: { type: Type.STRING, enum: [...LINEAGES], description: 'A fantasy ancestry chosen for story fit and class synergy.' },
      character_class: { type: Type.STRING, enum: [...HERO_CLASSES], description: 'The character class.' },
      alignment: { type: Type.STRING, enum: [...alignments], description: 'The character\'s alignment.' },
      level: { type: Type.INTEGER, minimum: 1, maximum: 5, description: 'Starting level, 1 to 5.' },
      hit_points: { type: Type.INTEGER, minimum: 6, maximum: 60, description: 'Plausible for the class, level and CON score.' },
      armor_class: { type: Type.INTEGER, minimum: 10, maximum: 20, description: 'Plausible for the class, gear and DEX score.' },
      ability_scores: {
        type: Type.ARRAY,
        minItems: '6',
        maxItems: '6',
        description: 'Exactly six entries, one per ability, in the order STR, DEX, CON, INT, WIS, CHA.',
        items: {
          type: Type.OBJECT,
          properties: {
            ability: { type: Type.STRING, enum: [...ABILITIES], description: 'The ability.' },
            score: {
              type: Type.INTEGER,
              minimum: 8,
              maximum: 18,
              description: 'A score from 8 to 18 that suits the class. Spread them out like a real character build: one or two high, one or two modest.',
            },
            flair: {
              type: Type.STRING,
              description:
                'One playful sentence about how this ability shows up in the character\'s adventures (e.g. "Once out-stared a basilisk"). About the fictional character, never a claim about the real person.',
            },
          },
          required: ['ability', 'score', 'flair'],
        },
      },
      signature_abilities: {
        type: Type.ARRAY,
        minItems: '3',
        maxItems: '3',
        description: 'Three original signature abilities or spells.',
        items: namedFeatureSchema('One signature ability.'),
      },
      starting_gear: stringArray('Three to five pieces of starting gear.', 3, 5, 'One item, a few words, with a twist of flavor (e.g. "A lute with one cursed string").'),
      personality: {
        type: Type.OBJECT,
        description: 'Classic roleplay prompts for playing this fictional character at the table.',
        properties: {
          trait: { type: Type.STRING, description: 'One sentence, first person, a personality trait of the character.' },
          ideal: { type: Type.STRING, description: 'One sentence, first person, what the character believes in.' },
          bond: { type: Type.STRING, description: 'One sentence, first person, who or what the character is devoted to.' },
          quirk: { type: Type.STRING, description: 'One sentence, first person, an endearing, harmless quirk.' },
        },
        required: ['trait', 'ideal', 'bond', 'quirk'],
      },
      companion: {
        type: Type.OBJECT,
        description: 'An animal or magical companion who travels with the character.',
        properties: {
          name: { type: Type.STRING, description: 'The companion\'s name.' },
          species: { type: Type.STRING, description: 'What kind of creature it is, two to four words.' },
          description: { type: Type.STRING, description: 'Two sentences about the companion and its role in the adventures.' },
        },
        required: ['name', 'species', 'description'],
      },
      battle_cry: { type: Type.STRING, description: 'A short, quotable battle cry or catchphrase, under 10 words.' },
      backstory: stringArray(
        `Exactly ${backstoryParagraphs} paragraphs of origin story: where the character comes from and what set them on the road.`,
        backstoryParagraphs,
        backstoryParagraphs,
        'One paragraph, three to five sentences.'
      ),
      forged_from: stringArray(
        '"Forged From Your Photo": two to three design notes on which visible photo details inspired this character\'s look or flavor. Only expression, pose, outfit, accessories, colors, lighting, or setting, written as a designer\'s note (e.g. "That raised-eyebrow battle cry became her signature taunt"). Never a claim about the real person\'s personality, and never about facial anatomy, skin, body, or attractiveness.',
        2,
        3,
        'One sentence linking a visible photo detail to a character design choice.'
      ),
    },
    required: [
      'name',
      'epithet',
      'lineage',
      'character_class',
      'alignment',
      'level',
      'hit_points',
      'armor_class',
      'ability_scores',
      'signature_abilities',
      'starting_gear',
      'personality',
      'companion',
      'battle_cry',
      'backstory',
      'forged_from',
    ],
  };
}

const heroSheetSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('hero_sheet'),
    hero: characterSheetSchema({ alignments: GOOD_OR_NEUTRAL_ALIGNMENTS, backstoryParagraphs: 3, role: 'the hero these three photos inspired' }),
    quest_hook: storySchema('The opening scene of this hero\'s first adventure, ending on a cliffhanger.', 3),
  },
  required: ['module', 'hero', 'quest_hook'],
};

const partySheetSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('party_sheet'),
    party_name: { type: Type.STRING, description: 'An original adventuring-party name, two to five words, e.g. "The Lantern Thieves".' },
    heroes: {
      type: Type.ARRAY,
      minItems: '2',
      maxItems: '2',
      description: 'Exactly two heroes, in photo order: the first photo inspires the first hero, the second photo the second.',
      items: characterSheetSchema({ alignments: GOOD_OR_NEUTRAL_ALIGNMENTS, backstoryParagraphs: 2, role: 'one member of a two-hero adventuring party' }),
    },
    combo_move: namedFeatureSchema('A team-up move the two heroes pull off together, built from both classes.'),
    party_dynamic: {
      type: Type.STRING,
      description: 'Two to three sentences on how the two characters play off each other at the table: banter, roles in a fight, running jokes. Both come off as fun and capable.',
    },
    shared_quest: storySchema('The two heroes\' first adventure together.', 3),
  },
  required: ['module', 'party_name', 'heroes', 'combo_move', 'party_dynamic', 'shared_quest'],
};

const nemesisSheetSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('nemesis_sheet'),
    villain: characterSheetSchema({ alignments: VILLAIN_ALIGNMENTS, backstoryParagraphs: 2, role: 'a campy, theatrical villain this photo inspired' }),
    evil_scheme: { type: Type.STRING, description: 'Two sentences: the villain\'s grand, slightly ridiculous master plan.' },
    lair: { type: Type.STRING, description: 'One to two sentences describing the villain\'s lair.' },
    comedic_weakness: { type: Type.STRING, description: 'One sentence: a harmless, funny weakness that keeps foiling the scheme.' },
    showdown: storySchema('The first confrontation between this villain and a band of heroes, ending with the villain escaping to scheme another day.', 3),
  },
  required: ['module', 'villain', 'evil_scheme', 'lair', 'comedic_weakness', 'showdown'],
};

export const READING_SCHEMAS: Record<ReadingModuleId, Schema> = {
  hero: heroSheetSchema,
  party: partySheetSchema,
  nemesis: nemesisSheetSchema,
};
