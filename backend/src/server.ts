import { buildApp } from './app';
import { loadEnv } from './config/env';
import { createAnthropicClient } from './services/anthropicClient';

async function main(): Promise<void> {
  const env = loadEnv();
  const anthropicClient = createAnthropicClient(env.anthropicApiKey);
  const app = buildApp(anthropicClient);

  // Port 3000, per project convention — the Expo frontend owns 8081.
  await app.listen({ port: env.port, host: '0.0.0.0' });
  console.log(`FaceAI backend listening on port ${env.port}`);
}

main().catch((error) => {
  console.error('Failed to start FaceAI backend:', error);
  process.exit(1);
});
