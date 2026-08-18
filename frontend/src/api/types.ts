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

export interface ScoreCard {
  title: string;
  overall_score: number;
  breakdown_metrics: ScoreMetric[];
}

export interface ChecklistItem {
  headline: string;
  description: string;
}

// A display-normalized "headline" shape — no reading card is actually
// shaped like this anymore (see the 2026-08-15 master-card redesign), but
// ResultsScreen's history list wants one consistent shape regardless of
// module, so readingBadgeCard() below synthesizes this from whichever
// module-specific oracle card the reading actually carries.
export interface BadgeCard {
  title: string;
  badge_tag: string;
  summary: string;
}

// Read from jawline/cheekbone/forehead-chin geometry — never an
// attractiveness judgment, just a shape label.
export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Oblong' | 'Triangle';

// Shared across every "deep master card" in every module — see
// MasterCardNarrative in the backend's readingSchema.ts for why this exact
// shape has to be identical everywhere: it's what lets one MasterCard
// renderer component (components/common/MasterCard.tsx) cover all three
// modules' cards.
export interface MasterCardNarrative {
  hero_hook: string;
  anatomical_decoding: string[];
  living_scenario: string[];
  actionable_insight: {
    headline: string;
    description: string;
  };
}

// A dual-sided percentage bar. Both sides are meant to be real, specific
// traits — never a color/gem/palette name (see PROJECT_SPEC.md's
// 2026-08-15 metric-honesty note).
export interface PolarityMeter {
  left_trait: string;
  left_percent: number;
  right_trait: string;
}

export interface AuraProfile {
  name: string;
  intensity_percent: number;
  explanation: string;
}

// A flavor "1 in N" rarity stat — playful, not a real population statistic.
export interface RarityIndex {
  one_in_n: number;
  trait_reason: string;
}

// A short fantastical fable, distinct from living_scenario's grounded
// register — only on each module's Shadow Arcana card.
export interface MythicTale {
  tale_title: string;
  paragraphs: string[];
}

export interface OracleMatchCard extends MasterCardNarrative {
  title: string;
  archetype_tag: string;
  oracle_match_name: string;
  facial_landmark_resonance: {
    percent: number;
    archetype_label: string;
  };
  aura: AuraProfile;
}

export interface SacredAnatomyCard extends MasterCardNarrative {
  title: string;
  shape_tag: FaceShape;
  golden_ratio_score: {
    percent: number;
    explanation: string;
  };
  structural_dominance: {
    brow_percent: number;
    cheekbone_percent: number;
    jaw_percent: number;
  };
}

export interface AnimalTotemCard extends MasterCardNarrative {
  title: string;
  spirit_animal: string;
  instinctual_radar: PolarityMeter[];
}

export interface TraitSymphonyCard extends MasterCardNarrative {
  title: string;
  polarity_meters: PolarityMeter[];
  rarity_index: RarityIndex;
}

export interface ShadowArcanaCard extends MasterCardNarrative {
  title: string;
  signature_catchphrase: string;
  shadow_traits: string[];
  life_advice: string;
  mythic_tale: MythicTale;
}

export interface CharacterAnalysisResult {
  module: 'character_analysis';
  oracle_match_card: OracleMatchCard;
  sacred_anatomy_card: SacredAnatomyCard;
  animal_totem_card: AnimalTotemCard;
  trait_symphony_card: TraitSymphonyCard;
  shadow_arcana_card: ShadowArcanaCard;
}

export interface BondOracleCard extends MasterCardNarrative {
  title: string;
  bond_archetype_tag: string;
  duo_oracle_match: string;
  bond_resonance: {
    percent: number;
    archetype_label: string;
  };
  aura: AuraProfile;
}

export interface ChemistryGeometryCard extends MasterCardNarrative {
  title: string;
  synergy_score: ScoreCard;
}

export interface InstinctualDynamicsCard extends MasterCardNarrative {
  title: string;
  dynamics_radar: PolarityMeter[];
}

export interface BondShadowArcanaCard extends MasterCardNarrative {
  title: string;
  duo_catchphrase: string;
  shadow_traits: string[];
  guidance_checklist: ChecklistItem[];
  mythic_tale: MythicTale;
}

export interface RelationshipHarmonyResult {
  module: 'relationship_harmony';
  bond_oracle_card: BondOracleCard;
  chemistry_geometry_card: ChemistryGeometryCard;
  instinctual_dynamics_card: InstinctualDynamicsCard;
  bond_shadow_arcana_card: BondShadowArcanaCard;
}

export interface CareerOracleCard extends MasterCardNarrative {
  title: string;
  work_archetype_tag: string;
  career_oracle_match: string;
  career_resonance: {
    percent: number;
    archetype_label: string;
  };
  aura: AuraProfile;
}

export interface IndustryGeometryCard extends MasterCardNarrative {
  title: string;
  work_style_radar: PolarityMeter[];
  top_industry_pills: string[];
}

export interface CareerTraitSymphonyCard extends MasterCardNarrative {
  title: string;
  polarity_meters: PolarityMeter[];
  rarity_index: RarityIndex;
}

export interface CareerShadowArcanaCard extends MasterCardNarrative {
  title: string;
  work_catchphrase: string;
  shadow_traits: string[];
  role_recommendations: ChecklistItem[];
  life_advice: string;
  mythic_tale: MythicTale;
}

export interface CareerPathResult {
  module: 'career_path';
  career_oracle_card: CareerOracleCard;
  industry_geometry_card: IndustryGeometryCard;
  career_trait_symphony_card: CareerTraitSymphonyCard;
  career_shadow_arcana_card: CareerShadowArcanaCard;
}

export type ReadingResult = CharacterAnalysisResult | RelationshipHarmonyResult | CareerPathResult;

// Every module leads with an oracle-match-style card; ResultsScreen's
// history list reads a normalized headline from it without caring which
// module produced the reading.
export function readingBadgeCard(reading: ReadingResult): BadgeCard {
  switch (reading.module) {
    case 'character_analysis':
      return {
        title: reading.oracle_match_card.title,
        badge_tag: reading.oracle_match_card.archetype_tag,
        summary: reading.oracle_match_card.hero_hook,
      };
    case 'relationship_harmony':
      return {
        title: reading.bond_oracle_card.title,
        badge_tag: reading.bond_oracle_card.bond_archetype_tag,
        summary: reading.bond_oracle_card.hero_hook,
      };
    case 'career_path':
      return {
        title: reading.career_oracle_card.title,
        badge_tag: reading.career_oracle_card.work_archetype_tag,
        summary: reading.career_oracle_card.hero_hook,
      };
  }
}

// Only relationship_harmony still carries a score card, on its Chemistry
// Geometry master card.
export function readingScoreCard(reading: ReadingResult): ScoreCard | undefined {
  return reading.module === 'relationship_harmony' ? reading.chemistry_geometry_card.synergy_score : undefined;
}

export interface ShareableSection {
  id: string;
  title: string;
  body: string;
}

// The Shadow Arcana card's mythic_tale renders on the reveal screen itself
// (see MasterCard's mythicTale prop) but was never folded into the
// shareable section text — product feedback (2026-08-18): the fable is
// part of "the results" and should travel with the rest of the shadow
// section when shared, not get left off silently. `\n` line breaks render
// fine inside ShareCard's single Text node for a section body (React
// Native Text respects them), so no ShareCard change is needed.
//
// Only an excerpt of the first paragraph, not the full three-paragraph
// fable — flexible layout renders every selected section's full body with
// no truncation at all (unlike story layout's hard numberOfLines caps),
// which is exactly the "capture silently drops content" risk
// MAX_SELECTABLE_SECTIONS was added to prevent in the first place — that
// cap bounds section *count*, not a single section's length. Capping this
// excerpt to roughly the same size as another section's hero_hook keeps
// the shadow-arcana section from being 2-3x longer than its neighbors and
// reopening that risk (2026-08-18: "make sure everything still fits...
// create a quota if needed").
const MYTHIC_TALE_SHARE_EXCERPT_CHARS = 160;

function mythicTaleBody(tale: MythicTale): string {
  const [firstParagraph = ''] = tale.paragraphs;
  const excerpt =
    firstParagraph.length > MYTHIC_TALE_SHARE_EXCERPT_CHARS
      ? `${firstParagraph.slice(0, MYTHIC_TALE_SHARE_EXCERPT_CHARS).trimEnd()}…`
      : firstParagraph;
  return `\n\n${tale.tale_title}\n${excerpt}`;
}

// Every master card a module's reading carries, flattened into a picklist
// for the share card builder (see ShareOptionsModal) — the user chooses
// which of these actually go on their card. Card titles come straight off
// the reading itself (already English-only from the AI response, same as
// everywhere else this app displays them — see RevealScreen), not
// re-translated here. Body text leads with the hero_hook, the same "this
// is the screenshot-able line" field the cards themselves lead with.
export function readingShareableSections(reading: ReadingResult): ShareableSection[] {
  switch (reading.module) {
    case 'character_analysis':
      return [
        {
          id: 'oracle-match',
          title: reading.oracle_match_card.title,
          body: `${reading.oracle_match_card.archetype_tag} — ${reading.oracle_match_card.hero_hook}`,
        },
        {
          id: 'sacred-anatomy',
          title: reading.sacred_anatomy_card.title,
          body: `${reading.sacred_anatomy_card.shape_tag} — ${reading.sacred_anatomy_card.hero_hook}`,
        },
        {
          id: 'animal-totem',
          title: reading.animal_totem_card.title,
          body: `${reading.animal_totem_card.spirit_animal} — ${reading.animal_totem_card.hero_hook}`,
        },
        {
          id: 'trait-symphony',
          title: reading.trait_symphony_card.title,
          body: reading.trait_symphony_card.hero_hook,
        },
        {
          id: 'shadow-arcana',
          title: reading.shadow_arcana_card.title,
          body: `${reading.shadow_arcana_card.signature_catchphrase} — ${reading.shadow_arcana_card.hero_hook}${mythicTaleBody(reading.shadow_arcana_card.mythic_tale)}`,
        },
      ];
    case 'relationship_harmony':
      return [
        {
          id: 'bond-oracle',
          title: reading.bond_oracle_card.title,
          body: `${reading.bond_oracle_card.bond_archetype_tag} — ${reading.bond_oracle_card.hero_hook}`,
        },
        {
          id: 'chemistry-geometry',
          title: reading.chemistry_geometry_card.title,
          body: `Synergy score: ${reading.chemistry_geometry_card.synergy_score.overall_score} — ${reading.chemistry_geometry_card.hero_hook}`,
        },
        {
          id: 'instinctual-dynamics',
          title: reading.instinctual_dynamics_card.title,
          body: reading.instinctual_dynamics_card.hero_hook,
        },
        {
          id: 'bond-shadow-arcana',
          title: reading.bond_shadow_arcana_card.title,
          body: `${reading.bond_shadow_arcana_card.duo_catchphrase} — ${reading.bond_shadow_arcana_card.hero_hook}${mythicTaleBody(reading.bond_shadow_arcana_card.mythic_tale)}`,
        },
      ];
    case 'career_path':
      return [
        {
          id: 'career-oracle',
          title: reading.career_oracle_card.title,
          body: `${reading.career_oracle_card.work_archetype_tag} — ${reading.career_oracle_card.hero_hook}`,
        },
        {
          id: 'industry-geometry',
          title: reading.industry_geometry_card.title,
          body: reading.industry_geometry_card.top_industry_pills.join(', '),
        },
        {
          id: 'career-trait-symphony',
          title: reading.career_trait_symphony_card.title,
          body: reading.career_trait_symphony_card.hero_hook,
        },
        {
          id: 'career-shadow-arcana',
          title: reading.career_shadow_arcana_card.title,
          body: `${reading.career_shadow_arcana_card.work_catchphrase} — ${reading.career_shadow_arcana_card.hero_hook}${mythicTaleBody(reading.career_shadow_arcana_card.mythic_tale)}`,
        },
      ];
  }
}

export interface AnalyzeReadingPayload {
  photos: string[];
  module: ReadingModuleId;
}
