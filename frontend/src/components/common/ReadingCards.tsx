import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BadgeCard, ChecklistItem, MetadataBadge, MetricIcon, ScoreCard } from '../../api/types';
import { Theme } from '../../ui/theme';
import GlassCard from './GlassCard';

// The presentational half of a reading. Every module's reveal is assembled
// from these four cards (see RevealScreen) — they take already-fetched data
// as props and never touch the store or the API, per CLAUDE.md's
// components/ boundary.

// The backend constrains metric icons to exactly these names so a reading
// can never ask for a glyph that isn't here.
const METRIC_GLYPHS: Record<MetricIcon, string> = {
  eye: '👁',
  sparkles: '✨',
  flame: '🔥',
  target: '🎯',
  heart: '❤️',
  chat: '💬',
  shield: '🛡️',
  zap: '⚡',
  compass: '🧭',
  briefcase: '💼',
  lightbulb: '💡',
};

export function BadgeSummaryCard({ card, testID }: { card: BadgeCard; testID?: string }) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <Text style={styles.cardTitle}>{card.title}</Text>
      <View style={styles.badgeChip}>
        <Text style={styles.badgeChipText}>{card.badge_tag}</Text>
      </View>
      <Text style={styles.summary}>{card.summary}</Text>
    </GlassCard>
  );
}

export function ReadingScoreCard({
  card,
  overallLabel,
  testID,
}: {
  card: ScoreCard;
  overallLabel: string;
  testID?: string;
}) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <Text style={styles.cardTitle}>{card.title}</Text>

      <View style={styles.dial} testID="score-dial">
        <Text style={styles.dialScore}>{card.overall_score}</Text>
        <Text style={styles.dialCaption}>{overallLabel}</Text>
      </View>

      <View style={styles.metricGrid}>
        {card.breakdown_metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricGlyph}>{METRIC_GLYPHS[metric.icon]}</Text>
              <Text style={styles.metricLabel} numberOfLines={1}>
                {metric.label}
              </Text>
              <Text style={styles.metricScore}>{metric.score}</Text>
            </View>
            <View style={styles.metricTrack}>
              {/* Clamped because the bar is a fill percentage, and a score
                  outside 0-100 would render as a bar wider than its track. */}
              <View style={[styles.metricFill, { width: `${Math.max(0, Math.min(100, metric.score))}%` }]} />
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

export interface PillGroup {
  label?: string;
  pills: string[];
  tone?: 'positive' | 'caution';
}

export function PillsCard({ title, groups, children, testID }: React.PropsWithChildren<{ title: string; groups: PillGroup[]; testID?: string }>) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
      {groups.map((group, index) => (
        <View key={group.label ?? index} style={styles.pillGroup}>
          {group.label && <Text style={styles.groupLabel}>{group.label}</Text>}
          <View style={styles.pillRow}>
            {group.pills.map((pill) => (
              <View key={pill} style={[styles.pill, group.tone === 'caution' && styles.pillCaution]}>
                <Text style={[styles.pillText, group.tone === 'caution' && styles.pillTextCaution]}>{pill}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </GlassCard>
  );
}

export function MetadataBadgeRow({ badges }: { badges: MetadataBadge[] }) {
  return (
    <View style={styles.metaRow}>
      {badges.map((badge) => (
        <View key={badge.key} style={styles.metaBadge}>
          <Text style={styles.metaKey}>{badge.key}</Text>
          <Text style={styles.metaValue}>{badge.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function ChecklistCard({ title, items, testID }: { title: string; items: ChecklistItem[]; testID?: string }) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item.headline} style={styles.checkItem}>
          <View style={styles.checkMark}>
            <Text style={styles.checkMarkGlyph}>✓</Text>
          </View>
          <View style={styles.checkBody}>
            <Text style={styles.checkHeadline}>{item.headline}</Text>
            <Text style={styles.checkDescription}>{item.description}</Text>
          </View>
        </View>
      ))}
    </GlassCard>
  );
}

export function CelebrityMatchCard({
  title,
  name,
  description,
  testID,
}: {
  title: string;
  name: string;
  description: string;
  testID?: string;
}) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.matchName}>{name}</Text>
      <Text style={styles.summary}>{description}</Text>
    </GlassCard>
  );
}

const DIAL_SIZE = 132;

const styles = StyleSheet.create({
  card: {
    gap: Theme.spacing.xs,
  },
  cardTitle: {
    ...Theme.typography.labelSm,
    color: Theme.colors.accent.goldSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgeChip: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeChipText: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.text.primary,
  },
  summary: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  // A ring rather than a swept arc: an arc needs react-native-svg, which
  // isn't a dependency (adding one would need PROJECT_SPEC.md updated
  // first). The sub-score bars below carry the proportional reading.
  dial: {
    alignSelf: 'center',
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: Theme.radius.full,
    borderWidth: 4,
    borderColor: Theme.colors.accent.goldSecondary,
    backgroundColor: 'rgba(235, 201, 131, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Theme.spacing.xs,
  },
  dialScore: {
    ...Theme.typography.headlineLg,
    fontSize: 44,
    color: Theme.colors.text.primary,
  },
  dialCaption: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  metric: {
    // Two per row: half the card width, minus half the grid gap.
    width: '48%',
    flexGrow: 1,
    gap: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricGlyph: {
    fontSize: 13,
  },
  metricLabel: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.secondary,
    flex: 1,
  },
  metricScore: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.accent.goldSecondary,
  },
  metricTrack: {
    height: 5,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  pillGroup: {
    gap: 6,
    marginTop: 6,
  },
  groupLabel: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pillRow: {
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
  // Muted rather than red: growth edges and dynamics to steer around are
  // never framed as warnings or faults (CLAUDE.md, Entertainment Framing).
  pillCaution: {
    borderColor: 'rgba(179, 176, 205, 0.3)',
    backgroundColor: 'rgba(179, 176, 205, 0.1)',
  },
  pillTextCaution: {
    color: Theme.colors.text.secondary,
  },
  metaRow: {
    gap: 6,
    marginTop: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  metaKey: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  metaValue: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.primary,
    flexShrink: 1,
    textAlign: 'right',
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
    gap: 2,
  },
  checkHeadline: {
    ...Theme.typography.headlineMd,
    fontSize: 15,
    color: Theme.colors.text.primary,
  },
  checkDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
  matchName: {
    ...Theme.typography.headlineMd,
    fontSize: 22,
    color: Theme.colors.accent.goldSecondary,
  },
});
