import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { abilityModifier, CharacterSheet, characterSubtitle, NamedFeature, Story } from '../../api/types';
import { useTranslation } from '../../i18n/useTranslation';
import { Theme } from '../../ui/theme';

// Presentational pieces of a tabletop character sheet, one per reveal page
// (see RevealScreen). Every mode's characters share one CharacterSheet
// shape (api/types.ts), so these render heroes, party members and villains
// alike.

function CardHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.headerBlock}>
      <View style={styles.headerRow}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelBar} />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

function FeatureRow({ feature }: { feature: NamedFeature }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureName}>{feature.name}</Text>
      <Text style={styles.body}>{feature.description}</Text>
    </View>
  );
}

export type PortraitStatus = 'idle' | 'painting' | 'failed';

// Absent entirely when the captured photos are gone (e.g. a reading
// reopened from history): a portrait can only be painted from the photo.
export interface PortraitSlot {
  uri?: string;
  status: PortraitStatus;
  onPaint: () => void;
}

function Portrait({ slot }: { slot: PortraitSlot }) {
  const t = useTranslation();
  if (slot.uri) {
    return <Image source={{ uri: slot.uri }} style={styles.portrait} resizeMode="cover" testID="portrait-image" />;
  }
  const painting = slot.status === 'painting';
  return (
    <Pressable
      onPress={slot.onPaint}
      disabled={painting}
      accessibilityRole="button"
      accessibilityState={{ disabled: painting, busy: painting }}
      style={styles.paintButton}
      testID="paint-portrait-button"
    >
      {painting ? <ActivityIndicator color={Theme.colors.accent.goldSecondary} /> : <Text style={styles.paintIcon}>🎨</Text>}
      <View style={styles.paintText}>
        <Text style={styles.paintLabel}>
          {painting ? t('portrait.painting') : slot.status === 'failed' ? t('portrait.retry') : t('portrait.paint')}
        </Text>
        {slot.status === 'failed' && <Text style={styles.paintError}>{t('portrait.failed')}</Text>}
      </View>
    </Pressable>
  );
}

export function IdentityCard({ sheet, icon = '🛡️', portrait }: { sheet: CharacterSheet; icon?: string; portrait?: PortraitSlot }) {
  const t = useTranslation();
  return (
    <View testID="identity-card">
      {portrait && <Portrait slot={portrait} />}
      <CardHeader icon={icon} title={sheet.name} subtitle={sheet.epithet} />
      <View style={styles.classChip}>
        <Text style={styles.classChipText}>{characterSubtitle(sheet)}</Text>
      </View>
      <View style={styles.vitalsRow}>
        <View style={styles.vital}>
          <Text style={styles.vitalValue}>{sheet.hit_points}</Text>
          <Text style={styles.vitalLabel}>{t('sheet.hitPoints')}</Text>
        </View>
        <View style={styles.vital}>
          <Text style={styles.vitalValue}>{sheet.armor_class}</Text>
          <Text style={styles.vitalLabel}>{t('sheet.armorClass')}</Text>
        </View>
        <View style={styles.vital}>
          <Text style={styles.vitalValue}>{sheet.level}</Text>
          <Text style={styles.vitalLabel}>{t('sheet.level')}</Text>
        </View>
      </View>
      <Text style={styles.battleCry}>“{sheet.battle_cry}”</Text>
      <View style={styles.section}>
        <SectionLabel label={t('sheet.forgedFrom')} />
        {sheet.forged_from.map((note, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletGlyph}>◆</Text>
            <Text style={styles.body}>{note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function AbilityScoresCard({ sheet }: { sheet: CharacterSheet }) {
  const t = useTranslation();
  return (
    <View testID="ability-scores-card">
      <CardHeader icon="🎲" title={t('sheet.abilityScores')} subtitle={sheet.name} />
      <View style={styles.scoreGrid}>
        {sheet.ability_scores.map(({ ability, score }) => (
          <View key={ability} style={styles.scoreCell} testID={`ability-${ability}`}>
            <Text style={styles.scoreAbility}>{ability}</Text>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={styles.scoreModifier}>{abilityModifier(score)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        {sheet.ability_scores.map(({ ability, flair }) => (
          <View key={ability} style={styles.bulletRow}>
            <Text style={styles.flairAbility}>{ability}</Text>
            <Text style={styles.body}>{flair}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function AbilitiesAndGearCard({ sheet }: { sheet: CharacterSheet }) {
  const t = useTranslation();
  return (
    <View testID="abilities-gear-card">
      <CardHeader icon="✨" title={t('sheet.signatureAbilities')} subtitle={sheet.name} />
      <View style={styles.section}>
        {sheet.signature_abilities.map((feature, index) => (
          <FeatureRow key={index} feature={feature} />
        ))}
      </View>
      <View style={styles.section}>
        <SectionLabel label={t('sheet.startingGear')} />
        <View style={styles.pillRow}>
          {sheet.starting_gear.map((item, index) => (
            <View key={index} style={styles.pill}>
              <Text style={styles.pillText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <SectionLabel label={t('sheet.companion')} />
        <FeatureRow feature={{ name: `${sheet.companion.name} · ${sheet.companion.species}`, description: sheet.companion.description }} />
      </View>
    </View>
  );
}

export function BackstoryCard({ sheet }: { sheet: CharacterSheet }) {
  const t = useTranslation();
  const prompts: [string, string][] = [
    [t('sheet.trait'), sheet.personality.trait],
    [t('sheet.ideal'), sheet.personality.ideal],
    [t('sheet.bond'), sheet.personality.bond],
    [t('sheet.quirk'), sheet.personality.quirk],
  ];
  return (
    <View testID="backstory-card">
      <CardHeader icon="📜" title={t('sheet.backstory')} subtitle={sheet.name} />
      <View style={styles.section}>
        {sheet.backstory.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <SectionLabel label={t('sheet.roleplay')} />
        {prompts.map(([label, text]) => (
          <View key={label} style={styles.bulletRow}>
            <Text style={styles.flairAbility}>{label}</Text>
            <Text style={styles.body}>{text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function StoryCard({ icon, story, testID }: { icon: string; story: Story; testID?: string }) {
  return (
    <View testID={testID}>
      <CardHeader icon={icon} title={story.title} />
      <View style={styles.section}>
        {story.paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function FeatureListCard({
  icon,
  title,
  features,
  testID,
}: {
  icon: string;
  title: string;
  features: NamedFeature[];
  testID?: string;
}) {
  return (
    <View testID={testID}>
      <CardHeader icon={icon} title={title} />
      <View style={styles.section}>
        {features.map((feature, index) => (
          <FeatureRow key={index} feature={feature} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  portrait: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Theme.radius.lg,
    marginBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface.glassBackground,
  },
  paintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.45)',
    backgroundColor: 'rgba(235, 201, 131, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: Theme.spacing.sm,
  },
  paintIcon: {
    fontSize: 22,
  },
  paintText: {
    flex: 1,
    gap: 2,
  },
  paintLabel: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.accent.goldSecondary,
  },
  paintError: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    lineHeight: 16,
    color: Theme.colors.status.error,
  },
  headerBlock: {
    marginBottom: Theme.spacing.xs,
    gap: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTitle: {
    ...Theme.typography.headlineMd,
    flex: 1,
    fontSize: 22,
    letterSpacing: -0.2,
    color: Theme.colors.accent.goldSecondary,
    textShadowColor: 'rgba(235, 201, 131, 0.4)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  headerSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
    fontStyle: 'italic',
    color: Theme.colors.text.secondary,
    marginLeft: 38,
  },
  classChip: {
    alignSelf: 'flex-start',
    marginTop: Theme.spacing.xs,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  classChipText: {
    ...Theme.typography.labelSm,
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  vital: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    backgroundColor: Theme.colors.surface.glassBackground,
    paddingVertical: Theme.spacing.xs,
  },
  vitalValue: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.text.primary,
  },
  vitalLabel: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  battleCry: {
    ...Theme.typography.headlineLg,
    fontSize: 19,
    lineHeight: 26,
    color: Theme.colors.text.primary,
    marginTop: Theme.spacing.sm,
  },
  section: {
    marginTop: Theme.spacing.md,
    gap: 8,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  sectionLabelBar: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  sectionLabel: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
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
  body: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    flex: 1,
    color: Theme.colors.text.secondary,
  },
  paragraph: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    lineHeight: 22,
    color: Theme.colors.text.secondary,
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.sm,
  },
  scoreCell: {
    width: '31%',
    flexGrow: 1,
    alignItems: 'center',
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.35)',
    backgroundColor: 'rgba(235, 201, 131, 0.08)',
    paddingVertical: Theme.spacing.xs,
  },
  scoreAbility: {
    ...Theme.typography.labelSm,
    fontWeight: '700',
    color: Theme.colors.accent.goldSecondary,
  },
  scoreValue: {
    ...Theme.typography.headlineLg,
    fontSize: 30,
    color: Theme.colors.text.primary,
  },
  scoreModifier: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.secondary,
  },
  flairAbility: {
    ...Theme.typography.labelSm,
    width: 44,
    fontWeight: '700',
    color: Theme.colors.accent.goldSecondary,
    marginTop: 3,
  },
  featureRow: {
    gap: 2,
  },
  featureName: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.text.primary,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    backgroundColor: Theme.colors.surface.glassBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    ...Theme.typography.labelSm,
    letterSpacing: 0.2,
    color: Theme.colors.text.secondary,
  },
});
