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
export default function SwipeablePager({ index, onIndexChange, children, style }: SwipeablePagerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [pageWidth, setPageWidth] = useState(() => Dimensions.get('window').width);
  const hasPositioned = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: index * pageWidth, animated: hasPositioned.current });
    hasPositioned.current = true;
  }, [index, pageWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0 && width !== pageWidth) {
      setPageWidth(width);
    }
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
        onMomentumScrollEnd={handleMomentumScrollEnd}
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
