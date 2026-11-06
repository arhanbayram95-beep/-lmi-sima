import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import { MODULE_PHOTO_COUNTS, ReadingModuleId } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { AppScreen } from '../state/slices/navigationSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

interface AnalysisModule {
  id: ReadingModuleId;
  icon: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  targetScreen: AppScreen;
  available: boolean;
}

const MODULES: AnalysisModule[] = [
  {
    id: 'hero',
    icon: '🛡️',
    titleKey: 'analyze.module.hero.title',
    descriptionKey: 'analyze.module.hero.description',
    targetScreen: 'capture',
    available: true,
  },
  {
    id: 'party',
    icon: '⚔️',
    titleKey: 'analyze.module.party.title',
    descriptionKey: 'analyze.module.party.description',
    targetScreen: 'capture',
    available: true,
  },
  {
    id: 'nemesis',
    icon: '😈',
    titleKey: 'analyze.module.nemesis.title',
    descriptionKey: 'analyze.module.nemesis.description',
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
                style={!module.available && styles.moduleCardDisabled}
              >
                <GlassCard style={styles.moduleCard}>
                  <Text style={styles.moduleIcon}>{module.icon}</Text>
                  <View style={styles.moduleText}>
                    <Text style={styles.moduleTitle}>{title}</Text>
                    <Text style={styles.moduleDescription}>{t(module.descriptionKey)}</Text>
                    <Text style={styles.modulePhotos}>
                      {t('analyze.photoCount', { n: MODULE_PHOTO_COUNTS[module.id] })}
                    </Text>
                  </View>
                </GlassCard>
                {!module.available && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonBadgeText}>{t('analyze.comingSoonBadge')}</Text>
                  </View>
                )}
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
    // paddingTop stays at spacing.xl — there's no SafeAreaView in this app,
    // so this doubles as the status-bar/notch clearance on every screen,
    // not just visual breathing room.
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.xs,
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
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md,
  },
  moduleIcon: {
    fontSize: 40,
  },
  moduleText: {
    flex: 1,
    gap: 4,
  },
  moduleTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    color: Theme.colors.accent.goldSecondary,
  },
  moduleDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    lineHeight: 20,
    color: Theme.colors.text.secondary,
  },
  modulePhotos: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  moduleCardDisabled: {
    opacity: 0.55,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
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
