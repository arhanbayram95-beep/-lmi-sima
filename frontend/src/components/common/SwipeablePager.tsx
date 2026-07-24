import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface SwipeablePagerProps extends PropsWithChildren {
  index: number;
  onIndexChange: (index: number) => void;
  style?: ViewStyle;
}

const SETTLE_GRACE_MS = 400;

// Plain ScrollView + pagingEnabled — no react-native-pager-view dependency
// needed for a simple linear carousel like onboarding.
//
// Tracks the current page via onScroll (continuous, ~60fps) rather than
// onMomentumScrollEnd/onScrollEndDrag alone — those "gesture settled"
// events are not reliably fired for every swipe on every platform/RN
// version, which is what caused the progress dots to silently stop
// tracking the current page in an earlier version of this component.
//
// The other half of "smooth": once a swipe crosses the halfway point
// mid-drag, onIndexChange fires and updates the parent's `index` — but the
// native paging animation is usually still physically settling toward that
// page at that moment. If the repositioning effect below reacted to that
// index change immediately, it would fire a second, JS-driven scrollTo
// racing the native momentum animation to the same destination, which
// reads as a stutter/double-snap. isBeingDragged/isSettling suppress that
// effect for the duration of the gesture and its settle animation, with a
// timer-based grace period as a fallback since momentum events themselves
// aren't 100% reliable either.
export default function SwipeablePager({ index, onIndexChange, children, style }: SwipeablePagerProps) {
  const scrollRef = useRef<ScrollView>(null);
  // Starts at 0, not a Dimensions.get('window').width guess — this pager
  // always renders inside a padded container, so the window width is never
  // actually correct, and using it as a placeholder let an interaction that
  // arrived before the first real onLayout measurement scroll to the wrong
  // target (the reported "Next doesn't shift enough" bug). Nothing scrolls
  // until a real measured width comes in.
  const [pageWidth, setPageWidth] = useState(0);
  const hasPositioned = useRef(false);
  const isBeingDragged = useRef(false);
  const isSettling = useRef(false);
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSettleTimeout = () => {
    if (settleTimeout.current) {
      clearTimeout(settleTimeout.current);
      settleTimeout.current = null;
    }
  };

  useEffect(() => clearSettleTimeout, []);

  useEffect(() => {
    // Don't fight the user's finger, or the native paging animation that
    // follows it — only programmatically reposition for an external index
    // change (e.g. the Next button). Also nothing to position against until
    // a real layout measurement has arrived.
    if (pageWidth === 0 || isBeingDragged.current || isSettling.current) return;
    scrollRef.current?.scrollTo({ x: index * pageWidth, animated: hasPositioned.current });
    hasPositioned.current = true;
  }, [index, pageWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0 && width !== pageWidth) {
      setPageWidth(width);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth === 0) return;
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    if (newIndex !== index) {
      onIndexChange(newIndex);
    }
  };

  const pages = React.Children.toArray(children);

  return (
    <View style={style} onLayout={handleLayout} testID="swipeable-pager">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          isBeingDragged.current = true;
          clearSettleTimeout();
        }}
        onScrollEndDrag={() => {
          isBeingDragged.current = false;
          isSettling.current = true;
          clearSettleTimeout();
          settleTimeout.current = setTimeout(() => {
            isSettling.current = false;
          }, SETTLE_GRACE_MS);
        }}
        onMomentumScrollBegin={() => {
          isSettling.current = true;
          clearSettleTimeout();
          // onMomentumScrollEnd is not guaranteed to fire for every momentum
          // phase on every native platform (a known RN inconsistency,
          // especially for a programmatic scrollTo rather than a user drag
          // release) — without this fallback, a single missed end event
          // leaves isSettling stuck true forever, which permanently blocks
          // the repositioning effect above from ever reacting to a future
          // index change again (e.g. a second press of Next).
          settleTimeout.current = setTimeout(() => {
            isSettling.current = false;
          }, SETTLE_GRACE_MS);
        }}
        onMomentumScrollEnd={() => {
          isSettling.current = false;
          clearSettleTimeout();
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {pages.map((page, i) => (
          <View style={[styles.page, { width: pageWidth }]} key={i}>
            {page}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
  },
});
