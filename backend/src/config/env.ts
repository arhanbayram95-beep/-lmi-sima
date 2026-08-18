// override: true — a stray GEMINI_API_KEY already present in the shell
// environment (a leftover export from some tutorial/dotfile, observed
// on-device 2026-08-15) otherwise silently wins over .env, since dotenv's
// default behavior never overwrites a variable that's already set. .env is
// the authoritative source for local dev secrets in this project, so it
// must always win regardless of what the shell happens to have exported.
import { config } from 'dotenv';
config({ override: true });

export interface AppEnv {
  port: number;
  geminiApiKey: string;
  // Optional second Gemini key (2026-08-18 product decision) — splits
  // reading generation across two keys by module (see server.ts) so the
  // three modules don't share a single free-tier daily quota. Falls back
  // to geminiApiKey everywhere if unset, so a deploy with only the one
  // required key keeps working unchanged.
  geminiApiKeySecondary?: string;
  revenueCatApiKey: string;
}

// Only called when the server actually starts (server.ts), never at import
// time from route/service modules — so unit tests can exercise those with a
// mocked reading model client without needing real secrets in .env.
export function loadEnv(): AppEnv {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not set. Copy backend/.env.example to backend/.env and fill it in.');
  }

  return {
    port: Number(process.env.PORT) || 3000,
    geminiApiKey,
    geminiApiKeySecondary: process.env.GEMINI_API_KEY_SECONDARY || undefined,
    revenueCatApiKey: process.env.REVENUECAT_API_KEY ?? '',
  };
}
