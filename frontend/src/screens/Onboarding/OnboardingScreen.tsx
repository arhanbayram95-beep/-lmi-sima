import { useRef, useState } from 'react';
import { View, ScrollView, Pressable, Text, StyleSheet, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientBackground } from '../../components/common/GradientBackground';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { OnboardingSlide, OnboardingSlideData } from './components/OnboardingSlide';
import { PaginationDots } from './components/PaginationDots';
import { Theme } from '../../ui/theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const SLIDES: OnboardingSlideData[] = [
  {
    icon: 'self-improvement',
    title: 'Calm',
    body: 'Start with your baseline expression — relaxed, neutral, unguarded.',
  },
  {
    icon: 'auto-awesome',
    title: 'Bright',
    body: 'Show us your glow. Your brightest, most radiant smile.',
  },
  {
    icon: 'nights-stay',
    title: 'Deep',
    body: 'Now give us your mysterious side — serious, stern, intense.',
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const goToAgeGate = () => navigation.navigate('AgeGate');

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    } else {
      goToAgeGate();
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scroll}
      >
        {SLIDES.map((slide) => (
          <OnboardingSlide key={slide.title} {...slide} />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <PaginationDots count={SLIDES.length} activeIndex={activeIndex} />
        <PrimaryButton
          label={activeIndex === SLIDES.length - 1 ? 'Continue' : 'Next'}
          icon="arrow-forward"
          onPress={handleNext}
          style={styles.nextButton}
        />
        <Pressable onPress={goToAgeGate}>
          <Text style={styles.skipLabel}>Skip Introduction</Text>
        </Pressable>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.xl,
  },
  scroll: {
    flexGrow: 0,
  },
  footer: {
    alignItems: 'center',
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  nextButton: {
    width: '100%',
    maxWidth: 320,
  },
  skipLabel: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: Theme.typography.labelSm.fontSize,
    color: Theme.colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingVertical: Theme.spacing.xs,
  },
});
