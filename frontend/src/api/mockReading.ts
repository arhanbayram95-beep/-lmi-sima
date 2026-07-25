import { AnalyzeReadingPayload, ReadingModuleId, ReadingResult } from './types';

// Canned responses for USE_MOCK_API — lets the whole capture -> analyzing ->
// reveal flow be exercised end to end with no backend running and no AI
// provider key configured, one per module so mock mode can actually verify
// each module's content differs. Insight counts match MODULE_PHOTO_COUNTS
// (3 for Character Analysis, 2 for Relationship Harmony, 2-3 for Career
// Match) so mock mode exercises the same shape the real API produces.
// Remove alongside the config flag before public release.
const MOCK_READING_RESULTS: Record<ReadingModuleId, ReadingResult> = {
  'three-expression': {
    headline: 'Effortlessly Magnetic',
    insights: [
      { label: 'Calm', insight: 'Grounded and steady — people read you as someone reliable.' },
      { label: 'Bright', insight: 'Your smile is genuinely warm, not performed.' },
      { label: 'Deep', insight: 'A hint of quiet mystery keeps people curious.' },
    ],
    narrative:
      'This is placeholder pseudo-API output for testing, not a real reading — you read as someone people trust instantly, with just enough intrigue to keep things interesting.',
  },
  'relationship-harmony': {
    headline: 'Two Distinct Vibes',
    insights: [
      { label: 'Person One', insight: 'Brings a reassuring, grounded energy to new connections.' },
      { label: 'Person Two', insight: 'Warmth reads as genuine, not performative — people relax around them.' },
    ],
    narrative:
      'This is placeholder pseudo-API output for testing, not a real reading — each connection style read independently, side by side.',
  },
  'career-match': {
    headline: 'The Calm Strategist',
    insights: [
      { label: 'Work Style', insight: 'Thrives in steady, detail-oriented environments that reward focus.' },
      { label: 'Ideal Environment', insight: 'Natural energy for people-facing, collaborative roles.' },
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
