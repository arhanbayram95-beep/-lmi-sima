import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GradientBackground } from '../../../components/common/GradientBackground';
import { Theme } from '../../../ui/theme';

export function AgeDeclinedScreen() {
  return (
    <GradientBackground style={styles.container}>
      <MaterialIcons name="lock" size={48} color={Theme.colors.text.muted} />
      <Text style={styles.title}>Age Restricted</Text>
      <Text style={styles.body}>
        This experience is intended for adults 18 and older. You're welcome to return once you meet the age
        requirement.
      </Text>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineMd.fontSize,
    color: Theme.colors.text.primary,
  },
  body: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyMd.fontSize,
    lineHeight: Theme.typography.bodyMd.lineHeight,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
});
