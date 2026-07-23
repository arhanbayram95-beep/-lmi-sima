import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

export default function ResultsScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();

  return (
    <View style={styles.container} testID="results-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('results.title')}</Text>
      </View>

      <View style={styles.content}>
        <FadeInView style={styles.emptyState}>
          <View style={styles.emblem}>
            <Text style={styles.emblemGlyph}>▤</Text>
          </View>
          <Text style={styles.emptyTitle}>{t('results.emptyTitle')}</Text>
          <Text style={styles.emptyBody}>{t('results.emptyBody')}</Text>
          <PrimaryButton label={t('common.startAnalysis')} onPress={() => goToScreen('analyze')} />
        </FadeInView>
      </View>

      <BottomNavBar active="results" />
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
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.text.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  emptyState: {
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  emblem: {
    width: 88,
    height: 88,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface.glassBackground,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    marginBottom: Theme.spacing.xs,
  },
  emblemGlyph: {
    fontSize: 36,
    color: Theme.colors.text.muted,
  },
  emptyTitle: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.text.primary,
  },
  emptyBody: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
});
