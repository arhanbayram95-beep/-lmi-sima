import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { readingBadgeCard, readingScoreCard, ReadingResult } from '../../api/types';
import { Theme } from '../../ui/theme';
import AppLogo from './AppLogo';

interface ShareCardProps {
  reading: ReadingResult;
}

// Vertical 9:16 story-ready card captured via react-native-view-shot (see
// RevealScreen). Rendered off-screen — never shown directly in the normal
// layout flow, only measured and snapshotted.
const ShareCard = forwardRef<View, ShareCardProps>(({ reading }, ref) => {
  // The badge tag and its summary are the shareable part of any module's
  // reading — the score grid and pills don't survive a 9:16 crop.
  const badge = readingBadgeCard(reading);
  const score = readingScoreCard(reading);

  return (
    <View ref={ref} style={styles.card} collapsable={false}>
      <View style={styles.brand}>
        <AppLogo showWordmark />
      </View>

      <View style={styles.body}>
        <Text style={styles.headline}>{badge.badge_tag}</Text>
        <Text style={styles.score}>{score.overall_score}</Text>
        <Text style={styles.narrative}>{badge.summary}</Text>
      </View>

      <Text style={styles.footer}>For entertainment purposes only · faceai.app</Text>
    </View>
  );
});

ShareCard.displayName = 'ShareCard';
export default ShareCard;

const CARD_WIDTH = 360;
const CARD_HEIGHT = (CARD_WIDTH * 16) / 9;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Theme.colors.background.start,
    padding: Theme.spacing.lg,
    justifyContent: 'space-between',
  },
  brand: {
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  body: {
    gap: Theme.spacing.md,
  },
  headline: {
    ...Theme.typography.headlineLg,
    fontSize: 32,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  score: {
    ...Theme.typography.headlineLg,
    fontSize: 56,
    color: Theme.colors.text.primary,
    textAlign: 'center',
  },
  narrative: {
    ...Theme.typography.bodyLg,
    color: Theme.colors.text.primary,
    textAlign: 'center',
  },
  footer: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
});
