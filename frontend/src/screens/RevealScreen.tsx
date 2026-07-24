import React, { useRef } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import DisclaimerFooter from '../components/common/DisclaimerFooter';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import ShareCard from '../components/common/ShareCard';
import { useTranslation } from '../i18n/useTranslation';
import { ExpressionLabel } from '../api/types';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

// A handful of distinct, uncrowded cards (one idea each) rather than a
// single card cramming everything in — matches the reference layout's
// icon+heading+content pattern without its density.
const EXPRESSION_GLYPHS: Record<ExpressionLabel, string> = {
  calm: '😌',
  bright: '✨',
  deep: '🌙',
};

export default function RevealScreen() {
  const reading = useAppStore((s) => s.reading);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();
  const shareCardRef = useRef<View>(null);

  const handleShare = async () => {
    if (!shareCardRef.current) return;
    try {
      const uri = await captureRef(shareCardRef, { format: 'png', quality: 0.9 });
      await Share.share({ url: uri });
    } catch {
      // Sharing is a nice-to-have — never block the reveal flow on failure.
    }
  };

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
          <Text style={styles.headline}>{reading.headline}</Text>
        </FadeInView>

        {reading.expression_insights.map((item, index) => (
          <FadeInView key={item.expression} delay={80 + index * 60}>
            <GlassCard style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardGlyph}>{EXPRESSION_GLYPHS[item.expression]}</Text>
                <Text style={styles.cardHeading}>{item.expression}</Text>
              </View>
              <Text style={styles.cardBody}>{item.insight}</Text>
            </GlassCard>
          </FadeInView>
        ))}

        <FadeInView delay={80 + reading.expression_insights.length * 60}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardGlyph}>✦</Text>
              <Text style={styles.cardHeading}>{t('reveal.narrativeHeading')}</Text>
            </View>
            <Text style={styles.cardBody}>{reading.narrative}</Text>
          </GlassCard>
        </FadeInView>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={t('reveal.shareButton')} variant="secondary" onPress={handleShare} testID="share-reading-button" />
        <PrimaryButton label={t('reveal.doneButton')} onPress={() => goToScreen('review')} />
        <DisclaimerFooter />
      </View>

      <View style={styles.offscreen} pointerEvents="none">
        <ShareCard ref={shareCardRef} reading={reading} />
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
    gap: Theme.spacing.sm,
  },
  headline: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  card: {
    gap: Theme.spacing.xs,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardGlyph: {
    fontSize: 22,
  },
  cardHeading: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.accent.goldSecondary,
    textTransform: 'capitalize',
  },
  cardBody: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  offscreen: {
    position: 'absolute',
    top: 0,
    left: -9999,
  },
});
