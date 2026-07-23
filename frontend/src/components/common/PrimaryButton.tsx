import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Theme } from '../../ui/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const isPrimary = variant === 'primary';
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 30, bounciness: 10 }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        style={[styles.button, isPrimary ? styles.primary : styles.secondary, disabled && styles.disabled, style]}
      >
        <Text style={isPrimary ? styles.primaryLabel : styles.secondaryLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
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
  disabled: {
    opacity: 0.4,
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
