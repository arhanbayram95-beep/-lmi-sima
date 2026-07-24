import { AnalyzeReadingPayload, ReadingModuleId, ReadingResult } from './types';

// Canned responses for USE_MOCK_API — lets the whole capture -> analyzing ->
// reveal flow be exercised end to end with no backend running and no AI
// provider key configured, one per module so mock mode can actually verify
// each module's content differs. Remove alongside the config flag before
// public release.
const MOCK_READING_RESULTS: Record<ReadingModuleId, ReadingResult> = {
  'three-expression': {
    headline: 'Effortlessly Magnetic',
    expression_insights: [
      { expression: 'calm', insight: 'Grounded and steady — people read you as someone reliable.' },
      { expression: 'bright', insight: 'Your smile is genuinely warm, not performed.' },
      { expression: 'deep', insight: 'A hint of quiet mystery keeps people curious.' },
    ],
    narrative:
      'This is placeholder pseudo-API output for testing, not a real reading — you read as someone people trust instantly, with just enough intrigue to keep things interesting.',
  },
  'relationship-harmony': {
    headline: 'The Steady Spark',
    expression_insights: [
      { expression: 'calm', insight: 'You bring a reassuring, grounded energy to new connections.' },
      { expression: 'bright', insight: 'Your warmth reads as genuine, not performative — people relax around you.' },
      { expression: 'deep', insight: 'A layer of mystery keeps chemistry alive well past the first spark.' },
    ],
    narrative:
      'This is placeholder pseudo-API output for testing, not a real reading — your connection style pairs steady reliability with just enough intrigue to keep things interesting.',
  },
  'career-match': {
    headline: 'The Calm Strategist',
    expression_insights: [
      { expression: 'calm', insight: 'Thrives in steady, detail-oriented environments that reward focus.' },
      { expression: 'bright', insight: 'Natural energy for people-facing, collaborative roles.' },
      { expression: 'deep', insight: 'Drawn to work with room for independent, behind-the-scenes thinking.' },
    ],
    narrative:
      'This is placeholder pseudo-API output for testing, not a real reading — your natural energy suits roles that mix steady focus with real collaboration.',
  },
};

const MOCK_LATENCY_MS = 1200;

export async function analyzeReadingMock(payload: AnalyzeReadingPayload): Promise<ReadingResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return MOCK_READING_RESULTS[payload.module];
}
