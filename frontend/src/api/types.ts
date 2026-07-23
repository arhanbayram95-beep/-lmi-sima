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

export interface AnalyzeReadingPayload {
  calm: string;
  bright: string;
  deep: string;
}
