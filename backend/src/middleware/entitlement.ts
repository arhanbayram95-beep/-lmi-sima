import { FastifyReply, FastifyRequest } from 'fastify';
import { hasActiveEntitlement, RevenueCatClient } from '../services/revenueCatClient';

// Must match frontend/src/utils/purchases.ts's ENTITLEMENT_ID — same
// "keep the string in sync, nothing else needs to change" note applies.
const ENTITLEMENT_ID = 'aura_pro_access';

// The client sends its RevenueCat app_user_id (Purchases.getAppUserID())
// under this header on the analyze request — see frontend/src/api/reading.ts.
const APP_USER_ID_HEADER = 'x-revenuecat-app-user-id';

// A stable machine-readable code, not just the message — AnalyzingScreen.tsx
// keys off this (not the message string) to route straight to the paywall
// instead of showing a generic error screen.
const ENTITLEMENT_REQUIRED_CODE = 'ENTITLEMENT_REQUIRED';

function rejectMissingEntitlement(reply: FastifyReply): void {
  reply.status(403).send({
    error: 'An active subscription is required to generate a reading.',
    code: ENTITLEMENT_REQUIRED_CODE,
  });
}

// Hard gate (2026-08-24 product decision): every reading requires an
// active "aura_pro_access" entitlement — no free tier. This flips what was
// previously monitor-mode (security review, 2026-08-11 — logged but never
// blocked, since no real store product existed yet for anyone to pass the
// gate with). Real RevenueCat products/offering now exist, so the two
// `return;`s that used to just warn now reject with 403 instead.
//
// Fails CLOSED on every uncertain path (missing header, RevenueCat lookup
// failure) — deliberately: this endpoint's only purpose is protecting a
// paid Gemini call from being spent for free, and failing open on a lookup
// error would make "trigger a lookup failure" the obvious bypass. The one
// exception is revenueCatClient itself being undefined (REVENUECAT_API_KEY
// unset, see server.ts) — that stays a total no-op with no lookups, same as
// before, so local dev/CI never needs a live RevenueCat account.
export function createEntitlementCheck(revenueCatClient?: RevenueCatClient) {
  return async function requireActiveEntitlement(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!revenueCatClient) return;

    const appUserId = request.headers[APP_USER_ID_HEADER];
    if (typeof appUserId !== 'string' || !appUserId) {
      rejectMissingEntitlement(reply);
      return;
    }

    let subscriber;
    try {
      subscriber = await revenueCatClient.fetchSubscriber(appUserId);
    } catch (error) {
      console.error('[entitlement] RevenueCat subscriber lookup failed, rejecting:', error);
      rejectMissingEntitlement(reply);
      return;
    }

    if (!hasActiveEntitlement(subscriber, ENTITLEMENT_ID)) {
      rejectMissingEntitlement(reply);
    }
  };
}
