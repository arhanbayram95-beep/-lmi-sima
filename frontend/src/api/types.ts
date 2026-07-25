// Mirrors backend/src/services/readingSchema.ts's ReadingModuleId — kept as
// a separate literal union here rather than shared across the frontend/
// backend boundary (no shared package between them, per the project's
// architecture).
export type ReadingModuleId = 'three-expression' | 'relationship-harmony' | 'career-match';

// Character Analysis: 3 (Calm/Bright/Deep, one person). Relationship
// Harmony: 2 (one photo per person). Career Match: 1 (a single photo).
// Mirrors backend/src/services/readingSchema.ts's MODULE_PHOTO_COUNTS.
export const MODULE_PHOTO_COUNTS: Record<ReadingModuleId, number> = {
  'three-expression': 3,
  'relationship-harmony': 2,
  'career-match': 1,
};

// 'label' is free text rather than a fixed enum because its meaning varies
// by module — see backend/src/services/readingSchema.ts for the full
// rationale (this type mirrors that one).
export interface ReadingInsight {
  label: string;
  insight: string;
}

export interface ReadingResult {
  headline: string;
  insights: ReadingInsight[];
  narrative: string;
}

export interface AnalyzeReadingPayload {
  photos: string[];
  module: ReadingModuleId;
}
