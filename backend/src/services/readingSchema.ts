import { Schema, Type } from '@google/genai';

// Each module has its own system prompt (see systemPrompt.ts), its own photo
// count, and — since 2026-07-28 — its own response shape, because the three
// readings render as different card stacks in the app. Pick the schema for a
// module from READING_SCHEMAS.
export type ReadingModuleId = 'three-expression' | 'relationship-harmony' | 'career-match';

export const READING_MODULE_IDS: ReadingModuleId[] = ['three-expression', 'relationship-harmony', 'career-match'];

// Character Analysis: 3 (Rest/Grin/Stern, one person). Relationship
// Harmony: 2 (one photo per person). Career Match: 1 (a single photo).
export const MODULE_PHOTO_COUNTS: Record<ReadingModuleId, number> = {
  'three-expression': 3,
  'relationship-harmony': 2,
  'career-match': 1,
};

// The discriminator the frontend switches on to pick a card renderer. Kept
// separate from ReadingModuleId: the ids are internal routing keys, these are
// the payload's public shape names.
export const MODULE_RESULT_KIND = {
  'three-expression': 'character_analysis',
  'relationship-harmony': 'relationship_harmony',
  'career-match': 'career_path',
} as const;

export type ModuleResultKind = (typeof MODULE_RESULT_KIND)[ReadingModuleId];

// Enum-constrained rather than free text: the app renders a fixed icon set,
// so a model-invented name ("brain", "star2") would render as an empty slot.
export const METRIC_ICONS = [
  'eye',
  'sparkles',
  'flame',
  'target',
  'heart',
  'chat',
  'shield',
  'zap',
  'compass',
  'briefcase',
  'lightbulb',
] as const;

export type MetricIcon = (typeof METRIC_ICONS)[number];

// Character Analysis' Facial Structure card reads pure geometry (jawline,
// cheekbones, forehead-to-chin ratio) into one of these categories — never
// an attractiveness judgment, just a shape label, same spirit as the
// existing eye/brow/jawline descriptors in traits_card.
export const FACE_SHAPES = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Oblong', 'Triangle'] as const;

export type FaceShape = (typeof FACE_SHAPES)[number];

export interface ScoreMetric {
  label: string;
  score: number;
  icon: MetricIcon;
}

export interface ScoreCard {
  title: string;
  overall_score: number;
  breakdown_metrics: ScoreMetric[];
}

export interface ChecklistItem {
  headline: string;
  description: string;
}

// Shared across every "deep master card" in every module (2026-08-15
// redesign) — see IMPLEMENTATION_PLAN.md's Phase 10 "master card" entries.
// A card's specific fields (aura, resonance, polarity meters, etc.) sit
// alongside these four; the frontend's shared MasterCard renderer expects
// every card to carry this exact shape regardless of module, which is what
// lets one component render all three modules' cards.
export interface MasterCardNarrative {
  hero_hook: string;
  anatomical_decoding: string[];
  living_scenario: string[];
  actionable_insight: {
    headline: string;
    description: string;
  };
}

// A dual-sided percentage bar. Both sides must be real, specific, grounded
// character/behavioral traits — never a color, gem, or aesthetic/palette
// name standing in for a trait (explicit product correction, 2026-08-15:
// the pre-existing RarityBadge's palette-name "aura" was called out as
// meaningless filler once seen next to real trait content; every polarity
// meter and aura explanation in this redesign exists specifically to not
// repeat that mistake).
export interface PolarityMeter {
  left_trait: string;
  left_percent: number;
  right_trait: string;
}

// Deliberately still evocative (color + element/energy word) — the ask was
// never "stop being fun," it was "don't let the fun word be the *only*
// content." `explanation` is mandatory and must ground `name` in something
// actually observed, so the name is earned rather than decorative.
export interface AuraProfile {
  name: string;
  intensity_percent: number;
  explanation: string;
}

// A flavor "1 in N" rarity stat — playful, not a real population
// statistic (no dataset of other users' readings exists anywhere in this
// app to compute a real one against). `trait_reason` is what keeps it from
// being an arbitrary number: it must name the specific structural
// observation the flavor rarity is tied to.
export interface RarityIndex {
  one_in_n: number;
  trait_reason: string;
}

// Distinct from MasterCardNarrative's `living_scenario` (a grounded,
// true-to-life social moment) — this is deliberately fantastical: a
// legend/fable register, in keeping with the Oracle/Arcana theming, that
// still has to symbolically mirror the person's real archetype rather than
// being generic fantasy for its own sake. Only on the three Shadow Arcana
// cards (one per module) — adding it to every card would just be a second
// copy of living_scenario with a costume on.
export interface MythicTale {
  tale_title: string;
  paragraphs: string[];
}

export interface OracleMatchCard extends MasterCardNarrative {
  title: string;
  archetype_tag: string;
  oracle_match_name: string;
  facial_landmark_resonance: {
    percent: number;
    archetype_label: string;
  };
  aura: AuraProfile;
}

export interface SacredAnatomyCard extends MasterCardNarrative {
  title: string;
  shape_tag: FaceShape;
  golden_ratio_score: {
    percent: number;
    explanation: string;
  };
  structural_dominance: {
    brow_percent: number;
    cheekbone_percent: number;
    jaw_percent: number;
  };
}

export interface AnimalTotemCard extends MasterCardNarrative {
  title: string;
  spirit_animal: string;
  instinctual_radar: PolarityMeter[];
}

export interface TraitSymphonyCard extends MasterCardNarrative {
  title: string;
  polarity_meters: PolarityMeter[];
  rarity_index: RarityIndex;
}

export interface ShadowArcanaCard extends MasterCardNarrative {
  title: string;
  signature_catchphrase: string;
  shadow_traits: string[];
  life_advice: string;
  mythic_tale: MythicTale;
}

export interface CharacterAnalysisResult {
  module: 'character_analysis';
  oracle_match_card: OracleMatchCard;
  sacred_anatomy_card: SacredAnatomyCard;
  animal_totem_card: AnimalTotemCard;
  trait_symphony_card: TraitSymphonyCard;
  shadow_arcana_card: ShadowArcanaCard;
}

export interface BondOracleCard extends MasterCardNarrative {
  title: string;
  bond_archetype_tag: string;
  duo_oracle_match: string;
  bond_resonance: {
    percent: number;
    archetype_label: string;
  };
  aura: AuraProfile;
}

export interface ChemistryGeometryCard extends MasterCardNarrative {
  title: string;
  synergy_score: ScoreCard;
}

export interface InstinctualDynamicsCard extends MasterCardNarrative {
  title: string;
  dynamics_radar: PolarityMeter[];
}

export interface BondShadowArcanaCard extends MasterCardNarrative {
  title: string;
  duo_catchphrase: string;
  shadow_traits: string[];
  guidance_checklist: ChecklistItem[];
  mythic_tale: MythicTale;
}

export interface RelationshipHarmonyResult {
  module: 'relationship_harmony';
  bond_oracle_card: BondOracleCard;
  chemistry_geometry_card: ChemistryGeometryCard;
  instinctual_dynamics_card: InstinctualDynamicsCard;
  bond_shadow_arcana_card: BondShadowArcanaCard;
}

export interface CareerOracleCard extends MasterCardNarrative {
  title: string;
  work_archetype_tag: string;
  career_oracle_match: string;
  career_resonance: {
    percent: number;
    archetype_label: string;
  };
  aura: AuraProfile;
}

export interface IndustryGeometryCard extends MasterCardNarrative {
  title: string;
  work_style_radar: PolarityMeter[];
  top_industry_pills: string[];
}

export interface CareerTraitSymphonyCard extends MasterCardNarrative {
  title: string;
  polarity_meters: PolarityMeter[];
  rarity_index: RarityIndex;
}

export interface CareerShadowArcanaCard extends MasterCardNarrative {
  title: string;
  work_catchphrase: string;
  shadow_traits: string[];
  role_recommendations: ChecklistItem[];
  life_advice: string;
  mythic_tale: MythicTale;
}

export interface CareerPathResult {
  module: 'career_path';
  career_oracle_card: CareerOracleCard;
  industry_geometry_card: IndustryGeometryCard;
  career_trait_symphony_card: CareerTraitSymphonyCard;
  career_shadow_arcana_card: CareerShadowArcanaCard;
}

export type ReadingResult = CharacterAnalysisResult | RelationshipHarmonyResult | CareerPathResult;

// Forced via config.responseSchema + responseMimeType: 'application/json' —
// see PROJECT_SPEC.md §4. Gemini's structured output is schema + mime-type
// based, not tool-use like the Anthropic API.
function moduleDiscriminator(kind: ModuleResultKind): Schema {
  return {
    type: Type.STRING,
    enum: [kind],
    description: `Always exactly "${kind}".`,
  };
}

// Scores are a presentation device, not a measurement — the band and the
// "never punitive" rule live in the system prompts, and the schema only
// enforces that whatever comes back is renderable in a 0-100 dial.
function scoreCard(title: string, overallDescription: string, metricLabels: string[]): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: `Always exactly "${title}".`, enum: [title] },
      overall_score: {
        type: Type.INTEGER,
        minimum: 0,
        maximum: 100,
        description: overallDescription,
      },
      breakdown_metrics: {
        type: Type.ARRAY,
        minItems: '4',
        maxItems: '4',
        description: `Exactly four sub-scores, in this order: ${metricLabels.join(', ')}. Each one varies on its own — do not give four near-identical numbers, and do not simply repeat the overall score.`,
        items: {
          type: Type.OBJECT,
          properties: {
            label: {
              type: Type.STRING,
              enum: metricLabels,
              description: `One of: ${metricLabels.join(', ')}. Use each label exactly once.`,
            },
            score: { type: Type.INTEGER, minimum: 0, maximum: 100, description: 'This facet’s score.' },
            icon: {
              type: Type.STRING,
              enum: [...METRIC_ICONS],
              description: 'The icon that fits this facet, from the allowed set.',
            },
          },
          required: ['label', 'score', 'icon'],
        },
      },
    },
    required: ['title', 'overall_score', 'breakdown_metrics'],
  };
}

function pillArray(description: string, min: number, max: number): Schema {
  return {
    type: Type.ARRAY,
    minItems: String(min),
    maxItems: String(max),
    description,
    items: { type: Type.STRING, description: 'Two to four words, title case — this renders inside a small pill.' },
  };
}

function checklistItemsArraySchema(description: string, headlineDescription: string, min: number, max: number): Schema {
  return {
    type: Type.ARRAY,
    minItems: String(min),
    maxItems: String(max),
    description,
    items: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING, description: headlineDescription },
        description: {
          type: Type.STRING,
          description:
            'Four to five sentences expanding on the headline — real, substantial detail (a genuine paragraph, not a couple of clipped lines) rather than staying generic.',
        },
      },
      required: ['headline', 'description'],
    },
  };
}

function checklistCard(title: string, description: string, headlineDescription: string): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: `Always exactly "${title}".`, enum: [title] },
      checklist_items: checklistItemsArraySchema(description, headlineDescription, 3, 4),
    },
    required: ['title', 'checklist_items'],
  };
}

// Shared by every deep master card across all three modules — see
// MasterCardNarrative's own comment for why this exact shape has to be
// identical everywhere (it's what lets one frontend component render
// every module's cards). `decodingContext` and `scenarioContext` let each
// call site steer what "anatomical_decoding" and "living_scenario" should
// actually decode/dramatize (physical landmarks for a solo reading, shared
// expression dynamics for a pair, working-style signals for a career
// read) without changing the field names the frontend renders against.
function masterCardNarrativeProperties(decodingContext: string, scenarioContext: string): Record<string, Schema> {
  return {
    hero_hook: {
      type: Type.STRING,
      description:
        'A poetic, bold one to two sentence core thesis for this card — the single idea everything below expands on. Striking enough to stop a scroll, not an explanation.',
    },
    anatomical_decoding: {
      type: Type.ARRAY,
      minItems: '3',
      maxItems: '4',
      description: `"What It Says" — three to four bullet points, each linking one specific, concrete observation to a trait. ${decodingContext} Grounded in these photos, never generic enough to paste onto someone else.`,
      items: { type: Type.STRING, description: 'One sentence, one concrete link from observation to trait.' },
    },
    living_scenario: {
      type: Type.ARRAY,
      minItems: '3',
      maxItems: '3',
      description: `Exactly three paragraphs forming a vivid short story. ${scenarioContext} Show the traits in action rather than restating them — warm and constructive even under pressure, never an embarrassing or alarming portrayal.`,
      items: { type: Type.STRING, description: 'One paragraph of the three-paragraph vignette.' },
    },
    actionable_insight: {
      type: Type.OBJECT,
      description: "A dedicated growth-edge callout tied to this card's specific theme.",
      properties: {
        headline: { type: Type.STRING, description: 'A short, punchy headline for the growth edge, two to five words.' },
        description: {
          type: Type.STRING,
          description:
            'Two to three sentences of concrete, actionable insight — phrased as a tendency to balance, never a flaw, deficit, or anything clinical.',
        },
      },
      required: ['headline', 'description'],
    },
  };
}

// See PolarityMeter's comment — the "never a color/gem/palette name"
// instruction is the load-bearing part of this description, not
// boilerplate: it's the direct fix for the exact complaint that triggered
// this redesign's metric rework.
function polarityMeterArraySchema(description: string, min: number, max: number): Schema {
  return {
    type: Type.ARRAY,
    minItems: String(min),
    maxItems: String(max),
    description,
    items: {
      type: Type.OBJECT,
      properties: {
        left_trait: {
          type: Type.STRING,
          description:
            'A real, specific character or behavioral trait grounded in what\'s actually visible, two to four words (e.g. "Observant Irony", "Strategic Composure"). Never a color, gem, or aesthetic/palette name — those read as meaningless filler next to a real trait, not insight.',
        },
        left_percent: {
          type: Type.INTEGER,
          minimum: 55,
          maximum: 95,
          description: 'How strongly the left trait reads versus its opposite — the right side is the remainder (100 minus this).',
        },
        right_trait: {
          type: Type.STRING,
          description:
            "The genuine opposite pole of left_trait — a real contrasting trait, not a synonym and not a palette name (e.g. \"Direct Earnestness\" as the opposite of \"Observant Irony\").",
        },
      },
      required: ['left_trait', 'left_percent', 'right_trait'],
    },
  };
}

function auraProfileSchema(description: string): Schema {
  return {
    type: Type.OBJECT,
    description,
    properties: {
      name: {
        type: Type.STRING,
        description:
          'An evocative two-word aura name (color + element/energy word, e.g. "Crimson Ember", "Slate Tide") that thematically matches the explanation below — never assigned arbitrarily from a fixed list disconnected from the actual read.',
      },
      intensity_percent: { type: Type.INTEGER, minimum: 55, maximum: 99, description: 'How strongly this aura reads.' },
      explanation: {
        type: Type.STRING,
        description:
          "One to two sentences grounding the aura name in a real, specific observation (brow tension, gaze steadiness, expression pace, energy in the room). The name must be earned by this explanation, never decorative on its own.",
      },
    },
    required: ['name', 'intensity_percent', 'explanation'],
  };
}

function rarityIndexSchema(description: string): Schema {
  return {
    type: Type.OBJECT,
    description,
    properties: {
      one_in_n: {
        type: Type.INTEGER,
        minimum: 50,
        maximum: 2000,
        description: 'The flavor rarity ratio — "1 in N". A playful number, not a real statistic.',
      },
      trait_reason: {
        type: Type.STRING,
        description:
          'One sentence naming the specific combination this rarity is flavor-tied to — concrete to this reading, never a generic reason that could apply to anyone.',
      },
    },
    required: ['one_in_n', 'trait_reason'],
  };
}

// See MythicTale's own comment — deliberately a different register from
// masterCardNarrativeProperties' `living_scenario` (grounded/true-to-life):
// this is a legend or fable, symbolic rather than realistic, but still has
// to mirror this specific person's real archetype and traits rather than
// being generic fantasy content.
function mythicTaleSchema(protagonistContext: string): Schema {
  return {
    type: Type.OBJECT,
    description:
      'A short fantastical fable or legend starring a stand-in for this person as its hero — deliberately mythic and larger-than-life (a quest, a trial, an ancient rite of passage), distinct from the grounded living_scenario above. It must still symbolically mirror their real archetype and traits, not be generic fantasy filler. Adventurous and triumphant in tone — never frightening, gruesome, or genuinely dark.',
    properties: {
      tale_title: {
        type: Type.STRING,
        description: 'A short, evocative fable title, three to six words.',
      },
      paragraphs: {
        type: Type.ARRAY,
        minItems: '3',
        maxItems: '3',
        description: `Exactly three paragraphs telling the fable. ${protagonistContext}`,
        items: { type: Type.STRING, description: 'One paragraph of the three-paragraph fable.' },
      },
    },
    required: ['tale_title', 'paragraphs'],
  };
}

const CHARACTER_DECODING_CONTEXT =
  '"What Your Features Say" — link a specific visible physical landmark (jawline, brow line, eye shape, cheekbone width, forehead-to-chin ratio) to a trait.';
const CHARACTER_SCENARIO_CONTEXT =
  'Place this person in a social or high-pressure moment (a room they walk into, a conversation that turns tense, a decision under a deadline).';

const characterAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('character_analysis'),
    oracle_match_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "The Archetype & Oracle Match".', enum: ['The Archetype & Oracle Match'] },
        archetype_tag: {
          type: Type.STRING,
          description: 'A short, striking archetype name, two to three words, e.g. "Analytical Visionary". Title case, no article in front.',
        },
        oracle_match_name: {
          type: Type.STRING,
          description:
            'One widely known public figure whose on-camera expression energy sits in the same register. A vibe comparison, never a lookalike claim — never say they resemble, share features with, or look like this person, and never reference their bone structure, brow ridge, or jaw shape.',
        },
        facial_landmark_resonance: {
          type: Type.OBJECT,
          description: 'A flavor "resonance" stat — playful, not a real measurement, but grounded in a specific real archetype label rather than a generic word.',
          properties: {
            percent: { type: Type.INTEGER, minimum: 60, maximum: 99, description: 'The resonance percentage.' },
            archetype_label: {
              type: Type.STRING,
              description:
                'A specific archetype-style label this resonance is with, e.g. "High-Brow Deadpan Archetypes" — grounded in something actually visible, never a placeholder word.',
            },
          },
          required: ['percent', 'archetype_label'],
        },
        aura: auraProfileSchema("This person's flavor aura — an evocative name paired with a mandatory explanation grounding it in real observed traits."),
        ...masterCardNarrativeProperties(CHARACTER_DECODING_CONTEXT, CHARACTER_SCENARIO_CONTEXT),
      },
      required: [
        'title',
        'archetype_tag',
        'oracle_match_name',
        'facial_landmark_resonance',
        'aura',
        'hero_hook',
        'anatomical_decoding',
        'living_scenario',
        'actionable_insight',
      ],
    },
    sacred_anatomy_card: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'Always exactly "Facial Geometry & Sacred Anatomy".',
          enum: ['Facial Geometry & Sacred Anatomy'],
        },
        shape_tag: {
          type: Type.STRING,
          enum: [...FACE_SHAPES],
          description: 'One face shape category, read from jawline curve, cheekbone width, and forehead-to-chin proportion.',
        },
        golden_ratio_score: {
          type: Type.OBJECT,
          description:
            'A playful proportion-flourish score — purely a geometric-proportion flavor stat, same spirit as the shape tag above. Never framed as attractiveness or beauty.',
          properties: {
            percent: { type: Type.INTEGER, minimum: 60, maximum: 99, description: 'The flavor proportion score.' },
            explanation: {
              type: Type.STRING,
              description:
                'One to two sentences on the structural proportion basis for this score (forehead-to-chin ratio, symmetry, spacing) — purely descriptive geometry. Never a judgment of attractiveness or beauty, never mentioning race, ethnicity, health, or disability.',
            },
          },
          required: ['percent', 'explanation'],
        },
        structural_dominance: {
          type: Type.OBJECT,
          description: "Relative visual dominance of three facial zones in this person's geometry — independent reads, not a pie that must sum to 100.",
          properties: {
            brow_percent: { type: Type.INTEGER, minimum: 0, maximum: 100, description: 'Brow line visual dominance.' },
            cheekbone_percent: { type: Type.INTEGER, minimum: 0, maximum: 100, description: 'Cheekbone visual dominance.' },
            jaw_percent: { type: Type.INTEGER, minimum: 0, maximum: 100, description: 'Jawline visual dominance.' },
          },
          required: ['brow_percent', 'cheekbone_percent', 'jaw_percent'],
        },
        ...masterCardNarrativeProperties(CHARACTER_DECODING_CONTEXT, CHARACTER_SCENARIO_CONTEXT),
      },
      required: [
        'title',
        'shape_tag',
        'golden_ratio_score',
        'structural_dominance',
        'hero_hook',
        'anatomical_decoding',
        'living_scenario',
        'actionable_insight',
      ],
    },
    animal_totem_card: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'Always exactly "The Animal Totem & Primal Energy".',
          enum: ['The Animal Totem & Primal Energy'],
        },
        spirit_animal: {
          type: Type.STRING,
          description: 'One animal, one or two words, e.g. "Wolf" or "Snowy Owl". Title case.',
        },
        instinctual_radar: polarityMeterArraySchema(
          "Two to three polarity meters reading this person's instinctual/primal energy style — real behavioral trait pairs grounded in visible expression and structure, never a color, gem, or palette name.",
          2,
          3
        ),
        ...masterCardNarrativeProperties(CHARACTER_DECODING_CONTEXT, CHARACTER_SCENARIO_CONTEXT),
      },
      required: ['title', 'spirit_animal', 'instinctual_radar', 'hero_hook', 'anatomical_decoding', 'living_scenario', 'actionable_insight'],
    },
    trait_symphony_card: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'Always exactly "Trait Symphony & Behavioral Polarities".',
          enum: ['Trait Symphony & Behavioral Polarities'],
        },
        polarity_meters: polarityMeterArraySchema(
          'Three to four dual-sided polarity meters — real, specific behavioral trait pairs grounded in these photos (e.g. "Observant Irony" vs "Direct Earnestness", "Strategic Composure" vs "Raw Impulse"). Never a color, gem, or aesthetic/palette name standing in for a trait.',
          3,
          4
        ),
        rarity_index: rarityIndexSchema('A flavor rarity stat for this trait combination — playful, not a real population statistic, but grounded in a specific real structural observation.'),
        ...masterCardNarrativeProperties(CHARACTER_DECODING_CONTEXT, CHARACTER_SCENARIO_CONTEXT),
      },
      required: ['title', 'polarity_meters', 'rarity_index', 'hero_hook', 'anatomical_decoding', 'living_scenario', 'actionable_insight'],
    },
    shadow_arcana_card: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'Always exactly "The Secret Signature & Shadow Arcana".',
          enum: ['The Secret Signature & Shadow Arcana'],
        },
        signature_catchphrase: {
          type: Type.STRING,
          description:
            'A short, quotable one-liner, under 8 words, that captures this person\'s energy — phrased like a movie tagline or a bold nickname. Wrapped in quotation marks.',
        },
        shadow_traits: pillArray(
          'Two to three gentle "shadow" growth edges — phrased as tendencies to balance, never as flaws, deficits, or anything clinical or alarming. Still an entertainment-only, constructive read.',
          2,
          3
        ),
        life_advice: {
          type: Type.STRING,
          description:
            "Two to three sentences of warm, practical life advice tied to this person's specific archetype and traits — never generic, never clinical, never a real diagnosis or prescription of any kind.",
        },
        mythic_tale: mythicTaleSchema('The protagonist should clearly stand in for this person, mirroring their archetype_tag and traits from the cards above.'),
        ...masterCardNarrativeProperties(CHARACTER_DECODING_CONTEXT, CHARACTER_SCENARIO_CONTEXT),
      },
      required: [
        'title',
        'signature_catchphrase',
        'shadow_traits',
        'life_advice',
        'mythic_tale',
        'hero_hook',
        'anatomical_decoding',
        'living_scenario',
        'actionable_insight',
      ],
    },
  },
  required: ['module', 'oracle_match_card', 'sacred_anatomy_card', 'animal_totem_card', 'trait_symphony_card', 'shadow_arcana_card'],
};

const BOND_DECODING_CONTEXT =
  '"What The Dynamic Says" — link a specific visible expression-dynamic between the two people (how their gazes meet, how their energy levels compare, how their expressions play off each other) to a trait about the pairing.';
const BOND_SCENARIO_CONTEXT =
  'Place the two of them together in a social or high-pressure moment (a dinner, a disagreement, a celebration) and show the dynamic in action.';

const relationshipHarmonySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('relationship_harmony'),
    bond_oracle_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "The Bond Archetype & Oracle Match".', enum: ['The Bond Archetype & Oracle Match'] },
        bond_archetype_tag: {
          type: Type.STRING,
          description: 'A short, striking archetype name for how these two expression styles meet, two to three words, e.g. "Grounded & Playful Harmonizer".',
        },
        duo_oracle_match: {
          type: Type.STRING,
          description:
            'One widely known on-screen or real-world duo (buddy-movie pair, famous partnership) whose dynamic matches this pairing\'s energy. A vibe comparison, never a claim either person resembles or is related to anyone named.',
        },
        bond_resonance: {
          type: Type.OBJECT,
          description: 'A flavor "resonance" stat for the pairing — playful, grounded in a specific real dynamic label.',
          properties: {
            percent: { type: Type.INTEGER, minimum: 60, maximum: 99, description: 'The resonance percentage.' },
            archetype_label: {
              type: Type.STRING,
              description: 'A specific dynamic-style label this resonance is with, e.g. "Steady-Anchor & Spark Pairings" — grounded in what\'s actually visible.',
            },
          },
          required: ['percent', 'archetype_label'],
        },
        aura: auraProfileSchema('This pairing\'s flavor aura — an evocative name paired with a mandatory explanation grounding it in real observed dynamics.'),
        ...masterCardNarrativeProperties(BOND_DECODING_CONTEXT, BOND_SCENARIO_CONTEXT),
      },
      required: [
        'title',
        'bond_archetype_tag',
        'duo_oracle_match',
        'bond_resonance',
        'aura',
        'hero_hook',
        'anatomical_decoding',
        'living_scenario',
        'actionable_insight',
      ],
    },
    chemistry_geometry_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "Chemistry Geometry & Synergy Score".', enum: ['Chemistry Geometry & Synergy Score'] },
        synergy_score: scoreCard(
          'Synergy Score',
          'The headline chemistry score for the pair. Entertainment framing: a playful read on how two expression styles complement each other, never a verdict on a real relationship.',
          ['Empathy', 'Communication', 'Attachment', 'Energy Match']
        ),
        ...masterCardNarrativeProperties(BOND_DECODING_CONTEXT, BOND_SCENARIO_CONTEXT),
      },
      required: ['title', 'synergy_score', 'hero_hook', 'anatomical_decoding', 'living_scenario', 'actionable_insight'],
    },
    instinctual_dynamics_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "Instinctual Dynamics & Primal Rhythm".', enum: ['Instinctual Dynamics & Primal Rhythm'] },
        dynamics_radar: polarityMeterArraySchema(
          'Three to four dual-sided polarity meters reading this pairing\'s dynamic style — real, specific relational trait pairs grounded in these photos (e.g. "Playful Push-Pull" vs "Steady Anchoring"). Never a color, gem, or palette name. Phrase every meter as a pattern between the two styles, never as one person\'s trait alone.',
          3,
          4
        ),
        ...masterCardNarrativeProperties(BOND_DECODING_CONTEXT, BOND_SCENARIO_CONTEXT),
      },
      required: ['title', 'dynamics_radar', 'hero_hook', 'anatomical_decoding', 'living_scenario', 'actionable_insight'],
    },
    bond_shadow_arcana_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "The Secret Signature & Shadow Arcana of the Bond".', enum: ['The Secret Signature & Shadow Arcana of the Bond'] },
        duo_catchphrase: {
          type: Type.STRING,
          description:
            'A short, quotable one-liner, under 8 words, capturing this pair\'s shared energy — like a buddy-movie tagline. Fun and warm, wrapped in quotation marks.',
        },
        shadow_traits: pillArray(
          'Two to three gentle "shadow" dynamics worth steering around — phrased as patterns between the two styles, never as an accusation or flaw belonging to either person.',
          2,
          3
        ),
        guidance_checklist: checklistItemsArraySchema(
          'Two to four practical, warm suggestions for this pairing.',
          'A short imperative title for the suggestion, e.g. "Direct Communication".',
          2,
          4
        ),
        mythic_tale: mythicTaleSchema('The tale should feature two protagonists standing in for this pair, mirroring their bond_archetype_tag and dynamic from the cards above.'),
        ...masterCardNarrativeProperties(BOND_DECODING_CONTEXT, BOND_SCENARIO_CONTEXT),
      },
      required: [
        'title',
        'duo_catchphrase',
        'shadow_traits',
        'guidance_checklist',
        'mythic_tale',
        'hero_hook',
        'anatomical_decoding',
        'living_scenario',
        'actionable_insight',
      ],
    },
  },
  required: ['module', 'bond_oracle_card', 'chemistry_geometry_card', 'instinctual_dynamics_card', 'bond_shadow_arcana_card'],
};

const CAREER_DECODING_CONTEXT =
  '"What Your Working Style Says" — link a specific visible expression or composure signal to a workplace trait.';
const CAREER_SCENARIO_CONTEXT =
  'Place this person in a high-pressure or high-stakes work moment (a deadline crunch, a room they need to win over, a decision with real weight).';

const careerPathSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('career_path'),
    career_oracle_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "The Career Archetype & Oracle Match".', enum: ['The Career Archetype & Oracle Match'] },
        work_archetype_tag: {
          type: Type.STRING,
          description: 'A short, striking work archetype name, two to three words, e.g. "Strategic Innovator".',
        },
        career_oracle_match: {
          type: Type.STRING,
          description:
            'One widely known public figure whose career energy and working style sit in the same register. A vibe comparison, never a claim about resemblance or a real career outcome.',
        },
        career_resonance: {
          type: Type.OBJECT,
          description: 'A flavor "resonance" stat — playful, grounded in a specific real archetype label.',
          properties: {
            percent: { type: Type.INTEGER, minimum: 60, maximum: 99, description: 'The resonance percentage.' },
            archetype_label: {
              type: Type.STRING,
              description: 'A specific work-archetype label this resonance is with, e.g. "Calm-Under-Fire Builders" — grounded in what\'s actually visible.',
            },
          },
          required: ['percent', 'archetype_label'],
        },
        aura: auraProfileSchema("This person's flavor work aura — an evocative name paired with a mandatory explanation grounding it in real observed traits."),
        ...masterCardNarrativeProperties(CAREER_DECODING_CONTEXT, CAREER_SCENARIO_CONTEXT),
      },
      required: [
        'title',
        'work_archetype_tag',
        'career_oracle_match',
        'career_resonance',
        'aura',
        'hero_hook',
        'anatomical_decoding',
        'living_scenario',
        'actionable_insight',
      ],
    },
    industry_geometry_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "Industry Geometry & Work-Style Radar".', enum: ['Industry Geometry & Work-Style Radar'] },
        work_style_radar: polarityMeterArraySchema(
          'Two to three polarity meters reading this person\'s work-style axes — real, specific traits grounded in these photos (e.g. "Deep-Focus Craft" vs "Fast-Paced Hustle"). Never a color, gem, or palette name.',
          2,
          3
        ),
        top_industry_pills: pillArray('Three industries or fields that suit this archetype.', 3, 4),
        ...masterCardNarrativeProperties(CAREER_DECODING_CONTEXT, CAREER_SCENARIO_CONTEXT),
      },
      required: ['title', 'work_style_radar', 'top_industry_pills', 'hero_hook', 'anatomical_decoding', 'living_scenario', 'actionable_insight'],
    },
    career_trait_symphony_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "Trait Symphony & Working Polarities".', enum: ['Trait Symphony & Working Polarities'] },
        polarity_meters: polarityMeterArraySchema(
          'Three to four dual-sided polarity meters — real, specific workplace trait pairs grounded in these photos. Never a color, gem, or palette name.',
          3,
          4
        ),
        rarity_index: rarityIndexSchema('A flavor rarity stat for this working-style combination — playful, grounded in a specific real observation.'),
        ...masterCardNarrativeProperties(CAREER_DECODING_CONTEXT, CAREER_SCENARIO_CONTEXT),
      },
      required: ['title', 'polarity_meters', 'rarity_index', 'hero_hook', 'anatomical_decoding', 'living_scenario', 'actionable_insight'],
    },
    career_shadow_arcana_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "The Secret Signature & Shadow Arcana"', enum: ['The Secret Signature & Shadow Arcana'] },
        work_catchphrase: {
          type: Type.STRING,
          description:
            'A short, quotable one-liner, under 8 words, capturing this person\'s work energy — like a confident job-title mashup. Wrapped in quotation marks.',
        },
        shadow_traits: pillArray(
          'Two to three gentle "shadow" growth edges for this work style — phrased as tendencies to balance, never as flaws, deficits, or performance issues.',
          2,
          3
        ),
        role_recommendations: checklistItemsArraySchema(
          'Three or four concrete role suggestions that fit the archetype.',
          'A concrete role title, e.g. "Systems Architect / Lead Engineer".',
          3,
          4
        ),
        life_advice: {
          type: Type.STRING,
          description: "Two to three sentences of warm, practical career advice tied to this person's specific archetype — never generic, never a guarantee of outcome.",
        },
        mythic_tale: mythicTaleSchema('The protagonist should clearly stand in for this person, mirroring their work_archetype_tag and traits from the cards above — a legendary guild, quest, or trial rather than a literal workplace.'),
        ...masterCardNarrativeProperties(CAREER_DECODING_CONTEXT, CAREER_SCENARIO_CONTEXT),
      },
      required: [
        'title',
        'work_catchphrase',
        'shadow_traits',
        'role_recommendations',
        'life_advice',
        'mythic_tale',
        'hero_hook',
        'anatomical_decoding',
        'living_scenario',
        'actionable_insight',
      ],
    },
  },
  required: ['module', 'career_oracle_card', 'industry_geometry_card', 'career_trait_symphony_card', 'career_shadow_arcana_card'],
};

export const READING_SCHEMAS: Record<ReadingModuleId, Schema> = {
  'three-expression': characterAnalysisSchema,
  'relationship-harmony': relationshipHarmonySchema,
  'career-match': careerPathSchema,
};
