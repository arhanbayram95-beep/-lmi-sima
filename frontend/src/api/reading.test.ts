const PAYLOAD = { calm: 'base64-calm', bright: 'base64-bright', deep: 'base64-deep', module: 'three-expression' as const };

describe('analyzeReading (real API mode)', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.EXPO_PUBLIC_USE_MOCK_API;
    global.fetch = jest.fn();
  });

  it('posts to the backend and returns the parsed reading on success', async () => {
    const result = { headline: 'h', expression_insights: [], narrative: 'n' };
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

  it('throws ReadingApiError on a non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 502 });
    const { analyzeReading, ReadingApiError } = require('./reading');
    await expect(analyzeReading(PAYLOAD)).rejects.toBeInstanceOf(ReadingApiError);
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

    expect(result.headline).toBeTruthy();
    expect(result.expression_insights.length).toBeGreaterThan(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns a different canned reading per module', async () => {
    const { analyzeReading } = require('./reading');

    const threeExpression = await analyzeReading({ ...PAYLOAD, module: 'three-expression' });
    const relationship = await analyzeReading({ ...PAYLOAD, module: 'relationship-harmony' });
    const career = await analyzeReading({ ...PAYLOAD, module: 'career-match' });

    const headlines = new Set([threeExpression.headline, relationship.headline, career.headline]);
    expect(headlines.size).toBe(3);
  });
});
