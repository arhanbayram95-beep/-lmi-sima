import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DisclaimerFooter from '../components/common/DisclaimerFooter';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

export default function RevealScreen() {
  const reading = useAppStore((s) => s.reading);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();

  if (!reading) {
    return (
      <View style={styles.container} testID="reveal-screen">
        <PrimaryButton label={t('reveal.doneButton')} onPress={() => goToScreen('review')} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="reveal-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('reveal.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeInView>
          <GlassCard style={styles.card}>
            <Text style={styles.headline}>{reading.headline}</Text>

            {reading.expression_insights.map((item) => (
              <View key={item.expression} style={styles.insightRow}>
                <Text style={styles.insightExpression}>{item.expression}</Text>
                <Text style={styles.insightText}>{item.insight}</Text>
              </View>
            ))}

            <Text style={styles.narrative}>{reading.narrative}</Text>
          </GlassCard>
        </FadeInView>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={t('reveal.doneButton')} onPress={() => goToScreen('review')} />
        <DisclaimerFooter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.md,
  },
  card: {
    gap: Theme.spacing.sm,
  },
  headline: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.text.primary,
  },
  insightRow: {
    gap: 2,
  },
  insightExpression: {
    ...Theme.typography.labelSm,
    color: Theme.colors.accent.crimsonPrimary,
    textTransform: 'uppercase',
  },
  insightText: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  narrative: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.primary,
    marginTop: Theme.spacing.xs,
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
});
