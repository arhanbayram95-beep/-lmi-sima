import { View, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import type { StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../ui/theme';

export type GlassCardProps = {
  children: React.ReactNode;
  borderVariant?: 'crimsonToGold' | 'goldToCrimson';
  padding?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const BORDER_COLORS = {
  crimsonToGold: [Theme.colors.accent.crimsonPrimary, Theme.colors.accent.goldSecondary] as const,
  goldToCrimson: [Theme.colors.accent.goldSecondary, Theme.colors.accent.crimsonPrimary] as const,
};

export function GlassCard({
  children,
  borderVariant = 'crimsonToGold',
  padding = Theme.spacing.md,
  onPress,
  style,
}: GlassCardProps) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <LinearGradient
      colors={BORDER_COLORS[borderVariant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.borderLayer, style]}
    >
      <Wrapper onPress={onPress} style={styles.pressableFill}>
        <BlurView intensity={40} tint="dark" style={[styles.blurLayer, { padding }]}>
          {children}
        </BlurView>
      </Wrapper>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  borderLayer: {
    borderRadius: Theme.radius.lg,
    padding: 1,
  },
  pressableFill: {
    flex: 1,
  },
  blurLayer: {
    borderRadius: Theme.radius.lg - 1,
    overflow: 'hidden',
    backgroundColor: Theme.colors.surface.glassBackground,
  },
});
