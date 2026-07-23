import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
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

// Plain ScrollView + pagingEnabled — no react-native-pager-view dependency
// needed for a simple linear carousel like onboarding.
//
// Tracks the current page via onScroll (continuous, ~60fps) rather than
// onMomentumScrollEnd/onScrollEndDrag — those "gesture settled" events are
// not reliably fired for every swipe on every platform/RN version (a
// gentle drag can land on the next page without ever firing a momentum
// event), which is what caused the progress dots to silently stop
// tracking the current page. onScroll has no such gap.
export default function SwipeablePager({ index, onIndexChange, children, style }: SwipeablePagerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [pageWidth, setPageWidth] = useState(() => Dimensions.get('window').width);
  const hasPositioned = useRef(false);
  const isBeingDragged = useRef(false);

  useEffect(() => {
    // Don't fight the user's finger — only programmatically reposition
    // when the index changed for a reason other than an in-progress drag
    // (e.g. the Next button).
    if (isBeingDragged.current) return;
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
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          isBeingDragged.current = true;
        }}
        onScrollEndDrag={() => {
          isBeingDragged.current = false;
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
