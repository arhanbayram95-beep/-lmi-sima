import { API_BASE_URL, USE_MOCK_API } from './config';
import { analyzeReadingMock } from './mockReading';
import { AnalyzeReadingPayload, ReadingResult } from './types';

export type { ExpressionLabel, ExpressionInsight, ReadingResult, AnalyzeReadingPayload } from './types';

export class ReadingApiError extends Error {}

// The only place in the app that talks to the backend, per CLAUDE.md's
// frontend/src/api/ boundary. Screens must go through this, never fetch
// directly.
export async function analyzeReading(payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  if (USE_MOCK_API) {
    return analyzeReadingMock(payload);
  }

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
