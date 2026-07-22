import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

const STAR_COUNT = 5;

export default function ReviewScreen() {
  const [rating, setRating] = useState(0);
  const goToScreen = useAppStore((s) => s.goToScreen);

  return (
    <View style={styles.container} testID="review-screen">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rate Experience</Text>
        <Pressable onPress={() => goToScreen('paywall')} accessibilityRole="button" accessibilityLabel="Close">
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <GlassCard style={styles.card}>
          <View style={styles.emblem}>
            <Text style={styles.emblemGlyph}>✦</Text>
          </View>
          <Text style={styles.headline}>Enjoying your insights with FaceAI?</Text>
          <Text style={styles.body}>
            Your feedback helps us train our AI models and improve your experience.
          </Text>

          <View style={styles.starRow} testID="star-rating">
            {Array.from({ length: STAR_COUNT }).map((_, index) => {
              const filled = index < rating;
              return (
                <Pressable
                  key={index}
                  onPress={() => setRating(index + 1)}
                  accessibilityRole="button"
                  accessibilityLabel={`Rate ${index + 1} stars`}
                >
                  <Text style={[styles.star, filled && styles.starFilled]}>★</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <PrimaryButton label="Rate on App Store" onPress={() => goToScreen('paywall')} />
            <Pressable onPress={() => goToScreen('paywall')} accessibilityRole="button">
              <Text style={styles.maybeLater}>Maybe Later</Text>
            </Pressable>
          </View>
        </GlassCard>
      </View>
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
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  headerTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    color: Theme.colors.accent.goldSecondary,
  },
  closeIcon: {
    color: Theme.colors.accent.goldSecondary,
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  card: {
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  emblem: {
    width: 96,
    height: 96,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface.glassBackground,
    borderWidth: 1,
    borderColor: Theme.colors.accent.goldSecondary,
  },
  emblemGlyph: {
    fontSize: 40,
    color: Theme.colors.accent.goldSecondary,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  body: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  starRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: Theme.spacing.sm,
  },
  star: {
    fontSize: 32,
    color: 'rgba(228, 194, 125, 0.3)',
  },
  starFilled: {
    color: Theme.colors.accent.goldSecondary,
  },
  actions: {
    width: '100%',
    gap: Theme.spacing.xs,
    alignItems: 'center',
  },
  maybeLater: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.secondary,
    paddingTop: Theme.spacing.xs,
  },
});
