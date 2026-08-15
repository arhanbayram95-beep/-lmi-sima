import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { BadgeCard, ChecklistItem, FaceShape, MetadataBadge, MetricIcon, ScoreCard } from '../../api/types';
import { Theme } from '../../ui/theme';
import FaceShapeIcon from './FaceShapeIcon';
import GlassCard from './GlassCard';
import RarityBadge from './RarityBadge';

// LayoutAnimation needs an explicit opt-in on Android (iOS has it on by
// default) — powers the accordion expand/collapse in ChecklistCard below.
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// The presentational half of a reading. Every module's reveal is assembled
// from these cards (see RevealScreen) — they take already-fetched data as
// props and never touch the store or the API, per CLAUDE.md's components/
// boundary.

// One captured photo, shown large — part of the "brief and catchy" opening
// beat of the reveal. RevealScreen gives each photo its own top-level page
// in the reveal pager rather than nesting a second swiper in here: nesting
// two horizontal SwipeablePagers (this card's own carousel inside the
// reveal's card-by-card pager) risks the exact gesture-ownership fights
// SwipeablePager's own comments describe fixing for a single level of
// paging.
export function PhotoPageCard({ photo, testID }: { photo: string; testID?: string }) {
  return (
    <View style={styles.photoPage} testID={testID}>
      <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photoLarge} resizeMode="cover" />
    </View>
  );
}

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

// Every card leads with a bold icon + title, rather than a small uppercase
// label — the fun, energetic header style the reveal screen is going for
// (see files_for_claude/design_examples), while keeping the app's own
// dark/crimson/gold palette rather than borrowing the reference's light
// theme.
// raritySeed is optional so a caller can opt a card out (none currently
// do) — every card that has one shows the badge, keyed off something
// already unique to that card's content (a badge_tag, a name, a title) so
// it's stable across re-renders of the same reading but differs from card
// to card and reading to reading.
// Two real flex children (title group flex:1, badge flexShrink:0) rather
// than an absolutely-positioned badge over a guessed padding reservation —
// the badge's text length varies (aura names differ in length, percent is
// 1-2 digits), and a fixed padding sized for the *average* case overlapped
// the title whenever a longer badge rendered wider than the reserved gap.
// Flexbox has no such ceiling to guess wrong: the title truncates first if
// the row is ever actually too narrow for both.
function CardHeader({ icon, title, raritySeed }: { icon?: string; title: string; raritySeed?: string }) {
  return (
    <View style={styles.cardHeaderRow}>
      <View style={styles.cardHeaderTitleGroup}>
        {icon && <Text style={styles.cardHeaderIcon}>{icon}</Text>}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>
      {raritySeed && <RarityBadge seed={raritySeed} />}
    </View>
  );
}


// The one card with a hero SVG visual (FaceShapeIcon) instead of a badge
// pill — Facial Structure is the one card whose headline finding really is
// a shape, not a phrase, so it's the one place a real geometric icon (not
// a fabricated per-feature chart — see FaceShapeIcon's own comment) adds
// something a text pill can't.
export function FacialStructureCard({
  title,
  shapeTag,
  description,
  icon,
  testID,
}: {
  title: string;
  shapeTag: FaceShape;
  description: string;
  icon?: string;
  testID?: string;
}) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={title} raritySeed={shapeTag} />
      <FaceShapeIcon shape={shapeTag} />
      <View style={styles.badgeChip}>
        <Text style={styles.badgeChipText}>{shapeTag}</Text>
      </View>
      <Text style={styles.summary}>{description}</Text>
    </GlassCard>
  );
}

export function BadgeSummaryCard({ card, icon, testID }: { card: BadgeCard; icon?: string; testID?: string }) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={card.title} raritySeed={card.badge_tag} />
      <View style={styles.badgeChip}>
        <Text style={styles.badgeChipText}>{card.badge_tag}</Text>
      </View>
      <Text style={styles.summary}>{card.summary}</Text>
    </GlassCard>
  );
}

function MetricBar({ metric }: { metric: ScoreCard['breakdown_metrics'][number] }) {
  // Percentage-width animation can't use the native driver (layout
  // properties are main-thread only), but it's one bar animating once on
  // mount, not a gesture-driven loop — the JS-thread cost is negligible.
  const fill = useRef(new Animated.Value(0)).current;
  const targetPercent = Math.max(0, Math.min(100, metric.score));

  useEffect(() => {
    Animated.timing(fill, { toValue: targetPercent, duration: 700, delay: 150, useNativeDriver: false }).start();
    // Mount-once fill — re-animating on every re-render (e.g. parent state
    // changes elsewhere on the page) would look like the bar keeps resetting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.metric}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricGlyph}>{METRIC_GLYPHS[metric.icon]}</Text>
        <Text style={styles.metricLabel} numberOfLines={1}>
          {metric.label}
        </Text>
        <Text style={styles.metricScore}>{metric.score}</Text>
      </View>
      <View style={styles.metricTrack}>
        <Animated.View
          style={[styles.metricFill, { width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}
        />
      </View>
    </View>
  );
}

export function ReadingScoreCard({
  card,
  overallLabel,
  icon,
  testID,
}: {
  card: ScoreCard;
  overallLabel: string;
  icon?: string;
  testID?: string;
}) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={card.title} raritySeed={card.title} />

      <View style={styles.dial} testID="score-dial">
        <Text style={styles.dialScore}>{card.overall_score}</Text>
        <Text style={styles.dialCaption}>{overallLabel}</Text>
      </View>

      <View style={styles.metricGrid}>
        {card.breakdown_metrics.map((metric) => (
          <MetricBar key={metric.label} metric={metric} />
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

export function PillsCard({
  title,
  icon,
  groups,
  children,
  testID,
}: React.PropsWithChildren<{ title: string; icon?: string; groups: PillGroup[]; testID?: string }>) {
  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={title} raritySeed={title} />
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

// Accordion, not a flat list — product feedback: the reveal screen read as
// too plain, wanted "more details come up when interacted" specifically.
// Headline stays always visible (so the collapsed card still reads as
// substantial, not empty); the description — already the richest writing
// in the reading per systemPrompt.ts's STRUCTURE_GUIDANCE — is the payoff
// for tapping, rather than being dumped all at once. First item starts
// open so there's something to read without any interaction at all; only
// one open at a time, classic accordion, so the list stays scannable
// instead of every item's prose stacking up as one long block again.
export function ChecklistCard({
  title,
  icon,
  items,
  testID,
}: {
  title: string;
  icon?: string;
  items: ChecklistItem[];
  testID?: string;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedIndex((current) => (current === index ? null : index));
  };

  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={title} raritySeed={title} />
      {items.map((item, index) => {
        const expanded = expandedIndex === index;
        return (
          <Pressable
            key={item.headline}
            onPress={() => toggle(index)}
            style={styles.checkItem}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            testID={`${testID}-item-${index}`}
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
    </GlassCard>
  );
}

// Generic "one bold word/name + description" card — used for both the
// Celebrity Archetype Match and the Spirit Animal Match, since they're
// structurally identical (title, a single striking answer, a description).
// The name lands immediately (it's the punchy, exciting part — "Wolf",
// "A Public Figure"), but the description — the richest writing in either
// module's whole reading — is held back as a tap-to-reveal payoff instead
// of dumping both at once, per product feedback wanting more interaction
// on this screen. tapHint is threaded in from RevealScreen (which has
// useTranslation) rather than imported here, matching this component's
// existing presentational-only, no-store-no-i18n-access boundary.
export function HighlightCard({
  title,
  icon,
  name,
  description,
  tapHint,
  testID,
}: {
  title: string;
  icon?: string;
  name: string;
  description: string;
  tapHint: string;
  testID?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const reveal = () => {
    if (revealed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRevealed(true);
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  return (
    <GlassCard style={styles.card} testID={testID}>
      <CardHeader icon={icon} title={title} raritySeed={name} />
      <Pressable
        onPress={reveal}
        disabled={revealed}
        accessibilityRole="button"
        accessibilityState={{ expanded: revealed }}
        testID={testID ? `${testID}-reveal` : undefined}
      >
        <Text style={styles.matchName}>{name}</Text>
        {revealed ? (
          <Animated.Text style={[styles.summary, { opacity: fade }]}>{description}</Animated.Text>
        ) : (
          <Text style={styles.revealHint}>{tapHint}</Text>
        )}
      </Pressable>
    </GlassCard>
  );
}

const DIAL_SIZE = 132;

const styles = StyleSheet.create({
  photoPage: {
    justifyContent: 'center',
  },
  photoLarge: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface.glassBackground,
  },
  card: {
    gap: Theme.spacing.xs,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardHeaderTitleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderIcon: {
    fontSize: 30,
  },
  // Bigger and glowing (product feedback: the reveal screen read as too
  // plain) — was 18/no-shadow, now matches the visual weight the badge
  // punchline and match-name text already carry elsewhere on this screen,
  // so every card opens with the same "loud" energy instead of only the
  // hook card.
  cardTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 22,
    letterSpacing: -0.2,
    color: Theme.colors.accent.goldSecondary,
    textShadowColor: 'rgba(235, 201, 131, 0.45)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  badgeChip: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 18,
    paddingVertical: 9,
    shadowColor: Theme.colors.accent.crimsonPrimary,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  // The reading's punchline — the one line most likely to get screenshotted
  // — so it runs bigger and bolder than a standard headline, with a soft
  // glow rather than a flat fill to read as more alive than the rest of
  // the card stack.
  badgeChipText: {
    ...Theme.typography.headlineLg,
    fontSize: 22,
    letterSpacing: -0.2,
    color: Theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
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
    fontSize: 16,
    flexShrink: 1,
    color: Theme.colors.text.primary,
  },
  // A left-pointing chevron rotated to point down when expanded — one
  // glyph, two states, no extra icon asset needed.
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
  matchName: {
    ...Theme.typography.headlineLg,
    fontSize: 30,
    letterSpacing: -0.4,
    color: Theme.colors.accent.goldSecondary,
    textShadowColor: 'rgba(235, 201, 131, 0.4)',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  revealHint: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.text.muted,
    marginTop: 4,
  },
});
