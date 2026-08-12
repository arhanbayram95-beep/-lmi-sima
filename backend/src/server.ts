import { buildApp } from './app';
import { loadEnv } from './config/env';
import { createGeminiClient } from './services/geminiClient';
import { createRevenueCatClient } from './services/revenueCatClient';

async function main(): Promise<void> {
  const env = loadEnv();
  const readingModelClient = createGeminiClient(env.geminiApiKey);
  // Undefined (not an empty-key client) whenever REVENUECAT_API_KEY isn't
  // set — createEntitlementCheck (middleware/entitlement.ts) treats that as
  // "stay a total no-op," not "try to call RevenueCat with an empty key."
  const revenueCatClient = env.revenueCatApiKey ? createRevenueCatClient(env.revenueCatApiKey) : undefined;
  const app = await buildApp(readingModelClient, revenueCatClient);

  // Port 3000, per project convention — the Expo frontend owns 8081.
  await app.listen({ port: env.port, host: '0.0.0.0' });
  console.log(`Face Reader backend listening on port ${env.port}`);
}

main().catch((error) => {
  console.error('Failed to start Face Reader backend:', error);
  process.exit(1);
});
