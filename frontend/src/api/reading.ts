import { API_BASE_URL, assertSecureApiBaseUrl, USE_MOCK_API } from './config';
import { analyzeReadingMock } from './mockReading';
import { AnalyzeReadingPayload, ReadingResult } from './types';
import { getCurrentAppUserId } from '../utils/purchases';

export type {
  AnalyzeReadingPayload,
  CareerPathResult,
  CharacterAnalysisResult,
  ReadingModuleId,
  ReadingResult,
  RelationshipHarmonyResult,
} from './types';

// 'NO_FACE_DETECTED' is a forward-compatible hook that nothing raises yet.
// On-device detection shipped in IMPLEMENTATION_PLAN.md 6.1, but it rejects
// a faceless frame at the shutter in CaptureScreen — before any API call —
// so it never travels as an error code. This stays wired for the case where
// the backend starts reporting it: AnalyzingScreen already routes it to
// NoFaceDetectedScreen.
export type ReadingApiErrorCode = 'NO_FACE_DETECTED';

export class ReadingApiError extends Error {
  code?: ReadingApiErrorCode;

  constructor(message: string, code?: ReadingApiErrorCode) {
    super(message);
    this.code = code;
  }
}

// Render's free tier (see PROJECT_SPEC.md §3 "Backend hosting") spins the
// whole container down after 15 minutes idle and takes up to ~a minute to
// cold-start back up — the proxy returns 502 for requests that land during
// that window, not a normal error. A 502 here specifically gets retried
// with backoff; anything else (4xx, 5xx-not-502, network failure) fails
// immediately since retrying wouldn't help. Paired with warmUpBackend()
// firing as early as capture starts, which usually means the cold start is
// already over by the time this call lands and these retries are moot.
const MAX_ANALYZE_ATTEMPTS = 3;
const ANALYZE_RETRY_DELAYS_MS = [3000, 6000];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Best-effort pre-warm, not a health check the caller needs to await —
// fire during CaptureScreen's mount so the time a user spends framing and
// retaking shots overlaps a Render cold start instead of the user hitting
// it cold at analyze time. Silently no-ops in mock mode (no real backend to
// warm) and swallows every failure, including an insecure API_BASE_URL:
// analyzeReading's own checks are what surface a real problem to the user,
// this is purely a head start.
export function warmUpBackend(): void {
  if (USE_MOCK_API) {
    return;
  }
  try {
    assertSecureApiBaseUrl(API_BASE_URL);
  } catch {
    return;
  }
  fetch(`${API_BASE_URL}/health`).catch(() => {});
}

// The only place in the app that talks to the backend, per CLAUDE.md's
// frontend/src/api/ boundary. Screens must go through this, never fetch
// directly.
export async function analyzeReading(payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  if (USE_MOCK_API) {
    return analyzeReadingMock(payload);
  }

  // Thrown here, not at config.ts's module load — see that comment for why
  // a bad URL needs to surface as a normal catchable rejection instead of
  // crashing the app at launch.
  assertSecureApiBaseUrl(API_BASE_URL);

  // Backend-side monitor-mode entitlement check (see backend/src/middleware/
  // entitlement.ts) — omitted entirely, not sent empty, whenever RevenueCat
  // isn't configured client-side yet, which is every environment as of this
  // writing (PROJECT_SPEC.md §6).
  const appUserId = await getCurrentAppUserId();

  let response: Response;
  for (let attempt = 1; ; attempt++) {
    try {
      response = await fetch(`${API_BASE_URL}/api/v1/reading/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(appUserId ? { 'X-RevenueCat-App-User-Id': appUserId } : {}),
        },
        body: JSON.stringify(payload),
      });
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : String(cause);
      throw new ReadingApiError(
        `Could not reach the Face Reader server. Check your connection and try again. (${detail})`
      );
    }

    if (response.status === 502 && attempt < MAX_ANALYZE_ATTEMPTS) {
      await delay(ANALYZE_RETRY_DELAYS_MS[attempt - 1]);
      continue;
    }
    break;
  }

  if (!response.ok) {
    throw new ReadingApiError(`Face Reader server returned an error (${response.status}).`);
  }

  return (await response.json()) as ReadingResult;
}
