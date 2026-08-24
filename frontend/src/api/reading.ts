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
//
// 'ENTITLEMENT_REQUIRED' is live: the backend hard-gates every reading
// behind an active subscription (backend/src/middleware/entitlement.ts,
// 2026-08-24 product decision — no free tier). AnalyzingScreen routes this
// straight to the paywall instead of showing a generic error.
export type ReadingApiErrorCode = 'NO_FACE_DETECTED' | 'ENTITLEMENT_REQUIRED';

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
// with backoff; a non-502 HTTP response (4xx, 5xx-not-502) fails
// immediately since retrying wouldn't help. Paired with warmUpBackend()
// firing as early as capture starts, which usually means the cold start is
// already over by the time this call lands and these retries are moot.
//
// 2026-08-18: a raw network-level failure (the fetch() call itself
// rejecting, not a bad HTTP response) used to skip retry entirely and
// throw immediately — real device report: "the network connection is
// lost" (iOS's NSURLErrorNetworkConnectionLost, surfaced through Expo's
// native bridge as an ExpoModulesCore Promise rejection), which a genuine
// analyze request is newly exposed to now that a single reading can take
// up to ~50s worst case (see backend readingService.ts's dual-key
// failover, 10.24) — a long enough window for a phone lock/background or
// a brief network handoff to drop the connection mid-request. That's
// exactly the kind of transient condition worth one more try, not a hard
// failure, so it now retries on the same schedule as a 502.
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

  // Backend-side hard entitlement gate (see backend/src/middleware/
  // entitlement.ts) — every reading requires this header to resolve to an
  // active "aura_pro_access" subscription. Omitted entirely, not sent
  // empty, whenever RevenueCat isn't configured client-side (e.g. local
  // dev without a key) — a missing header fails the same way an
  // unentitled one does, not specially.
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
      if (attempt < MAX_ANALYZE_ATTEMPTS) {
        await delay(ANALYZE_RETRY_DELAYS_MS[attempt - 1]);
        continue;
      }
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
    // A 403 here always carries a { code: 'ENTITLEMENT_REQUIRED' } body
    // (entitlement.ts's rejectMissingEntitlement) — parsed defensively
    // since this branch also has to handle a body-less/plain-text error
    // from something other than the entitlement gate.
    if (response.status === 403) {
      const body = await response.json().catch(() => null);
      if (body?.code === 'ENTITLEMENT_REQUIRED') {
        throw new ReadingApiError(
          typeof body.error === 'string' ? body.error : 'An active subscription is required to generate a reading.',
          'ENTITLEMENT_REQUIRED'
        );
      }
    }
    throw new ReadingApiError(`Face Reader server returned an error (${response.status}).`);
  }

  return (await response.json()) as ReadingResult;
}
