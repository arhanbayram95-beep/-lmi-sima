import React from 'react';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
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

// Nanobanana-generated module artwork (see hub_examples/ at the repo root
// for the untouched source renders, and other_app.jpeg for the reference
// look this was matched to) — background-keyed, then composited onto a
// wide canvas with a right-side alpha fade baked in (frontend/assets/
// modules/) so the art bleeds from the card's left edge and dissolves
// straight into the card background, no boxed icon slot or visible edge.
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
        <AppLogo />
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
                  <Image source={module.icon} style={styles.moduleArt} resizeMode="cover" />
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
    minHeight: 124,
    // overflow:hidden clips the bleeding art to the card's own rounded
    // corners, same as the reference — padding is 0 here (not GlassCard's
    // default) because the art needs to reach the card's left edge with
    // nothing inset around it; moduleTextBlock/moduleChevronBadge carry
    // their own padding instead.
    padding: 0,
    overflow: 'hidden',
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
  // Bleeds from the card's left edge and fades to transparent (baked into
  // the asset itself, see frontend/assets/modules/) so it blends straight
  // into the card background with no visible edge, rather than sitting in
  // a separate boxed icon slot.
  moduleArt: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 190,
  },
  moduleTextBlock: {
    flex: 1,
    gap: 4,
    marginLeft: 150,
    paddingVertical: Theme.spacing.md,
    paddingRight: Theme.spacing.xs,
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
    marginRight: Theme.spacing.md,
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
