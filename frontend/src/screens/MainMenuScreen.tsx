import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

const FEATURE_CARDS: { titleKey: TranslationKey; bodyKey: TranslationKey; glyph: string }[] = [
  { titleKey: 'mainMenu.feature.vibe.title', bodyKey: 'mainMenu.feature.vibe.body', glyph: '◐' },
  { titleKey: 'mainMenu.feature.expression.title', bodyKey: 'mainMenu.feature.expression.body', glyph: '⟡' },
  { titleKey: 'mainMenu.feature.symmetry.title', bodyKey: 'mainMenu.feature.symmetry.body', glyph: '▦' },
  { titleKey: 'mainMenu.feature.dailyLog.title', bodyKey: 'mainMenu.feature.dailyLog.body', glyph: '✦' },
];

export default function MainMenuScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();

  return (
    <View style={styles.container} testID="main-menu-screen">
      <View style={styles.header}>
        <AppLogo />
        <View style={styles.headerRight}>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>{t('mainMenu.proBadge')}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeInView>
          <GlassCard style={styles.heroCard}>
            <Text style={styles.heroTitle}>{t('analyze.module.threeExpression.title')}</Text>
            <Text style={styles.heroBody}>{t('analyze.module.threeExpression.description')}</Text>
            <PrimaryButton label={t('common.startAnalysis')} onPress={() => goToScreen('analyze')} />
          </GlassCard>
        </FadeInView>

        <View style={styles.grid}>
          {FEATURE_CARDS.map((card, index) => (
            <FadeInView key={card.titleKey} delay={100 + index * 80}>
              <GlassCard style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureTitle}>{t(card.titleKey)}</Text>
                  <Text style={styles.featureGlyph}>{card.glyph}</Text>
                </View>
                <Text style={styles.featureBody}>{t(card.bodyKey)}</Text>
              </GlassCard>
            </FadeInView>
          ))}
        </View>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  proBadge: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  proBadgeText: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: 120,
    gap: Theme.spacing.gutter,
  },
  heroCard: {
    gap: Theme.spacing.sm,
  },
  heroTitle: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.text.primary,
  },
  heroBody: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  grid: {
    gap: Theme.spacing.gutter,
  },
  featureCard: {
    gap: Theme.spacing.xs,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featureTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.text.primary,
  },
  featureGlyph: {
    color: Theme.colors.accent.crimsonPrimary,
    fontSize: 20,
  },
  featureBody: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
});
