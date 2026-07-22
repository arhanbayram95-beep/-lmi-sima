import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'react-native';
import { Theme } from '../../ui/theme';

type AppLogoSize = 'sm' | 'md' | 'lg';

export type AppLogoProps = {
  size?: AppLogoSize | number;
  variant?: 'icon' | 'full';
  source?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
};

const SIZE_MAP: Record<AppLogoSize, number> = { sm: 24, md: 32, lg: 48 };

export function AppLogo({ size = 'md', variant = 'icon', source, style }: AppLogoProps) {
  const resolvedSize = typeof size === 'number' ? size : SIZE_MAP[size];

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.glow,
          {
            width: resolvedSize,
            height: resolvedSize,
            borderRadius: resolvedSize / 2,
          },
        ]}
      >
        {source ? (
          <Image
            source={source}
            style={{ width: resolvedSize, height: resolvedSize, borderRadius: resolvedSize / 2 }}
            resizeMode="contain"
          />
        ) : (
          <MaterialIcons name="auto-awesome" size={resolvedSize * 0.55} color={Theme.colors.accent.goldSecondary} />
        )}
      </View>
      {variant === 'full' && <Text style={styles.wordmark}>FaceAI</Text>}
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(235, 201, 131, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.3)',
  },
  wordmark: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineMd.fontSize,
    color: Theme.colors.text.secondary,
    letterSpacing: -0.5,
  },
});
