import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import { useTranslation } from '../i18n/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { AppScreen } from '../state/slices/navigationSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

interface AnalysisModule {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  glyph: string;
  targetScreen: AppScreen;
  available: boolean;
}

// Add future modules here — nothing else needs to change to surface them.
const MODULES: AnalysisModule[] = [
  {
    id: 'three-expression',
    titleKey: 'analyze.module.threeExpression.title',
    descriptionKey: 'analyze.module.threeExpression.description',
    glyph: '◐',
    targetScreen: 'capture',
    available: true,
  },
  {
    id: 'relationship-harmony',
    titleKey: 'analyze.module.relationshipHarmony.title',
    descriptionKey: 'analyze.module.relationshipHarmony.description',
    glyph: '♥',
    targetScreen: 'capture',
    available: false,
  },
  {
    id: 'career-match',
    titleKey: 'analyze.module.careerMatch.title',
    descriptionKey: 'analyze.module.careerMatch.description',
    glyph: '◆',
    targetScreen: 'capture',
    available: false,
  },
];

export default function AnalyzeScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
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
                onPress={() => module.available && goToScreen(module.targetScreen)}
                accessibilityRole="button"
                accessibilityLabel={title}
                accessibilityState={{ disabled: !module.available }}
                testID={`analyze-module-${module.id}`}
              >
                <GlassCard style={[styles.moduleCard, !module.available && styles.moduleCardDisabled]}>
                  <View style={styles.moduleIcon}>
                    <Text style={styles.moduleGlyph}>{module.glyph}</Text>
                  </View>
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
                  {module.available && <Text style={styles.moduleChevron}>›</Text>}
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
    gap: 4,
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
    gap: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    minHeight: 108,
  },
  moduleCardDisabled: {
    opacity: 0.55,
  },
  // Sized to comfortably host a real thumbnail image later — swap the
  // glyph Text for an Image here once module artwork is ready.
  moduleIcon: {
    width: 76,
    height: 76,
    borderRadius: Theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(158, 41, 65, 0.25)',
  },
  moduleGlyph: {
    color: Theme.colors.accent.crimsonPrimary,
    fontSize: 34,
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
    color: Theme.colors.text.primary,
  },
  moduleDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  moduleChevron: {
    color: Theme.colors.text.muted,
    fontSize: 24,
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
