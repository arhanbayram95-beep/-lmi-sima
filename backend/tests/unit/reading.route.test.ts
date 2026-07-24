import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { ReadingModelClient } from '../../src/services/geminiClient';

function textResponse(body: unknown) {
  return { text: JSON.stringify(body) };
}

const VALID_BODY = { calm: 'base64-calm', bright: 'base64-bright', deep: 'base64-deep' };

describe('POST /api/v1/reading/analyze', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(() => {
    generateContent = jest.fn();
    const readingModelClient: ReadingModelClient = { models: { generateContent } };
    app = buildApp(readingModelClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 200 with the structured reading on success', async () => {
    generateContent.mockResolvedValue(
      textResponse({ headline: 'Effortlessly Magnetic', expression_insights: [], narrative: 'n' })
    );

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: VALID_BODY });

    expect(response.statusCode).toBe(200);
    expect(response.json().headline).toBe('Effortlessly Magnetic');
  });

  it('returns 400 when a required photo is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/analyze',
      payload: { calm: VALID_BODY.calm, bright: VALID_BODY.bright },
    });

    expect(response.statusCode).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('returns 502 when the Gemini API call fails mid-analysis', async () => {
    generateContent.mockRejectedValue(new Error('network failure'));

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: VALID_BODY });

    expect(response.statusCode).toBe(502);
  });
});
