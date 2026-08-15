import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MasterCardNarrative, MythicTale } from '../../api/types';
import { useTranslation } from '../../i18n/useTranslation';
import { Theme } from '../../ui/theme';

// The generic content renderer for every deep master card, across all
// three reading modules — see MasterCardNarrative's own comment in
// api/types.ts for why the shape has to be identical everywhere. Renders
// inside TapToRevealCard once a card is unveiled.
//
// Header is a plain two-child flex row (icon fixed, title flex:1,
// numberOfLines caps runaway length) with nothing absolutely positioned
// over it — the explicit "fix header overlap" ask is solved structurally
// here, not patched: every per-card stat (aura, resonance, polarity
// meters, rarity index) now renders in its own statsSection block below
// the header/hero_hook, never crammed into the header row itself, so
// there is nothing left for a title to collide with.
export default function MasterCard({
  icon,
  title,
  narrative,
  statsSection,
  mythicTale,
  testID,
}: {
  icon: string;
  title: string;
  narrative: MasterCardNarrative;
  statsSection?: React.ReactNode;
  mythicTale?: MythicTale;
  testID?: string;
}) {
  const t = useTranslation();

  return (
    <View testID={testID}>
      <View style={styles.headerRow}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>

      <Text style={styles.heroHook}>{narrative.hero_hook}</Text>

      {statsSection}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('reveal.whatItSays')}</Text>
        {narrative.anatomical_decoding.map((line, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletGlyph}>◆</Text>
            <Text style={styles.bulletText}>{line}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('reveal.livingScenario')}</Text>
        {narrative.living_scenario.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>

      <View style={styles.insightCallout}>
        <Text style={styles.insightHeadline}>{narrative.actionable_insight.headline}</Text>
        <Text style={styles.insightDescription}>{narrative.actionable_insight.description}</Text>
      </View>

      {mythicTale && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{mythicTale.tale_title}</Text>
          {mythicTale.paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Theme.spacing.xs,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTitle: {
    ...Theme.typography.headlineMd,
    flex: 1,
    fontSize: 21,
    letterSpacing: -0.2,
    color: Theme.colors.accent.goldSecondary,
    textShadowColor: 'rgba(235, 201, 131, 0.4)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  heroHook: {
    ...Theme.typography.headlineLg,
    fontSize: 19,
    lineHeight: 26,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  section: {
    marginTop: Theme.spacing.sm,
    gap: 6,
  },
  sectionLabel: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletGlyph: {
    fontSize: 9,
    color: Theme.colors.accent.goldSecondary,
    marginTop: 6,
  },
  bulletText: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    flex: 1,
    color: Theme.colors.text.secondary,
  },
  paragraph: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    lineHeight: 21,
    color: Theme.colors.text.secondary,
  },
  insightCallout: {
    marginTop: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(158, 41, 65, 0.4)',
    backgroundColor: 'rgba(158, 41, 65, 0.12)',
    padding: Theme.spacing.sm,
    gap: 4,
  },
  insightHeadline: {
    ...Theme.typography.headlineMd,
    fontSize: 15,
    color: Theme.colors.accent.goldSecondary,
  },
  insightDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
});
