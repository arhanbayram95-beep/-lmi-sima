import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../ui/theme';

export type GradientBackgroundProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GradientBackground({ children, style }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={[Theme.colors.background.start, Theme.colors.background.middle, Theme.colors.background.end]}
      locations={[0, 0.55, 1]}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
