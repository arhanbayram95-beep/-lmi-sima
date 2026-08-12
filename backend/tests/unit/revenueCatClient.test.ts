import { createRevenueCatClient, hasActiveEntitlement, RevenueCatSubscriber } from '../../src/services/revenueCatClient';

describe('createRevenueCatClient', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetches a subscriber by app_user_id with the secret key as a bearer token', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ subscriber: { entitlements: {} } }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    const client = createRevenueCatClient('sk_test_key');
    const subscriber = await client.fetchSubscriber('user-123');

    expect(subscriber).toEqual({ entitlements: {} });
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.revenuecat.com/v1/subscribers/user-123');
    expect(options.headers.Authorization).toBe('Bearer sk_test_key');
  });

  it('URL-encodes the app_user_id', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ subscriber: { entitlements: {} } }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    await createRevenueCatClient('sk_test_key').fetchSubscriber('user with spaces');

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.revenuecat.com/v1/subscribers/user%20with%20spaces');
  });

  it('throws when RevenueCat responds with a non-2xx status', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 }) as unknown as typeof fetch;

    await expect(createRevenueCatClient('bad_key').fetchSubscriber('user-123')).rejects.toThrow('401');
  });
});

describe('hasActiveEntitlement', () => {
  it('is false when the entitlement is absent entirely', () => {
    const subscriber: RevenueCatSubscriber = { entitlements: {} };
    expect(hasActiveEntitlement(subscriber, 'aura_pro_access')).toBe(false);
  });

  it('is true for a non-expiring (lifetime) grant', () => {
    const subscriber: RevenueCatSubscriber = { entitlements: { aura_pro_access: { expires_date: null } } };
    expect(hasActiveEntitlement(subscriber, 'aura_pro_access')).toBe(true);
  });

  it('is true when the expiration is in the future', () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    const subscriber: RevenueCatSubscriber = { entitlements: { aura_pro_access: { expires_date: future } } };
    expect(hasActiveEntitlement(subscriber, 'aura_pro_access')).toBe(true);
  });

  it('is false once the expiration has passed', () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    const subscriber: RevenueCatSubscriber = { entitlements: { aura_pro_access: { expires_date: past } } };
    expect(hasActiveEntitlement(subscriber, 'aura_pro_access')).toBe(false);
  });
});
