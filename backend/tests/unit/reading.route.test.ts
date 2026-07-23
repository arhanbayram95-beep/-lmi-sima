import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { AnthropicMessagesClient } from '../../src/services/anthropicClient';
import { SUBMIT_READING_TOOL_NAME } from '../../src/services/readingSchema';

function toolUseResponse(input: unknown) {
  return {
    content: [{ type: 'tool_use', id: 'tool_1', name: SUBMIT_READING_TOOL_NAME, input }],
  };
}

const VALID_BODY = { calm: 'base64-calm', bright: 'base64-bright', deep: 'base64-deep' };

describe('POST /api/v1/reading/analyze', () => {
  let app: FastifyInstance;
  let create: jest.Mock;

  beforeEach(() => {
    create = jest.fn();
    const anthropicClient: AnthropicMessagesClient = { messages: { create } };
    app = buildApp(anthropicClient);
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 200 with the structured reading on success', async () => {
    create.mockResolvedValue(
      toolUseResponse({ headline: 'Effortlessly Magnetic', expression_insights: [], narrative: 'n' })
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
    expect(create).not.toHaveBeenCalled();
  });

  it('returns 502 when the Anthropic API call fails mid-analysis', async () => {
    create.mockRejectedValue(new Error('network failure'));

    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/analyze', payload: VALID_BODY });

    expect(response.statusCode).toBe(502);
  });
});
