import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../ui/theme';

interface AppLogoProps {
  size?: 'sm' | 'lg';
  // Icon-only by default — the full icon+wordmark lockup is reserved for
  // the handful of once-per-session brand moments (first launch, the
  // post-onboarding welcome, the externally-shared card) where it's
  // explicitly opted into. Everywhere the user revisits constantly (the
  // Analyze hub, onboarding, every single analysis run) showing the full
  // wordmark every time read as repetitive.
  showWordmark?: boolean;
}

export default function AppLogo({ size = 'sm', showWordmark = false }: AppLogoProps) {
  const isLarge = size === 'lg';
  return (
    <View style={styles.container}>
      <View style={[styles.glow, isLarge && styles.glowLg]}>
        <Image
          source={require('../../../assets/logo-badge.png')}
          style={[styles.badge, isLarge && styles.badgeLg]}
        />
      </View>
      {showWordmark && <Text style={[styles.wordmark, isLarge && styles.wordmarkLg]}>Face Reader</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glow: {
    shadowColor: Theme.colors.accent.goldSecondary,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  glowLg: {
    shadowRadius: 24,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.accent.goldSecondary,
  },
  badgeLg: {
    width: 128,
    height: 128,
    borderRadius: Theme.radius.lg,
  },
  wordmark: {
    ...Theme.typography.headlineMd,
    fontSize: 18,
    color: Theme.colors.accent.goldSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  wordmarkLg: {
    ...Theme.typography.headlineLg,
    fontSize: 26,
    letterSpacing: 4,
  },
});
