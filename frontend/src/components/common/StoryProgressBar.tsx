import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../../ui/theme';

interface StoryProgressBarProps {
  count: number;
  activeIndex: number;
}

// Instagram/Spotify-Wrapped-style segmented bar — replaces the plain "n /
// total" counter that used to sit here (see IMPLEMENTATION_PLAN.md 9.9,
// which removed it outright; this is a different, more visual way of
// showing the same position that reads as part of the "story" framing
// rather than a raw number).
export default function StoryProgressBar({ count, activeIndex }: StoryProgressBarProps) {
  return (
    <View style={styles.row} testID="story-progress-bar">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.track}>
          <View
            style={[
              styles.fill,
              index < activeIndex && styles.fillPast,
              index === activeIndex && styles.fillActive,
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  track: {
    flex: 1,
    height: 3,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    width: '0%',
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  fillPast: {
    width: '100%',
  },
  fillActive: {
    width: '100%',
    shadowColor: Theme.colors.accent.goldSecondary,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
