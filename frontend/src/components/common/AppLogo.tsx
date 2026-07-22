import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../ui/theme';

interface AppLogoProps {
  size?: 'sm' | 'lg';
}

export default function AppLogo({ size = 'sm' }: AppLogoProps) {
  const isLarge = size === 'lg';
  return (
    <View style={styles.container}>
      <View style={[styles.glow, isLarge && styles.glowLg]}>
        <View style={[styles.badge, isLarge && styles.badgeLg]}>
          <Text style={[styles.sparkle, isLarge && styles.sparkleLg]}>✦</Text>
        </View>
      </View>
      <Text style={[styles.wordmark, isLarge && styles.wordmarkLg]}>FaceAI</Text>
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
    width: 28,
    height: 28,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface.glassBackground,
    borderWidth: 1,
    borderColor: Theme.colors.accent.goldSecondary,
  },
  badgeLg: {
    width: 96,
    height: 96,
    borderRadius: Theme.radius.full,
  },
  sparkle: {
    color: Theme.colors.accent.goldSecondary,
    fontSize: 14,
  },
  sparkleLg: {
    fontSize: 40,
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
