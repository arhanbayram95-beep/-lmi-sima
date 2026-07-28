// Mirrors backend/src/services/readingSchema.ts — kept as a separate copy
// here rather than shared across the frontend/backend boundary (no shared
// package between them, per the project's architecture). Any change to the
// backend's response schema has to land here too.
export type ReadingModuleId = 'three-expression' | 'relationship-harmony' | 'career-match';

// Character Analysis: 3 (Rest/Grin/Stern, one person). Relationship
// Harmony: 2 (one photo per person). Career Match: 1 (a single photo).
export const MODULE_PHOTO_COUNTS: Record<ReadingModuleId, number> = {
  'three-expression': 3,
  'relationship-harmony': 2,
  'career-match': 1,
};

// The discriminator the backend stamps on every payload — this is what the
// reveal screen switches on to pick a card stack.
export type ModuleResultKind = 'character_analysis' | 'relationship_harmony' | 'career_path';

// Constrained backend-side to the set below, so a metric always has an icon
// this app can actually draw.
export type MetricIcon =
  | 'eye'
  | 'sparkles'
  | 'flame'
  | 'target'
  | 'heart'
  | 'chat'
  | 'shield'
  | 'zap'
  | 'compass'
  | 'briefcase'
  | 'lightbulb';

export interface ScoreMetric {
  label: string;
  score: number;
  icon: MetricIcon;
}

export interface BadgeCard {
  title: string;
  badge_tag: string;
  summary: string;
}

export interface ScoreCard {
  title: string;
  overall_score: number;
  breakdown_metrics: ScoreMetric[];
}

export interface ChecklistItem {
  headline: string;
  description: string;
}

export interface MetadataBadge {
  key: string;
  value: string;
}

// Read from jawline/cheekbone/forehead-chin geometry — never an
// attractiveness judgment, just a shape label.
export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Oblong' | 'Triangle';

export interface CharacterAnalysisResult {
  module: 'character_analysis';
  archetype_card: BadgeCard;
  facial_structure_card: {
    title: string;
    shape_tag: FaceShape;
    description: string;
  };
  spirit_animal_card: {
    title: string;
    animal: string;
    description: string;
  };
  traits_card: {
    title: string;
    metadata_badges: MetadataBadge[];
    strength_pills: string[];
    growth_pills: string[];
  };
  celebrity_match_card: {
    title: string;
    match_name: string;
    match_description: string;
  };
}

export interface RelationshipHarmonyResult {
  module: 'relationship_harmony';
  vibe_card: BadgeCard;
  chemistry_score_card: ScoreCard;
  dynamics_card: {
    title: string;
    best_chemistry_pills: string[];
    vibes_to_avoid_pills: string[];
  };
  guidance_card: {
    title: string;
    checklist_items: ChecklistItem[];
  };
}

export interface CareerPathResult {
  module: 'career_path';
  work_archetype_card: BadgeCard;
  domains_card: {
    title: string;
    top_industry_pills: string[];
  };
  recommendations_card: {
    title: string;
    checklist_items: ChecklistItem[];
  };
}

export type ReadingResult = CharacterAnalysisResult | RelationshipHarmonyResult | CareerPathResult;

// Every module leads with a badge card; the share card and any "what did I
// get" summary read from it without caring which module produced it.
export function readingBadgeCard(reading: ReadingResult): BadgeCard {
  switch (reading.module) {
    case 'character_analysis':
      return reading.archetype_card;
    case 'relationship_harmony':
      return reading.vibe_card;
    case 'career_path':
      return reading.work_archetype_card;
  }
}

// Only relationship_harmony still carries a score card — character_analysis
// and career_path dropped theirs so the reading opens on a short, punchy
// badge instead of a number (see systemPrompt.ts's top-catchy/bottom-detail
// structure).
export function readingScoreCard(reading: ReadingResult): ScoreCard | undefined {
  return reading.module === 'relationship_harmony' ? reading.chemistry_score_card : undefined;
}

export interface ReadingHighlight {
  label: string;
  value: string;
}

// The single most fun, most shareable fact in a reading, one per module —
// used by the "Fun Fact" share card variant (ShareCard.tsx) to lead with
// something punchier than the badge tag alone.
export function readingHighlight(reading: ReadingResult): ReadingHighlight {
  switch (reading.module) {
    case 'character_analysis':
      return { label: 'Spirit Animal', value: reading.spirit_animal_card.animal };
    case 'relationship_harmony':
      return { label: 'Best Chemistry', value: reading.dynamics_card.best_chemistry_pills[0] };
    case 'career_path':
      return { label: 'Top Industry', value: reading.domains_card.top_industry_pills[0] };
  }
}

export interface AnalyzeReadingPayload {
  photos: string[];
  module: ReadingModuleId;
}
