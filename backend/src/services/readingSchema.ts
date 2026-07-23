import Anthropic from '@anthropic-ai/sdk';

export type ExpressionLabel = 'calm' | 'bright' | 'deep';

export interface ExpressionInsight {
  expression: ExpressionLabel;
  insight: string;
}

export interface ReadingResult {
  headline: string;
  expression_insights: ExpressionInsight[];
  narrative: string;
}

export const SUBMIT_READING_TOOL_NAME = 'submit_reading';

// Forced via tool_choice in readingService — see PROJECT_SPEC.md §4. The
// Anthropic API has no response_format param; tool use is how we lock the
// model to this shape.
export const submitReadingTool: Anthropic.Tool = {
  name: SUBMIT_READING_TOOL_NAME,
  description: 'Submit the structured character reading generated from the three expression photos.',
  input_schema: {
    type: 'object',
    properties: {
      headline: {
        type: 'string',
        description: 'A short, punchy one-line headline for the reading (roughly 4-8 words).',
      },
      expression_insights: {
        type: 'array',
        description: 'One insight per captured expression, in the order Calm, Bright, Deep.',
        items: {
          type: 'object',
          properties: {
            expression: { type: 'string', enum: ['calm', 'bright', 'deep'] },
            insight: { type: 'string', description: 'A short, warm observation for this expression.' },
          },
          required: ['expression', 'insight'],
        },
      },
      narrative: {
        type: 'string',
        description: 'A short paragraph (2-4 sentences) tying the three insights into an overall character vibe.',
      },
    },
    required: ['headline', 'expression_insights', 'narrative'],
  },
};
