import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { AuraProfile, ChecklistItem, FaceShape, RarityIndex, ScoreMetric } from '../../api/types';
import { Theme } from '../../ui/theme';
import FaceShapeIcon from './FaceShapeIcon';

// LayoutAnimation needs an explicit opt-in on Android (iOS has it on by
// default) — powers ChecklistRows' accordion expand/collapse below.
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Small, focused stat blocks composed into each module's oracle/geometry/
// symphony cards (see RevealScreen) — grouped in one file since they're
// all the same "flavor metric" family, styled consistently. Every one of
// these renders a real, specific generated explanation alongside its
// number/name — never a bare stat — per PROJECT_SPEC.md's 2026-08-15
// metric-honesty note (the direct fix for "those percentage meters show
// meaningless things like velvet, crimson").

// A prominent name/tag pill — the archetype_tag, oracle_match_name,
// spirit_animal, or similar single-answer field every oracle-family card
// leads with, styled with the same weight the old badge_tag chip carried.
export function NameChip({ label }: { label: string }) {
  return (
    <View style={styles.nameChip} testID="name-chip">
      <Text style={styles.nameChipText}>{label}</Text>
    </View>
  );
}

export function AuraStat({ aura }: { aura: AuraProfile }) {
  return (
    <View style={styles.auraBlock} testID="aura-stat">
      <View style={styles.auraHeader}>
        <Text style={styles.auraName}>✦ {aura.name} Aura</Text>
        <Text style={styles.auraPercent}>{aura.intensity_percent}%</Text>
      </View>
      <Text style={styles.auraExplanation}>{aura.explanation}</Text>
    </View>
  );
}

export function ResonanceStat({ resonance }: { resonance: { percent: number; archetype_label: string } }) {
  return (
    <View style={styles.resonanceBlock} testID="resonance-stat">
      <Text style={styles.resonancePercent}>{resonance.percent}%</Text>
      <Text style={styles.resonanceLabel}>resonance with {resonance.archetype_label}</Text>
    </View>
  );
}

export function RarityStat({ rarity }: { rarity: RarityIndex }) {
  return (
    <View style={styles.rarityBlock} testID="rarity-stat">
      <Text style={styles.rarityValue}>1 in {rarity.one_in_n}</Text>
      <Text style={styles.rarityReason}>{rarity.trait_reason}</Text>
    </View>
  );
}

export function GoldenRatioStat({
  shapeTag,
  score,
}: {
  shapeTag: FaceShape;
  score: { percent: number; explanation: string };
}) {
  return (
    <View style={styles.geometryBlock} testID="golden-ratio-stat">
      <FaceShapeIcon shape={shapeTag} />
      <View style={styles.geometryText}>
        <Text style={styles.geometryShapeTag}>{shapeTag}</Text>
        <Text style={styles.geometryScore}>{score.percent}% proportion score</Text>
        <Text style={styles.geometryExplanation}>{score.explanation}</Text>
      </View>
    </View>
  );
}

function DominanceBar({ label, percent }: { label: string; percent: number }) {
  return (
    <View style={styles.dominanceRow}>
      <Text style={styles.dominanceLabel}>{label}</Text>
      <View style={styles.dominanceTrack}>
        <View style={[styles.dominanceFill, { width: `${Math.max(0, Math.min(100, percent))}%` }]} />
      </View>
      <Text style={styles.dominancePercent}>{percent}%</Text>
    </View>
  );
}

export function StructuralDominanceStat({
  dominance,
}: {
  dominance: { brow_percent: number; cheekbone_percent: number; jaw_percent: number };
}) {
  return (
    <View style={styles.dominanceBlock} testID="structural-dominance-stat">
      <DominanceBar label="Brow" percent={dominance.brow_percent} />
      <DominanceBar label="Cheekbone" percent={dominance.cheekbone_percent} />
      <DominanceBar label="Jaw" percent={dominance.jaw_percent} />
    </View>
  );
}

export function SynergyScoreDial({
  overallScore,
  overallLabel,
  metrics,
}: {
  overallScore: number;
  overallLabel: string;
  metrics: ScoreMetric[];
}) {
  return (
    <View style={styles.dialBlock} testID="synergy-score-dial">
      <View style={styles.dial}>
        <Text style={styles.dialScore}>{overallScore}</Text>
        <Text style={styles.dialCaption}>{overallLabel}</Text>
      </View>
      <View style={styles.dialMetricGrid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.dialMetric}>
            <Text style={styles.dialMetricLabel} numberOfLines={1}>
              {metric.label}
            </Text>
            <Text style={styles.dialMetricScore}>{metric.score}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function IndustryPillsRow({ pills }: { pills: string[] }) {
  return (
    <View style={styles.pillRow} testID="industry-pills">
      {pills.map((pill) => (
        <View key={pill} style={styles.pill}>
          <Text style={styles.pillText}>{pill}</Text>
        </View>
      ))}
    </View>
  );
}

// Muted rather than gold/red — shadow traits and growth edges are never
// framed as warnings or faults (CLAUDE.md, Entertainment Framing), same
// spirit as the pre-redesign pillCaution style.
export function MutedPillsRow({ pills, testID }: { pills: string[]; testID?: string }) {
  return (
    <View style={styles.pillRow} testID={testID}>
      {pills.map((pill) => (
        <View key={pill} style={styles.mutedPill}>
          <Text style={styles.mutedPillText}>{pill}</Text>
        </View>
      ))}
    </View>
  );
}

export function AdviceNote({ text }: { text: string }) {
  return (
    <Text style={styles.adviceNote} testID="advice-note">
      {text}
    </Text>
  );
}

// Accordion, not a flat list — the explicit "interactive accordions /
// expansion pins" ask. Headline stays always visible; the description is
// the payoff for tapping. First item starts open so there's something to
// read with no interaction at all; only one open at a time.
export function ChecklistRows({ items, testID }: { items: ChecklistItem[]; testID?: string }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedIndex((current) => (current === index ? null : index));
  };

  return (
    <View style={styles.checklistBlock} testID={testID}>
      {items.map((item, index) => {
        const expanded = expandedIndex === index;
        return (
          <Pressable
            key={item.headline}
            onPress={() => toggle(index)}
            style={styles.checkItem}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            testID={testID ? `${testID}-item-${index}` : undefined}
          >
            <View style={styles.checkMark}>
              <Text style={styles.checkMarkGlyph}>✓</Text>
            </View>
            <View style={styles.checkBody}>
              <View style={styles.checkHeadlineRow}>
                <Text style={styles.checkHeadline}>{item.headline}</Text>
                <Text style={[styles.checkChevron, expanded && styles.checkChevronExpanded]}>‹</Text>
              </View>
              {expanded && <Text style={styles.checkDescription}>{item.description}</Text>}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const DIAL_SIZE = 108;

const styles = StyleSheet.create({
  nameChip: {
    alignSelf: 'flex-start',
    marginTop: Theme.spacing.xs,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 18,
    paddingVertical: 9,
    shadowColor: Theme.colors.accent.crimsonPrimary,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  nameChipText: {
    ...Theme.typography.headlineLg,
    fontSize: 20,
    letterSpacing: -0.2,
    color: Theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
  auraBlock: {
    marginTop: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.35)',
    backgroundColor: 'rgba(235, 201, 131, 0.1)',
    padding: Theme.spacing.sm,
    gap: 4,
  },
  auraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auraName: {
    ...Theme.typography.headlineMd,
    fontSize: 15,
    color: Theme.colors.accent.goldSecondary,
  },
  auraPercent: {
    ...Theme.typography.labelSm,
    fontSize: 13,
    color: Theme.colors.accent.goldSecondary,
  },
  auraExplanation: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
  resonanceBlock: {
    marginTop: Theme.spacing.sm,
    gap: 2,
  },
  resonancePercent: {
    ...Theme.typography.headlineLg,
    fontSize: 26,
    color: Theme.colors.text.primary,
  },
  resonanceLabel: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.text.muted,
  },
  rarityBlock: {
    marginTop: Theme.spacing.sm,
    gap: 2,
  },
  rarityValue: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.accent.goldSecondary,
  },
  rarityReason: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.text.muted,
  },
  geometryBlock: {
    marginTop: Theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  geometryText: {
    flex: 1,
    gap: 4,
  },
  geometryShapeTag: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  geometryScore: {
    ...Theme.typography.headlineMd,
    fontSize: 15,
    color: Theme.colors.accent.goldSecondary,
  },
  geometryExplanation: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.text.secondary,
  },
  dominanceBlock: {
    marginTop: Theme.spacing.sm,
    gap: 8,
  },
  dominanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dominanceLabel: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    width: 66,
    color: Theme.colors.text.secondary,
  },
  dominanceTrack: {
    flex: 1,
    height: 6,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  dominanceFill: {
    height: '100%',
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  dominancePercent: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    width: 32,
    textAlign: 'right',
    color: Theme.colors.text.muted,
  },
  dialBlock: {
    marginTop: Theme.spacing.sm,
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  dial: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: Theme.radius.full,
    borderWidth: 4,
    borderColor: Theme.colors.accent.goldSecondary,
    backgroundColor: 'rgba(235, 201, 131, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialScore: {
    ...Theme.typography.headlineLg,
    fontSize: 34,
    color: Theme.colors.text.primary,
  },
  dialCaption: {
    ...Theme.typography.labelSm,
    fontSize: 9,
    color: Theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dialMetricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
  },
  dialMetric: {
    alignItems: 'center',
    width: 70,
  },
  dialMetricLabel: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
  },
  dialMetricScore: {
    ...Theme.typography.headlineMd,
    fontSize: 15,
    color: Theme.colors.accent.goldSecondary,
  },
  pillRow: {
    marginTop: Theme.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.35)',
    backgroundColor: 'rgba(235, 201, 131, 0.12)',
  },
  pillText: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.accent.goldSecondary,
  },
  mutedPill: {
    borderRadius: Theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(179, 176, 205, 0.3)',
    backgroundColor: 'rgba(179, 176, 205, 0.1)',
  },
  mutedPillText: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.text.secondary,
  },
  adviceNote: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    marginTop: Theme.spacing.xs,
    color: Theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  checklistBlock: {
    marginTop: Theme.spacing.sm,
  },
  checkItem: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(129, 199, 132, 0.18)',
  },
  checkMarkGlyph: {
    color: Theme.colors.status.success,
    fontSize: 13,
    fontWeight: '700',
  },
  checkBody: {
    flex: 1,
    gap: 4,
  },
  checkHeadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  checkHeadline: {
    ...Theme.typography.headlineMd,
    fontSize: 15,
    flexShrink: 1,
    color: Theme.colors.text.primary,
  },
  checkChevron: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text.muted,
    transform: [{ rotate: '90deg' }],
  },
  checkChevronExpanded: {
    color: Theme.colors.accent.goldSecondary,
    transform: [{ rotate: '-90deg' }],
  },
  checkDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
});
