import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Theme } from '../../ui/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, variant = 'primary', style }: PrimaryButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={isPrimary ? styles.primaryLabel : styles.secondaryLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Theme.colors.accent.goldSecondary,
    shadowColor: Theme.colors.accent.goldSecondary,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.accent.crimsonPrimary,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  primaryLabel: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.background.start,
  },
  secondaryLabel: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
  },
});
