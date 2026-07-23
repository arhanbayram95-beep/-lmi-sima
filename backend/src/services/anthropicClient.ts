import Anthropic from '@anthropic-ai/sdk';

// Narrow interface — readingService only ever needs messages.create, so
// tests can inject a mock without pulling in the real Anthropic SDK.
export interface AnthropicMessagesClient {
  messages: {
    create: Anthropic['messages']['create'];
  };
}

export function createAnthropicClient(apiKey: string): AnthropicMessagesClient {
  return new Anthropic({ apiKey });
}
