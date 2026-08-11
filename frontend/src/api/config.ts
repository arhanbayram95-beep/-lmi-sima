// Backend runs on port 3000 (see backend/.env.example / CLAUDE.md).
// localhost works from a simulator; a physical device needs the dev
// machine's LAN IP — set EXPO_PUBLIC_API_BASE_URL in that case.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

// A shipped (non-dev) build must never talk to the backend in plaintext —
// captured face photos would cross the network unencrypted (flagged by
// security review, 2026-08-11). LAN-IP dev testing over plain HTTP (see
// above) stays allowed since it's only reachable while __DEV__. `isDev`
// takes an explicit param rather than reading __DEV__ itself so this stays
// unit-testable without stubbing a React Native global.
//
// Deliberately NOT called at module load: eas.json has no production
// EXPO_PUBLIC_API_BASE_URL configured yet (store-readiness audit,
// 2026-08-11), so throwing here would crash the entire app before React
// ever mounts, on every launch, with no recoverable UI — worse than the
// plaintext risk it's guarding against. api/reading.ts calls this from
// inside analyzeReading() instead, where a throw is just another
// ReadingApiError-shaped rejection AnalyzingScreen already catches and
// shows a normal error screen for.
export function assertSecureApiBaseUrl(url: string, isDev: boolean = typeof __DEV__ === 'boolean' ? __DEV__ : true): void {
  if (!isDev && !url.startsWith('https://')) {
    throw new Error(
      `API_BASE_URL must use https:// in a production build (got "${url}"). Set EXPO_PUBLIC_API_BASE_URL to an https endpoint before shipping.`
    );
  }
}

// Pseudo-API mode for testing the full capture -> analyzing -> reveal flow
// without a running backend or AI provider key configured — set
// EXPO_PUBLIC_USE_MOCK_API=true in the environment (e.g. `eas build` env,
// or `EXPO_PUBLIC_USE_MOCK_API=true npx expo start`). Defaults to off, so
// production builds always hit the real backend unless this is set
// explicitly. Remove before public release.
export const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';
