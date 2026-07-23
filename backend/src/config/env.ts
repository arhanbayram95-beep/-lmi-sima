import 'dotenv/config';

export interface AppEnv {
  port: number;
  anthropicApiKey: string;
  revenueCatApiKey: string;
}

// Only called when the server actually starts (server.ts), never at import
// time from route/service modules — so unit tests can exercise those with a
// mocked Anthropic client without needing real secrets in .env.
export function loadEnv(): AppEnv {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set. Copy backend/.env.example to backend/.env and fill it in.');
  }

  return {
    port: Number(process.env.PORT) || 3000,
    anthropicApiKey,
    revenueCatApiKey: process.env.REVENUECAT_API_KEY ?? '',
  };
}
