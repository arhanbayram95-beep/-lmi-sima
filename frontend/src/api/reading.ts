import { API_BASE_URL, USE_MOCK_API } from './config';
import { analyzeReadingMock } from './mockReading';
import { AnalyzeReadingPayload, ReadingResult } from './types';

export type { ReadingInsight, ReadingResult, AnalyzeReadingPayload, ReadingModuleId } from './types';

// 'NO_FACE_DETECTED' is a forward-compatible hook, not yet raised anywhere —
// on-device face detection is deferred (see QA_FINDINGS.md QA-5 and
// IMPLEMENTATION_PLAN.md 2.3). Once real detection lands, either the client
// or the backend can throw this code and AnalyzingScreen will already route
// to NoFaceDetectedScreen for it.
export type ReadingApiErrorCode = 'NO_FACE_DETECTED';

export class ReadingApiError extends Error {
  code?: ReadingApiErrorCode;

  constructor(message: string, code?: ReadingApiErrorCode) {
    super(message);
    this.code = code;
  }
}

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
    throw new ReadingApiError('Could not reach the Face Reader server. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new ReadingApiError(`Face Reader server returned an error (${response.status}).`);
  }

  return (await response.json()) as ReadingResult;
}
