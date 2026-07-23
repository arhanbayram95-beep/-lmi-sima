import { API_BASE_URL } from './config';

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

export class ReadingApiError extends Error {}

// The only place in the app that talks to the backend, per CLAUDE.md's
// frontend/src/api/ boundary. Screens must go through this, never fetch
// directly.
export async function analyzeReading(payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/reading/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (cause) {
    throw new ReadingApiError('Could not reach the FaceAI server. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new ReadingApiError(`FaceAI server returned an error (${response.status}).`);
  }

  return (await response.json()) as ReadingResult;
}
