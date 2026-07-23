import { AnalyzeReadingPayload, ReadingResult } from './types';

// Canned response for USE_MOCK_API — lets the whole capture -> analyzing ->
// reveal flow be exercised end to end with no backend running and no AI
// provider key configured. Remove alongside the config flag before public
// release.
const MOCK_READING_RESULT: ReadingResult = {
  headline: 'Effortlessly Magnetic',
  expression_insights: [
    { expression: 'calm', insight: 'Grounded and steady — people read you as someone reliable.' },
    { expression: 'bright', insight: 'Your smile is genuinely warm, not performed.' },
    { expression: 'deep', insight: 'A hint of quiet mystery keeps people curious.' },
  ],
  narrative:
    'This is placeholder pseudo-API output for testing, not a real reading — you read as someone people trust instantly, with just enough intrigue to keep things interesting.',
};

const MOCK_LATENCY_MS = 1200;

export async function analyzeReadingMock(_payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return MOCK_READING_RESULT;
}
