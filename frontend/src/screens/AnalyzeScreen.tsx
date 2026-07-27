import React from 'react';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import { ReadingModuleId } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { AppScreen } from '../state/slices/navigationSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

interface AnalysisModule {
  id: ReadingModuleId;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: ImageSourcePropType;
  targetScreen: AppScreen;
  available: boolean;
}

// Module artwork (frontend/assets/modules/) — cropped tight to the
// recognizable subject and feathered to transparent on all sides so it
// sits directly on the card's glass background with no hard edge or boxed
// icon slot, while staying small enough to read clearly at a glance.
// Static requires, not a dynamic map lookup, because Metro needs
// require() calls to be statically analyzable.
const MODULE_ICONS: Record<ReadingModuleId, ImageSourcePropType> = {
  'three-expression': require('../../assets/modules/character-analysis.png'),
  'relationship-harmony': require('../../assets/modules/relationship-harmony.png'),
  'career-match': require('../../assets/modules/career-match.png'),
};

// Add future modules here — nothing else needs to change to surface them.
// Each `id` must have a matching system prompt in
// backend/src/services/systemPrompt.ts (see READING_SYSTEM_PROMPTS).
const MODULES: AnalysisModule[] = [
  {
    id: 'three-expression',
    titleKey: 'analyze.module.threeExpression.title',
    descriptionKey: 'analyze.module.threeExpression.description',
    icon: MODULE_ICONS['three-expression'],
    targetScreen: 'capture',
    available: true,
  },
  {
    id: 'relationship-harmony',
    titleKey: 'analyze.module.relationshipHarmony.title',
    descriptionKey: 'analyze.module.relationshipHarmony.description',
    icon: MODULE_ICONS['relationship-harmony'],
    targetScreen: 'capture',
    available: true,
  },
  {
    id: 'career-match',
    titleKey: 'analyze.module.careerMatch.title',
    descriptionKey: 'analyze.module.careerMatch.description',
    icon: MODULE_ICONS['career-match'],
    targetScreen: 'capture',
    available: true,
  },
];

export default function AnalyzeScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const setSelectedModule = useAppStore((s) => s.setSelectedModule);
  const t = useTranslation();

  return (
    <View style={styles.container} testID="analyze-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('analyze.title')}</Text>
        <Text style={styles.subtitle}>{t('analyze.subtitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {MODULES.map((module, index) => {
          const title = t(module.titleKey);
          return (
            <FadeInView key={module.id} delay={index * 80}>
              <Pressable
                onPress={() => {
                  if (!module.available) return;
                  setSelectedModule(module.id);
                  goToScreen(module.targetScreen);
                }}
                accessibilityRole="button"
                accessibilityLabel={title}
                accessibilityState={{ disabled: !module.available }}
                testID={`analyze-module-${module.id}`}
              >
                <GlassCard style={[styles.moduleCard, !module.available && styles.moduleCardDisabled]}>
                  <Image source={module.icon} style={styles.moduleArt} resizeMode="contain" />
                  <View style={styles.moduleTextBlock}>
                    <View style={styles.moduleTitleRow}>
                      <Text style={styles.moduleTitle}>{title}</Text>
                      {!module.available && (
                        <View style={styles.comingSoonBadge}>
                          <Text style={styles.comingSoonBadgeText}>{t('analyze.comingSoonBadge')}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.moduleDescription}>{t(module.descriptionKey)}</Text>
                  </View>
                  {module.available && (
                    <View style={styles.moduleChevronBadge}>
                      <Text style={styles.moduleChevron}>›</Text>
                    </View>
                  )}
                </GlassCard>
              </Pressable>
            </FadeInView>
          );
        })}

        <FadeInView delay={MODULES.length * 80}>
          <GlassCard style={styles.comingSoonCard}>
            <Text style={styles.comingSoonText}>{t('analyze.comingSoon')}</Text>
          </GlassCard>
        </FadeInView>
      </ScrollView>

      <BottomNavBar active="analyze" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.text.primary,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: 120,
    gap: Theme.spacing.sm,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.sm,
    // Gold glassmorphic border + a slightly richer fill than the base
    // GlassCard default so these hub cards read with more contrast against
    // the Dark Obsidian background, per DESIGN.md's glassmorphic system.
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  moduleCardDisabled: {
    opacity: 0.55,
  },
  // Feathered to transparent on all sides in the asset itself (see
  // frontend/assets/modules/) so it sits on the card's glass background
  // with no hard edge, at a size small enough to actually read at a
  // glance instead of bleeding edge-to-edge.
  moduleArt: {
    width: 88,
    height: 88,
    marginRight: Theme.spacing.sm,
  },
  moduleTextBlock: {
    flex: 1,
    gap: 4,
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moduleTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 19,
    color: Theme.colors.accent.goldSecondary,
  },
  moduleDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  moduleChevronBadge: {
    width: 28,
    height: 28,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(235, 201, 131, 0.15)',
    marginLeft: Theme.spacing.xs,
  },
  moduleChevron: {
    color: Theme.colors.accent.goldSecondary,
    fontSize: 20,
    fontWeight: '700',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(235, 201, 131, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonBadgeText: {
    ...Theme.typography.labelSm,
    fontSize: 9,
    color: Theme.colors.accent.goldSecondary,
  },
  comingSoonCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  comingSoonText: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.muted,
  },
});
