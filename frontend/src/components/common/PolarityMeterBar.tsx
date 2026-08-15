import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../ui/theme';

// Dual-sided percentage bar for a PolarityMeter (see api/types.ts) — both
// sides are meant to be real, specific traits (never a color/gem/palette
// name — see PROJECT_SPEC.md's 2026-08-15 metric-honesty note), so this
// component only handles layout/animation, never invents the labels.
export default function PolarityMeterBar({
  leftTrait,
  leftPercent,
  rightTrait,
  testID,
}: {
  leftTrait: string;
  leftPercent: number;
  rightTrait: string;
  testID?: string;
}) {
  const clampedLeft = Math.max(0, Math.min(100, leftPercent));
  const rightPercent = 100 - clampedLeft;
  // Percentage-width animation can't use the native driver (layout
  // properties are main-thread only), but it's one bar animating once on
  // mount, not a gesture-driven loop — the JS-thread cost is negligible
  // (same tradeoff as ReadingCards.tsx's old MetricBar).
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fill, { toValue: clampedLeft, duration: 700, delay: 150, useNativeDriver: false }).start();
    // Mount-once fill.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.meter} testID={testID}>
      <View style={styles.labelRow}>
        <Text style={styles.leftLabel} numberOfLines={2}>
          {leftTrait}
        </Text>
        <Text style={styles.rightLabel} numberOfLines={2}>
          {rightTrait}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.leftFill,
            { width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>
      <View style={styles.percentRow}>
        <Text style={styles.leftPercent}>{clampedLeft}%</Text>
        <Text style={styles.rightPercent}>{rightPercent}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  meter: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Theme.spacing.xs,
  },
  leftLabel: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    flex: 1,
    color: Theme.colors.accent.goldSecondary,
  },
  rightLabel: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
    color: Theme.colors.text.secondary,
  },
  track: {
    height: 8,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  leftFill: {
    height: '100%',
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftPercent: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
  },
  rightPercent: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
  },
});
