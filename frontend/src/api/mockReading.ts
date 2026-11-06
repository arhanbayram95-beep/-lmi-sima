import { AnalyzeReadingPayload, CharacterSheet, PortraitPayload, PortraitResult, ReadingModuleId, ReadingResult, Story } from './types';

// Placeholder pseudo-API output for local development without a backend —
// shaped exactly like each mode's response schema (backend readingSchema.ts).
export function mockCharacterSheet(name: string, alignment = 'Chaotic Good', backstoryParagraphs = 3): CharacterSheet {
  return {
    name,
    epithet: 'the Unhurried Storm',
    lineage: 'Halfling',
    character_class: 'Bard',
    alignment,
    level: 3,
    hit_points: 21,
    armor_class: 14,
    ability_scores: [
      { ability: 'STR', score: 9, flair: 'Placeholder — carries a lute, not a sword, for a reason.' },
      { ability: 'DEX', score: 15, flair: 'Placeholder — once caught a falling chandelier mid-verse.' },
      { ability: 'CON', score: 12, flair: 'Placeholder — survived the Long Winter Tour.' },
      { ability: 'INT', score: 13, flair: 'Placeholder — knows four hundred tavern songs by heart.' },
      { ability: 'WIS', score: 11, flair: 'Placeholder — usually reads the room. Usually.' },
      { ability: 'CHA', score: 17, flair: 'Placeholder — talked a troll into a duet.' },
    ],
    signature_abilities: [
      { name: 'Encore of Thunder', description: 'Placeholder — a song that knocks foes back a few paces.' },
      { name: 'Borrowed Courage', description: 'Placeholder — an ally rerolls one failed save.' },
      { name: 'Tavern Rumor', description: 'Placeholder — learns one local secret per town.' },
    ],
    starting_gear: ['A lute with one cursed string', "Traveler's cloak", 'Three lucky dice'],
    personality: {
      trait: 'Placeholder — I narrate my own fights.',
      ideal: 'Placeholder — every story deserves an audience.',
      bond: "Placeholder — my mentor's battered songbook.",
      quirk: 'Placeholder — I hum when I am nervous.',
    },
    companion: { name: 'Pip', species: 'Clockwork sparrow', description: 'Placeholder — steals shiny things and sings harmony.' },
    battle_cry: 'Play it louder!',
    backstory: Array.from({ length: backstoryParagraphs }, (_, i) => `Placeholder pseudo-API output — backstory paragraph ${i + 1}.`),
    forged_from: ['Placeholder — that grin became the stage swagger.', 'Placeholder — the red scarf became the cloak.'],
  };
}

const story = (title: string): Story => ({
  title,
  paragraphs: ['Placeholder story paragraph one.', 'Placeholder story paragraph two.', 'Placeholder story paragraph three.'],
});

export const MOCK_READING_RESULTS: Record<ReadingModuleId, ReadingResult> = {
  hero: {
    module: 'hero_sheet',
    hero: mockCharacterSheet('Wren Ashdown'),
    quest_hook: story('The Bell Beneath the Lake'),
  },
  party: {
    module: 'party_sheet',
    party_name: 'The Lantern Thieves',
    heroes: [mockCharacterSheet('Wren Ashdown', 'Chaotic Good', 2), mockCharacterSheet('Corvin Vale', 'Lawful Good', 2)],
    combo_move: { name: 'Lantern Gambit', description: 'Placeholder — one distracts, the other steals the light.' },
    party_dynamic: 'Placeholder — they argue about maps and somehow never get lost.',
    shared_quest: story('The Night Market Heist'),
  },
  nemesis: {
    module: 'nemesis_sheet',
    villain: mockCharacterSheet('Baron Velvetgloom', 'Chaotic Evil', 2),
    evil_scheme: 'Placeholder — replace every bell in the kingdom with kazoos.',
    lair: 'Placeholder — a clocktower that runs backwards.',
    comedic_weakness: 'Placeholder — cannot resist monologuing to pigeons.',
    showdown: story('Midnight at the Backwards Tower'),
  },
};

const MOCK_LATENCY_MS = 1200;

export async function analyzeReadingMock(payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return MOCK_READING_RESULTS[payload.module];
}

// Echoes the captured photo back as the "portrait" so the paint flow can be
// exercised end to end without the image model.
export async function generatePortraitMock(payload: PortraitPayload): Promise<PortraitResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return { mime_type: 'image/jpeg', data: payload.photo };
}
