import { Schema, Type } from '@google/genai';

export type ExpressionLabel = 'calm' | 'bright' | 'deep';

// Each maps to its own system prompt (see systemPrompt.ts) — same response
// shape below across all three, only the prompt framing differs.
export type ReadingModuleId = 'three-expression' | 'relationship-harmony' | 'career-match';

export const READING_MODULE_IDS: ReadingModuleId[] = ['three-expression', 'relationship-harmony', 'career-match'];

export interface ExpressionInsight {
  expression: ExpressionLabel;
  insight: string;
}

export interface ReadingResult {
  headline: string;
  expression_insights: ExpressionInsight[];
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
    expression_insights: {
      type: Type.ARRAY,
      description: 'One insight per captured expression, in the order Calm, Bright, Deep.',
      items: {
        type: Type.OBJECT,
        properties: {
          expression: { type: Type.STRING, format: 'enum', enum: ['calm', 'bright', 'deep'] },
          insight: { type: Type.STRING, description: 'A short, warm observation for this expression.' },
        },
        required: ['expression', 'insight'],
      },
    },
    narrative: {
      type: Type.STRING,
      description: 'A short paragraph (2-4 sentences) tying the three insights into an overall character vibe.',
    },
  },
  required: ['headline', 'expression_insights', 'narrative'],
};
