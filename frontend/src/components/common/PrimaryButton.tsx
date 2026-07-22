import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../ui/theme';

export type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  variant?: 'filled' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, onPress, icon, disabled, variant = 'filled', style }: PrimaryButtonProps) {
  const isGhost = variant === 'ghost';
  const iconColor = isGhost ? Theme.colors.text.secondary : Theme.colors.background.start;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isGhost && styles.buttonGhost,
        disabled && styles.disabled,
        pressed && !disabled && !isGhost && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.label, isGhost && styles.labelGhost]}>{label}</Text>
        {icon && <MaterialIcons name={icon} size={20} color={iconColor} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.accent.goldSecondary,
    borderRadius: Theme.radius.full,
    paddingVertical: Theme.spacing.xs + 4,
    paddingHorizontal: Theme.spacing.md,
    shadowColor: Theme.colors.accent.goldSecondary,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontFamily: Theme.typography.fontFamily.headlineSemibold,
    fontSize: Theme.typography.bodyMd.fontSize,
    color: Theme.colors.background.start,
  },
  labelGhost: {
    color: Theme.colors.text.secondary,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    transform: [{ translateY: -1 }],
    shadowOpacity: 0.6,
  },
});
