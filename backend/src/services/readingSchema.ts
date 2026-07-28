import { Schema, Type } from '@google/genai';

// Each module has its own system prompt (see systemPrompt.ts), its own photo
// count, and — since 2026-07-28 — its own response shape, because the three
// readings render as different card stacks in the app. Pick the schema for a
// module from READING_SCHEMAS.
export type ReadingModuleId = 'three-expression' | 'relationship-harmony' | 'career-match';

export const READING_MODULE_IDS: ReadingModuleId[] = ['three-expression', 'relationship-harmony', 'career-match'];

// Character Analysis: 3 (Calm/Bright/Deep, one person). Relationship
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

export interface ScoreMetric {
  label: string;
  score: number;
  icon: MetricIcon;
}

export interface BadgeCard {
  title: string;
  badge_tag: string;
  summary: string;
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

export interface MetadataBadge {
  key: string;
  value: string;
}

export interface CharacterAnalysisResult {
  module: 'character_analysis';
  archetype_card: BadgeCard;
  temperament_score_card: ScoreCard;
  traits_card: {
    title: string;
    metadata_badges: MetadataBadge[];
    strength_pills: string[];
    growth_pills: string[];
  };
  celebrity_match_card: {
    title: string;
    match_name: string;
    match_description: string;
  };
}

export interface RelationshipHarmonyResult {
  module: 'relationship_harmony';
  vibe_card: BadgeCard;
  chemistry_score_card: ScoreCard;
  dynamics_card: {
    title: string;
    best_chemistry_pills: string[];
    vibes_to_avoid_pills: string[];
  };
  guidance_card: {
    title: string;
    checklist_items: ChecklistItem[];
  };
}

export interface CareerPathResult {
  module: 'career_path';
  work_archetype_card: BadgeCard;
  suitability_score_card: ScoreCard;
  domains_card: {
    title: string;
    top_industry_pills: string[];
  };
  recommendations_card: {
    title: string;
    checklist_items: ChecklistItem[];
  };
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

function badgeCard(title: string, tagDescription: string, summaryDescription: string): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: `Always exactly "${title}".`, enum: [title] },
      badge_tag: { type: Type.STRING, description: tagDescription },
      summary: { type: Type.STRING, description: summaryDescription },
    },
    required: ['title', 'badge_tag', 'summary'],
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

function checklistCard(title: string, description: string, headlineDescription: string): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: `Always exactly "${title}".`, enum: [title] },
      checklist_items: {
        type: Type.ARRAY,
        minItems: '2',
        maxItems: '4',
        description,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: headlineDescription },
            description: {
              type: Type.STRING,
              description: 'One or two sentences expanding on the headline. Concrete and actionable, never generic filler.',
            },
          },
          required: ['headline', 'description'],
        },
      },
    },
    required: ['title', 'checklist_items'],
  };
}

const characterAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('character_analysis'),
    archetype_card: badgeCard(
      'Character Archetype',
      'A short, striking archetype name of two to three words, e.g. "Analytical Visionary". Title case, no article in front.',
      'Two sentences on the dominant character vibe read from facial geometry, gaze and expression range across the three photos. Specific enough that it could not be pasted onto a different person.'
    ),
    temperament_score_card: scoreCard(
      'Temperament Score',
      'The headline temperament score. Read it from the expression range across all three photos.',
      ['Calmness', 'Expressiveness', 'Intensity', 'Focus']
    ),
    traits_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "Facial Trait Analysis".', enum: ['Facial Trait Analysis'] },
        metadata_badges: {
          type: Type.ARRAY,
          minItems: '2',
          maxItems: '4',
          description:
            'Short key/value observations about visible expression features, e.g. key "Eye Energy" value "Direct & Piercing". Descriptive of expression and structure only.',
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING, description: 'The feature being described, one or two words.' },
              value: { type: Type.STRING, description: 'The reading of it, two to four words.' },
            },
            required: ['key', 'value'],
          },
        },
        strength_pills: pillArray('Three character strengths this expression style suggests.', 3, 4),
        growth_pills: pillArray(
          'Two or three gentle growth edges, phrased as tendencies to balance rather than flaws or deficits. Never clinical, never something a person would feel judged by.',
          2,
          3
        ),
      },
      required: ['title', 'metadata_badges', 'strength_pills', 'growth_pills'],
    },
    celebrity_match_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "Celebrity Archetype Match".', enum: ['Celebrity Archetype Match'] },
        match_name: {
          type: Type.STRING,
          description: 'One widely known public figure whose on-camera expression energy sits in the same register.',
        },
        match_description: {
          type: Type.STRING,
          description:
            'One or two sentences on the shared expression energy and presence — how they carry a room, hold a gaze, shift between warmth and focus. Never a claim about physical resemblance or shared facial features.',
        },
      },
      required: ['title', 'match_name', 'match_description'],
    },
  },
  required: ['module', 'archetype_card', 'temperament_score_card', 'traits_card', 'celebrity_match_card'],
};

const relationshipHarmonySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('relationship_harmony'),
    vibe_card: badgeCard(
      'Relational Archetype',
      'A short, striking archetype name for how these two expression styles meet, two to three words, e.g. "Deep & Selective Harmonizer".',
      'Two sentences on how the two expression styles play off each other — what each brings and where they meet.'
    ),
    chemistry_score_card: scoreCard(
      'Chemistry & Synergy Score',
      'The headline chemistry score for the pair. Entertainment framing: this is a playful read on how two expression styles complement each other, never a verdict on a real relationship.',
      ['Empathy', 'Communication', 'Attachment', 'Energy Match']
    ),
    dynamics_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "Relationship Dynamics".', enum: ['Relationship Dynamics'] },
        best_chemistry_pills: pillArray('Three qualities that bring out the best in this pairing.', 3, 4),
        vibes_to_avoid_pills: pillArray(
          'Two or three dynamics worth steering around. Phrase them as patterns, never as an accusation about either person.',
          2,
          3
        ),
      },
      required: ['title', 'best_chemistry_pills', 'vibes_to_avoid_pills'],
    },
    guidance_card: checklistCard(
      'Harmony Recommendations',
      'Two to four practical, warm suggestions for this pairing.',
      'A short imperative title for the suggestion, e.g. "Direct Communication".'
    ),
  },
  required: ['module', 'vibe_card', 'chemistry_score_card', 'dynamics_card', 'guidance_card'],
};

const careerPathSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    module: moduleDiscriminator('career_path'),
    work_archetype_card: badgeCard(
      'Career Archetype',
      'A short, striking work archetype name of two to three words, e.g. "Strategic Innovator".',
      'Two sentences on the working environments and roles that suit this natural composure and expression style.'
    ),
    suitability_score_card: scoreCard(
      'Career Alignment Score',
      'The headline alignment score for this work archetype. A vibe read, never an aptitude measurement.',
      ['Strategy', 'Execution', 'Resilience', 'Innovation']
    ),
    domains_card: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Always exactly "Recommended Industries".', enum: ['Recommended Industries'] },
        top_industry_pills: pillArray('Three industries or fields that suit this archetype.', 3, 4),
      },
      required: ['title', 'top_industry_pills'],
    },
    recommendations_card: checklistCard(
      'Ideal Role Matches',
      'Two to four role suggestions that fit the archetype.',
      'A concrete role title, e.g. "Systems Architect / Lead Engineer".'
    ),
  },
  required: ['module', 'work_archetype_card', 'suitability_score_card', 'domains_card', 'recommendations_card'],
};

export const READING_SCHEMAS: Record<ReadingModuleId, Schema> = {
  'three-expression': characterAnalysisSchema,
  'relationship-harmony': relationshipHarmonySchema,
  'career-match': careerPathSchema,
};
