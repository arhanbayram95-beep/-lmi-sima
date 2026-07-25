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
      description: 'A short, punchy one-line headline for the reading (roughly 4-8 words).',
    },
    insights: {
      type: Type.ARRAY,
      description:
        'One insight per photo provided, in the same order the photos were given. How many and how to label them depends on which reading this is — follow the system prompt.',
      items: {
        type: Type.OBJECT,
        properties: {
          label: {
            type: Type.STRING,
            description: 'A short label for this insight — see the system prompt for what fits this reading.',
          },
          insight: { type: Type.STRING, description: 'A short, warm observation for this insight.' },
        },
        required: ['label', 'insight'],
      },
    },
    narrative: {
      type: Type.STRING,
      description: 'A short paragraph (2-4 sentences) tying the insights together into an overall read.',
    },
  },
  required: ['headline', 'insights', 'narrative'],
};
