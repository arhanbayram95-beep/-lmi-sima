import React, { useEffect, useRef } from 'react';
import { Image, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import DisclaimerFooter from '../components/common/DisclaimerFooter';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import ShareCard from '../components/common/ShareCard';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

export default function RevealScreen() {
  const reading = useAppStore((s) => s.reading);
  const images = useAppStore((s) => s.images);
  const clearImages = useAppStore((s) => s.clearImages);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();
  const shareCardRef = useRef<View>(null);

  // Photos stay in memory (never persisted, per PROJECT_SPEC.md §3) just
  // long enough to render alongside their reading on this screen — purged
  // the moment the user leaves it, however they leave, rather than
  // immediately after the API response the way AnalyzingScreen used to.
  useEffect(() => clearImages, [clearImages]);

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

        {reading.insights.map((item, index) => (
          <FadeInView key={`${item.label}-${index}`} delay={80 + index * 60}>
            <GlassCard style={styles.card}>
              {images[index] && (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${images[index]}` }}
                  style={styles.cardPhoto}
                  resizeMode="cover"
                  testID={`insight-photo-${index}`}
                />
              )}
              <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardGlyph}>✦</Text>
                  <Text style={styles.cardHeading}>{item.label}</Text>
                </View>
                <Text style={styles.cardBody}>{item.insight}</Text>
              </View>
            </GlassCard>
          </FadeInView>
        ))}

        <FadeInView delay={80 + reading.insights.length * 60}>
          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardGlyph}>✦</Text>
                <Text style={styles.cardHeading}>{t('reveal.narrativeHeading')}</Text>
              </View>
              <Text style={styles.cardBody}>{reading.narrative}</Text>
            </View>
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
    padding: 0,
    overflow: 'hidden',
  },
  cardPhoto: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Theme.colors.surface.glassBackground,
  },
  cardContent: {
    padding: Theme.spacing.md,
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
