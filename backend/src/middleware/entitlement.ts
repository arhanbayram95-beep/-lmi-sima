import { FastifyReply, FastifyRequest } from 'fastify';
import { hasActiveEntitlement, RevenueCatClient } from '../services/revenueCatClient';

// Must match frontend/src/utils/purchases.ts's ENTITLEMENT_ID — same
// "keep the string in sync, nothing else needs to change" note applies.
const ENTITLEMENT_ID = 'aura_pro_access';

// The client sends its RevenueCat app_user_id (Purchases.getAppUserID())
// under this header on the analyze request — see frontend/src/api/reading.ts.
const APP_USER_ID_HEADER = 'x-revenuecat-app-user-id';

// Monitor-mode, not enforcement (security review, 2026-08-11): the client
// doesn't send a real app_user_id yet in production (EXPO_PUBLIC_
// REVENUECAT_API_KEY is still unset there — see PROJECT_SPEC.md §6), and
// there's no confirmed real store product a user could purchase to ever
// pass a hard gate. Rejecting requests today would lock everyone out with
// no way back in. Every branch below logs and returns (never blocks) so
// this is safe to ship immediately and gives real signal — via the
// warnings below, watch server logs — for exactly when it's safe to flip
// the two `return;`s below into actual `reply.status(403)` rejections.
//
// revenueCatClient is undefined whenever REVENUECAT_API_KEY isn't set
// (see server.ts) — that's the common case for local dev/CI, and must
// stay a total no-op with no lookups or warnings, not just "monitor mode
// with an unusable client."
export function createEntitlementCheck(revenueCatClient?: RevenueCatClient) {
  return async function requireActiveEntitlement(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    if (!revenueCatClient) return;

    const appUserId = request.headers[APP_USER_ID_HEADER];
    if (typeof appUserId !== 'string' || !appUserId) {
      console.warn(`[entitlement] no ${APP_USER_ID_HEADER} header on the request — client isn't sending one yet.`);
      return;
    }

    try {
      const subscriber = await revenueCatClient.fetchSubscriber(appUserId);
      if (!hasActiveEntitlement(subscriber, ENTITLEMENT_ID)) {
        console.warn(`[entitlement] ${appUserId} has no active "${ENTITLEMENT_ID}" entitlement.`);
      }
    } catch (error) {
      // Never let a RevenueCat outage or bad key take the whole app down
      // while this is still monitor-only.
      console.warn('[entitlement] RevenueCat subscriber lookup failed:', error);
    }
  };
}
