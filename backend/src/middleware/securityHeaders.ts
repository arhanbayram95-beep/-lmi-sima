import helmet from '@fastify/helmet';
import { FastifyInstance } from 'fastify';

// Baseline response headers (CSP, X-Content-Type-Options, X-Frame-Options,
// etc.) — this API had none before (security review, 2026-08-11). Helmet's
// own defaults are used as-is: the JSON reading endpoint doesn't render
// anything a CSP could affect, and the legal pages (routes/legal.ts) only
// use an inline <style> block, which helmet's default styleSrc already
// allows ('self' https: 'unsafe-inline') — covered by
// tests/unit/legal.test.ts and tests/unit/securityHeaders.test.ts.
//
// MUST be awaited, and awaited before any route is registered on `app` —
// same ordering requirement as registerCors/registerRateLimit (see those
// files' comments).
export async function registerSecurityHeaders(app: FastifyInstance): Promise<void> {
  await app.register(helmet);
}
