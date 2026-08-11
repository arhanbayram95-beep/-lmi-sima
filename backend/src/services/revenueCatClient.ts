// Narrow interface — the entitlement middleware only ever needs
// fetchSubscriber, so tests can inject a mock without hitting the real
// RevenueCat API (same pattern as ReadingModelClient in geminiClient.ts).
export interface RevenueCatEntitlement {
  expires_date: string | null;
}

export interface RevenueCatSubscriber {
  entitlements: Record<string, RevenueCatEntitlement>;
}

export interface RevenueCatClient {
  fetchSubscriber(appUserId: string): Promise<RevenueCatSubscriber>;
}

// REST reference: https://www.revenuecat.com/docs/api-v1#tag/subscribers
// A GET here auto-vivifies an empty subscriber record for an unknown
// app_user_id rather than 404ing, so "no entitlement" and "unknown user"
// look the same on the wire — both correctly resolve to "not entitled"
// via hasActiveEntitlement below, no special-casing needed.
export function createRevenueCatClient(secretApiKey: string): RevenueCatClient {
  return {
    async fetchSubscriber(appUserId: string): Promise<RevenueCatSubscriber> {
      const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`, {
        headers: { Authorization: `Bearer ${secretApiKey}` },
      });
      if (!response.ok) {
        throw new Error(`RevenueCat subscriber lookup failed with status ${response.status}`);
      }
      const body = (await response.json()) as { subscriber: RevenueCatSubscriber };
      return body.subscriber;
    },
  };
}

// Mirrors what the client SDK's CustomerInfo.entitlements.active computes
// locally (see frontend/src/utils/purchases.ts's hasActiveEntitlement) —
// the REST API returns every entitlement ever granted, active or lapsed,
// so "active" has to be derived from expires_date here same as there.
// null expires_date means non-expiring (e.g. a lifetime/promotional grant).
export function hasActiveEntitlement(subscriber: RevenueCatSubscriber, entitlementId: string): boolean {
  const entitlement = subscriber.entitlements[entitlementId];
  if (!entitlement) return false;
  if (entitlement.expires_date === null) return true;
  return new Date(entitlement.expires_date).getTime() > Date.now();
}
