import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '../../../components/common/GlassCard';
import { Theme } from '../../../ui/theme';

export type OnboardingSlideData = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  body: string;
};

export function OnboardingSlide({ icon, title, body }: OnboardingSlideData) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.slide, { width }]}>
      <GlassCard>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <MaterialIcons name={icon} size={40} color={Theme.colors.accent.goldSecondary} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(235, 201, 131, 0.12)',
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineLg.fontSize,
    color: Theme.colors.text.primary,
    textAlign: 'center',
  },
  body: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyLg.fontSize,
    lineHeight: Theme.typography.bodyLg.lineHeight,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
});
