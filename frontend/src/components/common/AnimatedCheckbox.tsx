import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../ui/theme';

interface AnimatedCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  testID?: string;
  // Stays visible rather than disappearing — a row that vanishes once a
  // selection cap is hit reads as a bug ("where did that option go?"),
  // greyed-and-inert reads as "you're at the limit."
  disabled?: boolean;
}

export default function AnimatedCheckbox({ checked, onToggle, label, testID, disabled }: AnimatedCheckboxProps) {
  const checkScale = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const boxScale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkScale, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      speed: 24,
      bounciness: checked ? 16 : 0,
    }).start();
    Animated.timing(glow, { toValue: checked ? 1 : 0, duration: 180, useNativeDriver: false }).start();
  }, [checked, checkScale, glow]);

  const handlePress = () => {
    if (disabled) return;
    Animated.sequence([
      Animated.spring(boxScale, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 0 }),
      Animated.spring(boxScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 14 }),
    ]).start();
    onToggle();
  };

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [Theme.colors.text.secondary, Theme.colors.accent.goldSecondary],
  });

  return (
    <Pressable
      style={[styles.row, disabled && styles.rowDisabled]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      testID={testID}
    >
      <Animated.View style={{ transform: [{ scale: boxScale }] }}>
        <Animated.View style={[styles.box, { borderColor }, checked && styles.boxChecked]}>
          <Animated.Text
            style={[
              styles.check,
              {
                opacity: checkScale,
                transform: [{ scale: checkScale }],
              },
            ]}
          >
            ✓
          </Animated.Text>
        </Animated.View>
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  boxChecked: {
    backgroundColor: Theme.colors.accent.goldSecondary,
    shadowColor: Theme.colors.accent.goldSecondary,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  check: {
    color: Theme.colors.background.start,
    fontSize: 15,
    fontWeight: '800',
  },
  label: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.primary,
    flex: 1,
  },
});
