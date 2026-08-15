import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReAnimated, {
  interpolate as reInterpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Theme } from '../../ui/theme';
import { playRevealChime } from '../../utils/sound';

// Ornate frame + veiled "tap to unveil" ritual — the wrapper every deep
// master card renders inside (see RevealScreen and MasterCard). Built on
// the same proven two-phase Reanimated flip as the earlier single-field
// reveal (see IMPLEMENTATION_PLAN.md 10.15/10.18's HighlightCard fix):
// core RN Animated's perspective transform under useNativeDriver was
// unreliable on-device; this is worklet-driven the whole way instead, and
// the duplicate 0.5 breakpoint in the interpolation is what keeps the
// revealed content from rendering mirrored past 90deg (two separate
// 0->90deg / -90->0deg rotations, not one continuous 0->180deg sweep).
export default function TapToRevealCard({
  icon,
  title,
  tapHint,
  children,
  testID,
}: React.PropsWithChildren<{ icon: string; title: string; tapHint: string; testID?: string }>) {
  const [revealed, setRevealed] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const flip = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1, { duration: 1400 }), withTiming(0, { duration: 1400 })), -1);
    // Mount-once infinite pulse for the veiled state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playRevealChime();
    flip.value = withTiming(0.5, { duration: 320 }, (finished) => {
      if (finished) {
        runOnJS(setShowBack)(true);
        flip.value = withTiming(1, { duration: 320 });
      }
    });
  };

  const flipStyle = useAnimatedStyle(() => {
    const deg = reInterpolate(flip.value, [0, 0.5, 0.5, 1], [0, 90, -90, 0]);
    return { transform: [{ perspective: 900 }, { rotateY: `${deg}deg` }] };
  });

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.6 + pulse.value * 0.4,
    transform: [{ scale: 1 + pulse.value * 0.015 }],
  }));

  return (
    <View style={styles.frame} testID={testID}>
      <FrameFiligree />
      <Pressable
        onPress={reveal}
        disabled={revealed}
        accessibilityRole="button"
        accessibilityState={{ expanded: revealed }}
        testID={testID ? `${testID}-reveal` : undefined}
      >
        <ReAnimated.View style={flipStyle}>
          {showBack ? (
            children
          ) : (
            <ReAnimated.View style={[styles.veiled, pulseStyle]}>
              <Text style={styles.veiledIcon}>{icon}</Text>
              <Text style={styles.veiledTitle} numberOfLines={3}>
                {title}
              </Text>
              <Text style={styles.tapHint}>{tapHint}</Text>
            </ReAnimated.View>
          )}
        </ReAnimated.View>
      </Pressable>
    </View>
  );
}

// A double border (thin gold outline + inset crimson hairline) plus four
// small diamond glyphs at the corners — "ornate borders, gold filigree
// accents" using only existing locked theme tokens (Theme.colors.*), never
// a new hex value.
function FrameFiligree() {
  return (
    <>
      <Text style={[styles.filigreeGlyph, styles.filigreeTL]} pointerEvents="none">
        ◆
      </Text>
      <Text style={[styles.filigreeGlyph, styles.filigreeTR]} pointerEvents="none">
        ◆
      </Text>
      <Text style={[styles.filigreeGlyph, styles.filigreeBL]} pointerEvents="none">
        ◆
      </Text>
      <Text style={[styles.filigreeGlyph, styles.filigreeBR]} pointerEvents="none">
        ◆
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  // Dark obsidian/velvet surface via the existing locked background token
  // (Theme.colors.background.start, "Deep Obsidian Crimson") rather than a
  // new hex value — "colors are locked" per theme.ts's own header comment.
  frame: {
    backgroundColor: Theme.colors.background.start,
    borderRadius: Theme.radius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 201, 131, 0.4)',
    padding: Theme.spacing.md,
    minHeight: 420,
    justifyContent: 'center',
  },
  filigreeGlyph: {
    position: 'absolute',
    fontSize: 12,
    color: Theme.colors.accent.goldSecondary,
    opacity: 0.7,
  },
  filigreeTL: { top: 10, left: 12 },
  filigreeTR: { top: 10, right: 12 },
  filigreeBL: { bottom: 10, left: 12 },
  filigreeBR: { bottom: 10, right: 12 },
  veiled: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.lg,
  },
  veiledIcon: {
    fontSize: 44,
  },
  veiledTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    textAlign: 'center',
    color: Theme.colors.accent.goldSecondary,
    textShadowColor: 'rgba(235, 201, 131, 0.45)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  tapHint: {
    ...Theme.typography.labelSm,
    fontSize: 12,
    color: Theme.colors.text.muted,
    marginTop: Theme.spacing.xs,
  },
});
