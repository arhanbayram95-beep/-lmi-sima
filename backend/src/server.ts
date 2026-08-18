import { buildApp } from './app';
import { loadEnv } from './config/env';
import { createGeminiClient, everyModule, ReadingModelClient } from './services/geminiClient';
import { createRevenueCatClient } from './services/revenueCatClient';
import { ReadingModuleId } from './services/readingSchema';

async function main(): Promise<void> {
  const env = loadEnv();
  const primaryClient = createGeminiClient(env.geminiApiKey);
  // Product decision (2026-08-18): two Gemini keys now back every module
  // as a failover pair, not a static one-key-per-module split — a
  // request retries across *both* clients (see generateContentWithRetry
  // in readingService.ts), so an individual reading can still succeed on
  // the second key even when the first is quota-exhausted or mid-outage.
  // "minimize reading fails as much as you can with those two keys": a
  // module-only split doesn't help a request whose one assigned key is
  // having a bad moment, so both keys back every module, just in a
  // different preferred order — character analysis (the app's main
  // flow, highest traffic) tries its own key first so it isn't
  // competing with the other two modules' traffic on the same key by
  // default, while still falling back to it under failure. Falls back to
  // the primary client alone for every module if GEMINI_API_KEY_SECONDARY
  // isn't set, so a single-key deploy (every environment before this)
  // keeps working unchanged.
  const secondaryClient = env.geminiApiKeySecondary ? createGeminiClient(env.geminiApiKeySecondary) : undefined;
  const readingModelClients: Record<ReadingModuleId, ReadingModelClient[]> = secondaryClient
    ? {
        'three-expression': [primaryClient, secondaryClient],
        'relationship-harmony': [secondaryClient, primaryClient],
        'career-match': [secondaryClient, primaryClient],
      }
    : everyModule([primaryClient]);
  // Undefined (not an empty-key client) whenever REVENUECAT_API_KEY isn't
  // set — createEntitlementCheck (middleware/entitlement.ts) treats that as
  // "stay a total no-op," not "try to call RevenueCat with an empty key."
  const revenueCatClient = env.revenueCatApiKey ? createRevenueCatClient(env.revenueCatApiKey) : undefined;
  const app = await buildApp(readingModelClients, revenueCatClient);

  // Port 3000, per project convention — the Expo frontend owns 8081.
  await app.listen({ port: env.port, host: '0.0.0.0' });
  console.log(`Face Reader backend listening on port ${env.port}`);
}

main().catch((error) => {
  console.error('Failed to start Face Reader backend:', error);
  process.exit(1);
});
