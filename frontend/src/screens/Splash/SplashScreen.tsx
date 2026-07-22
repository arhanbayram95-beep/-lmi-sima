import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFonts, Manrope_700Bold, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { HankenGrotesk_400Regular, HankenGrotesk_500Medium } from '@expo-google-fonts/hanken-grotesk';
import { Geist_500Medium } from '@expo-google-fonts/geist';
import { GradientBackground } from '../../components/common/GradientBackground';
import { AppLogo } from '../../components/common/AppLogo';
import { Theme } from '../../ui/theme';
import { useConsentStore } from '../../store/useConsentStore';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const STATUS_MESSAGES = ['Calibrating neural lens…', 'Mapping expression vectors…', 'Almost there…'];

export function SplashScreen({ navigation }: Props) {
  const [fontsLoaded] = useFonts({
    Manrope_700Bold,
    Manrope_600SemiBold,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    Geist_500Medium,
  });
  const hasHydrated = useConsentStore((state) => state.hasHydrated);
  const hasCompletedOnboarding = useConsentStore((state) => state.hasCompletedOnboarding);
  const [statusIndex, setStatusIndex] = useState(0);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    );
    loop.start();
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 1400);
    return () => {
      loop.stop();
      clearInterval(interval);
    };
  }, [shimmerAnim]);

  useEffect(() => {
    if (!fontsLoaded || !hasHydrated) {
      return;
    }
    const timeout = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: hasCompletedOnboarding ? 'MainHub' : 'Onboarding' }],
      });
    }, 1600);
    return () => clearTimeout(timeout);
  }, [fontsLoaded, hasHydrated, hasCompletedOnboarding, navigation]);

  const shimmerWidth = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: ['20%', '80%'] });

  return (
    <GradientBackground style={styles.container}>
      <AppLogo size="lg" variant="full" />
      <View style={styles.shimmerTrack}>
        <Animated.View style={[styles.shimmerFill, { width: shimmerWidth }]} />
      </View>
      <Text style={styles.statusText}>{STATUS_MESSAGES[statusIndex]}</Text>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.md,
  },
  shimmerTrack: {
    width: 160,
    height: 4,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  shimmerFill: {
    height: '100%',
    backgroundColor: Theme.colors.accent.goldSecondary,
    borderRadius: Theme.radius.full,
  },
  statusText: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: Theme.typography.labelSm.fontSize,
    color: Theme.colors.text.muted,
    letterSpacing: 1,
  },
});
