import { Schema, Type } from '@google/genai';

// Each maps to its own system prompt (see systemPrompt.ts) and its own
// expected photo count (see MODULE_PHOTO_COUNTS) — same response shape
// below across all three, only the prompt framing and photo count differ.
export type ReadingModuleId = 'three-expression' | 'relationship-harmony' | 'career-match';

export const READING_MODULE_IDS: ReadingModuleId[] = ['three-expression', 'relationship-harmony', 'career-match'];

// Character Analysis: 3 (Calm/Bright/Deep, one person). Relationship
// Harmony: 2 (one photo per person). Career Match: 1 (a single photo).
export const MODULE_PHOTO_COUNTS: Record<ReadingModuleId, number> = {
  'three-expression': 3,
  'relationship-harmony': 2,
  'career-match': 1,
};

// 'label' is free text rather than a fixed enum because its meaning varies
// by module — an expression name for Character Analysis, a person
// identifier for Relationship Harmony, a career facet for Career Match.
// The system prompt for each module, not this schema, governs what a
// sensible label looks like.
export interface ReadingInsight {
  label: string;
  insight: string;
}

export interface ReadingResult {
  headline: string;
  insights: ReadingInsight[];
  narrative: string;
}

// Forced via config.responseSchema + responseMimeType: 'application/json' in
// geminiClient/readingService — see PROJECT_SPEC.md §4. Gemini's structured
// output is schema + mime-type based, not tool-use like the Anthropic API.
export const readingResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description:
        'The single most brief, remarkable line in the whole reading (roughly 4-8 words) - a scroll-stopping hook the user reads first, not a summary of what follows. Save all specifics and elaboration for the insights and narrative below it.',
    },
    insights: {
      type: Type.ARRAY,
      description:
        'One insight per photo provided, in the same order the photos were given. How many and how to label them depends on which reading this is — follow the system prompt. This is where the real detail and specificity lives, not the headline.',
      items: {
        type: Type.OBJECT,
        properties: {
          label: {
            type: Type.STRING,
            description: 'A short label for this insight — see the system prompt for what fits this reading.',
          },
          insight: {
            type: Type.STRING,
            description:
              'A specific, detailed observation for this one photo - concrete enough that it could not be copy-pasted onto a different photo. Go deeper than the headline, not just a rephrasing of it.',
          },
        },
        required: ['label', 'insight'],
      },
    },
    narrative: {
      type: Type.STRING,
      description:
        'The detailed payoff of the reading (3-5 sentences) - ties the insights together and goes further into specifics than the headline or any single insight does. This is where the user gets the substance, after the brief hook up top.',
    },
  },
  required: ['headline', 'insights', 'narrative'],
};
