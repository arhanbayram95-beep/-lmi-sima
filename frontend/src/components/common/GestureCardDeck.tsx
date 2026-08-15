import * as Haptics from 'expo-haptics';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppStore } from '../../state/useAppStore';
import { Theme } from '../../ui/theme';
import { playSwipeChime } from '../../utils/sound';

interface GestureCardDeckProps extends PropsWithChildren {
  index: number;
  onIndexChange: (index: number) => void;
  style?: ViewStyle;
}

// A third of the page width dragged, or a fast enough flick, commits the
// swipe to the next/previous card — same rough thresholds Stories-style
// UIs use, tuned by feel rather than a formula.
const COMMIT_DISTANCE_RATIO = 0.28;
const COMMIT_VELOCITY = 800;

function DeckPage({
  page,
  pageIndex,
  pageWidth,
  dragX,
  baseX,
}: {
  page: React.ReactNode;
  pageIndex: number;
  pageWidth: number;
  dragX: SharedValue<number>;
  baseX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    if (pageWidth === 0) return { opacity: 0 };
    // Distance of this specific page from wherever the deck has currently
    // settled/dragged to, in "pages" — 0 means centered, 1 means one full
    // page away, etc. Every page recomputes this off the same two shared
    // values, so the whole deck reacts to one gesture as a single system
    // instead of each page owning its own animation.
    const centerX = baseX.value + dragX.value;
    const distance = (pageIndex * pageWidth + centerX) / pageWidth;
    const scale = interpolate(distance, [-1, 0, 1], [0.9, 1, 0.9], Extrapolation.CLAMP);
    const opacity = interpolate(distance, [-1.4, -0.6, 0, 0.6, 1.4], [0, 0.4, 1, 0.4, 0], Extrapolation.CLAMP);
    return {
      transform: [{ translateX: pageIndex * pageWidth + centerX }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.page, { width: pageWidth }, animatedStyle]} pointerEvents="box-none">
      {page}
    </Animated.View>
  );
}

// Replaces the arrow-only nav on RevealScreen with real swipe physics —
// product ask for "fluid swipe deck physics" rather than tap-only paging.
// Deliberately a new component rather than a SwipeablePager rewrite:
// onboarding also depends on SwipeablePager's existing (ScrollView-based,
// no new dependency) behavior, and this needs react-native-reanimated +
// react-native-gesture-handler, which onboarding's simple linear carousel
// doesn't need and shouldn't be forced to pull in.
export default function GestureCardDeck({ index, onIndexChange, children, style }: GestureCardDeckProps) {
  const pages = React.Children.toArray(children);
  const pageCount = pages.length;
  const lastCommittedIndex = useRef(index);

  const [pageWidth, setPageWidth] = useState(0);
  const baseX = useSharedValue(0);
  const dragX = useSharedValue(0);
  const soundEnabled = useAppStore((s) => s.soundEnabled);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0 && width !== pageWidth) {
      setPageWidth(width);
      baseX.value = -index * width;
    }
  };

  // External index changes (the reveal-page-prev/next fallback buttons,
  // or a fresh reading resetting back to page 0) settle the deck to match
  // — guarded against re-triggering on the echo of this component's own
  // gesture-driven onIndexChange call, which would otherwise re-animate a
  // spring that's already exactly where it needs to be.
  useEffect(() => {
    if (pageWidth === 0) return;
    if (index === lastCommittedIndex.current) return;
    lastCommittedIndex.current = index;
    baseX.value = withSpring(-index * pageWidth, { damping: 20, stiffness: 200 });
    // baseX/dragX are stable shared value refs — only index/pageWidth
    // actually vary here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, pageWidth]);

  const commitTo = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(pageCount - 1, nextIndex));
    lastCommittedIndex.current = clamped;
    baseX.value = withSpring(-clamped * pageWidth, { damping: 20, stiffness: 200 });
    if (clamped !== index) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (soundEnabled) playSwipeChime();
      if (clamped === pageCount - 1) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onIndexChange(clamped);
    }
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      dragX.value = event.translationX;
    })
    .onEnd((event) => {
      const projected = event.translationX + event.velocityX * 0.15;
      let target = index;
      if (Math.abs(event.translationX) > pageWidth * COMMIT_DISTANCE_RATIO || Math.abs(event.velocityX) > COMMIT_VELOCITY) {
        target = projected < 0 ? index + 1 : index - 1;
      }
      dragX.value = withSpring(0, { damping: 20, stiffness: 200 });
      runOnJS(commitTo)(target);
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={[styles.container, style]} onLayout={handleLayout} testID="gesture-card-deck">
        {pages.map((page, i) => (
          <DeckPage key={i} page={page} pageIndex={i} pageWidth={pageWidth} dragX={dragX} baseX={baseX} />
        ))}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xs,
  },
});
