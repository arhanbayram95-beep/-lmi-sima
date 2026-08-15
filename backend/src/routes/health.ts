import { FastifyInstance } from 'fastify';

// Exists for the frontend's pre-warm ping (frontend/src/api/reading.ts's
// warmUpBackend), not for uptime monitoring — Render's free tier spins the
// whole container down after 15 minutes idle and takes up to ~a minute to
// cold-start back up, which was surfacing as 502s during analyze. Fired as
// early as the capture flow starts so real camera-framing time overlaps the
// cold start instead of the user eating all of it at submit time. Rate-limit
// exempt for the same reason the legal pages are: this must never itself be
// the thing blocking a request during a burst.
export function registerHealthRoute(app: FastifyInstance): void {
  app.get('/health', { config: { rateLimit: false } }, async (_request, reply) => {
    reply.status(200).send({ status: 'ok' });
  });
}
