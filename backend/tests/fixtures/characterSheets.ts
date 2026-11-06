import { ReadingModuleId } from '../../src/services/readingSchema';

// Fixture responses shaped like each mode's responseSchema
// (readingSchema.ts). Never the real API in tests, per CLAUDE.md.
export function characterSheet(name: string, alignment = 'Chaotic Good', backstoryParagraphs = 3) {
  return {
    name,
    epithet: 'the Unhurried Storm',
    lineage: 'Halfling',
    character_class: 'Bard',
    alignment,
    level: 3,
    hit_points: 21,
    armor_class: 14,
    ability_scores: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability, i) => ({
      ability,
      score: 10 + i,
      flair: `${ability} flair.`,
    })),
    signature_abilities: [
      { name: 'Encore of Thunder', description: 'A song that knocks foes back.' },
      { name: 'Borrowed Courage', description: 'An ally rerolls a failed save.' },
      { name: 'Tavern Rumor', description: 'Learns one secret per town.' },
    ],
    starting_gear: ['A lute with one cursed string', 'Traveler\'s cloak', 'Three lucky dice'],
    personality: {
      trait: 'I narrate my own fights.',
      ideal: 'Every story deserves an audience.',
      bond: 'My mentor\'s songbook.',
      quirk: 'I hum when nervous.',
    },
    companion: { name: 'Pip', species: 'Clockwork sparrow', description: 'Steals shiny things. Sings harmony.' },
    battle_cry: 'Play it louder!',
    backstory: Array.from({ length: backstoryParagraphs }, (_, i) => `Backstory paragraph ${i + 1}.`),
    forged_from: ['That grin became her stage swagger.', 'The red scarf became her cloak.'],
  };
}

const story = (title: string) => ({ title, paragraphs: ['Story one.', 'Story two.', 'Story three.'] });

export const MODULE_RESPONSES: Record<ReadingModuleId, Record<string, unknown>> = {
  hero: {
    module: 'hero_sheet',
    hero: characterSheet('Wren Ashdown'),
    quest_hook: story('The Bell Beneath the Lake'),
  },
  party: {
    module: 'party_sheet',
    party_name: 'The Lantern Thieves',
    heroes: [characterSheet('Wren Ashdown', 'Chaotic Good', 2), characterSheet('Corvin Vale', 'Lawful Good', 2)],
    combo_move: { name: 'Lantern Gambit', description: 'One distracts, one steals the light.' },
    party_dynamic: 'They argue about maps and never get lost.',
    shared_quest: story('The Night Market Heist'),
  },
  nemesis: {
    module: 'nemesis_sheet',
    villain: characterSheet('Baron Velvetgloom', 'Chaotic Evil', 2),
    evil_scheme: 'Replace every bell in the kingdom with kazoos.',
    lair: 'A clocktower that runs backwards.',
    comedic_weakness: 'Cannot resist monologuing to pigeons.',
    showdown: story('Midnight at the Backwards Tower'),
  },
};
