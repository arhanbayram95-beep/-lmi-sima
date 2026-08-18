import { GoogleGenAI } from '@google/genai';
import { READING_MODULE_IDS, ReadingModuleId } from './readingSchema';

// Narrow interface — readingService only ever needs models.generateContent,
// so tests can inject a mock without pulling in the real Gemini SDK.
export interface ReadingModelClient {
  models: {
    generateContent: GoogleGenAI['models']['generateContent'];
  };
}

export function createGeminiClient(apiKey: string): ReadingModelClient {
  return new GoogleGenAI({ apiKey });
}

// The reading route needs an ordered client list per module (see
// server.ts's dual-key failover split — generateReading cycles through
// the list on retry, trying the second key if the first fails), but most
// call sites — every test, and a deploy with only one Gemini key
// configured — just want the same list for all three modules. Builds
// that map from READING_MODULE_IDS rather than a hand-written 3-key
// literal at each call site, so there's one place that can go stale if a
// module is ever added or renamed, not N of them.
export function everyModule(clients: ReadingModelClient[]): Record<ReadingModuleId, ReadingModelClient[]> {
  return Object.fromEntries(READING_MODULE_IDS.map((id) => [id, clients])) as Record<
    ReadingModuleId,
    ReadingModelClient[]
  >;
}
