export type ExpressionLabel = 'calm' | 'bright' | 'deep';

// Mirrors backend/src/services/readingSchema.ts's ReadingModuleId — kept as
// a separate literal union here rather than shared across the frontend/
// backend boundary (no shared package between them, per the project's
// architecture).
export type ReadingModuleId = 'three-expression' | 'relationship-harmony' | 'career-match';

export interface ExpressionInsight {
  expression: ExpressionLabel;
  insight: string;
}

export interface ReadingResult {
  headline: string;
  expression_insights: ExpressionInsight[];
  narrative: string;
}

export interface AnalyzeReadingPayload {
  calm: string;
  bright: string;
  deep: string;
  module: ReadingModuleId;
}
