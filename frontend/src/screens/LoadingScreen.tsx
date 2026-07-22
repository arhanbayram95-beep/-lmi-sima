import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

const AUTO_ADVANCE_MS = 2600;

const STATUSES = [
  'CALIBRATING VISION ENGINE...',
  'DECRYPTING BIOMETRIC DATA...',
  'OPTIMIZING NEURAL PATHWAYS...',
  'ESTABLISHING SECURE PROTOCOLS...',
  'SYNCHRONIZING COSMIC ARTIFACTS...',
];

export default function LoadingScreen() {
  const [statusIndex, setStatusIndex] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const goToScreen = useAppStore((s) => s.goToScreen);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUSES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => goToScreen('onboarding'), AUTO_ADVANCE_MS);
    return () => clearTimeout(timeout);
  }, [goToScreen]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse, spin]);

  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container} testID="loading-screen">
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <AppLogo size="lg" />
      </Animated.View>
      <Text style={styles.subtitle}>Initializing Neural Matrix</Text>

      <View style={styles.progressWrap}>
        <View style={styles.shimmerTrack}>
          <View style={styles.shimmerFill} />
        </View>
        <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spinDeg }] }]} />
        <Text style={styles.statusText}>{STATUSES[statusIndex]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
    gap: Theme.spacing.sm,
  },
  subtitle: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  progressWrap: {
    position: 'absolute',
    bottom: 96,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  shimmerTrack: {
    width: '100%',
    height: 2,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(158, 41, 65, 0.2)',
    overflow: 'hidden',
  },
  shimmerFill: {
    width: '66%',
    height: '100%',
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  spinnerRing: {
    width: 44,
    height: 44,
    borderRadius: Theme.radius.full,
    borderWidth: 2,
    borderColor: 'rgba(158, 41, 65, 0.3)',
    borderTopColor: Theme.colors.accent.goldSecondary,
  },
  statusText: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
  },
});
