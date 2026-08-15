const PAYLOAD = { photos: ['base64-calm', 'base64-bright', 'base64-deep'], module: 'three-expression' as const };

describe('analyzeReading (real API mode)', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.EXPO_PUBLIC_USE_MOCK_API;
    global.fetch = jest.fn();
  });

  it('posts to the backend and returns the parsed reading on success', async () => {
    const result = { headline: 'h', insights: [], narrative: 'n' };
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => result });

    const { analyzeReading } = require('./reading');
    await expect(analyzeReading(PAYLOAD)).resolves.toEqual(result);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/reading/analyze'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('throws ReadingApiError when the network request fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('offline'));
    const { analyzeReading, ReadingApiError } = require('./reading');
    await expect(analyzeReading(PAYLOAD)).rejects.toBeInstanceOf(ReadingApiError);
  });

  it('throws ReadingApiError on a non-ok, non-502 response without retrying', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });
    const { analyzeReading, ReadingApiError } = require('./reading');
    await expect(analyzeReading(PAYLOAD)).rejects.toBeInstanceOf(ReadingApiError);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // 502 gets special-cased retry treatment — it's what Render's free tier
  // returns while a cold-started container is still booting (see
  // warmUpBackend's comment in reading.ts), not a normal failure.
  describe('502 cold-start retry', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('retries with backoff and succeeds once the backend wakes up', async () => {
      jest.useFakeTimers();
      const result = { headline: 'h', insights: [], narrative: 'n' };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, status: 502 })
        .mockResolvedValueOnce({ ok: false, status: 502 })
        .mockResolvedValueOnce({ ok: true, json: async () => result });

      const { analyzeReading } = require('./reading');
      const promise = analyzeReading(PAYLOAD);

      await jest.advanceTimersByTimeAsync(3000);
      await jest.advanceTimersByTimeAsync(6000);

      await expect(promise).resolves.toEqual(result);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('gives up and throws after exhausting retries on a persistent 502', async () => {
      jest.useFakeTimers();
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 502 });

      const { analyzeReading, ReadingApiError } = require('./reading');
      const promise = analyzeReading(PAYLOAD);
      // Attach a rejection handler before advancing timers so Jest never
      // observes an unhandled rejection between the two awaited advances.
      const assertion = expect(promise).rejects.toBeInstanceOf(ReadingApiError);

      await jest.advanceTimersByTimeAsync(3000);
      await jest.advanceTimersByTimeAsync(6000);

      await assertion;
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });
});

describe('warmUpBackend (real API mode)', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.EXPO_PUBLIC_USE_MOCK_API;
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  it('pings the health endpoint without throwing', () => {
    const { warmUpBackend } = require('./reading');
    expect(() => warmUpBackend()).not.toThrow();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/health'));
  });

  it('swallows a rejected fetch instead of an unhandled rejection', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
    const { warmUpBackend } = require('./reading');
    warmUpBackend();
    // Let the swallowed rejection's microtask settle before the test ends.
    await Promise.resolve();
    await Promise.resolve();
  });
});

describe('warmUpBackend (pseudo-API mode)', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_USE_MOCK_API = 'true';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_USE_MOCK_API;
  });

  it('never calls fetch', () => {
    const { warmUpBackend } = require('./reading');
    warmUpBackend();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('analyzeReading (pseudo-API mode)', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_USE_MOCK_API = 'true';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_USE_MOCK_API;
  });

  it('returns a canned reading without ever calling fetch', async () => {
    const { analyzeReading } = require('./reading');
    const result = await analyzeReading(PAYLOAD);

    expect(result.module).toBe('character_analysis');
    expect(result.archetype_card.badge_tag).toBeTruthy();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns a different canned reading per module', async () => {
    const { analyzeReading } = require('./reading');

    const threeExpression = await analyzeReading({ ...PAYLOAD, module: 'three-expression' });
    const relationship = await analyzeReading({ ...PAYLOAD, module: 'relationship-harmony' });
    const career = await analyzeReading({ ...PAYLOAD, module: 'career-match' });

    const kinds = new Set([threeExpression.module, relationship.module, career.module]);
    expect(kinds).toEqual(new Set(['character_analysis', 'relationship_harmony', 'career_path']));
  });
});
