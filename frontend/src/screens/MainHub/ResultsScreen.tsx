import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { GradientBackground } from '../../components/common/GradientBackground';
import { GlassCard } from '../../components/common/GlassCard';
import { Theme } from '../../ui/theme';

export function ResultsScreen() {
  return (
    <GradientBackground style={styles.fill}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Your Readings</Text>
        <GlassCard>
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={40} color={Theme.colors.text.muted} />
            <Text style={styles.emptyTitle}>No readings yet</Text>
            <Text style={styles.emptyBody}>
              Complete your first 3-expression analysis to see it appear here.
            </Text>
          </View>
        </GlassCard>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Theme.spacing.sm,
    gap: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineLg.fontSize,
    color: Theme.colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.lg,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fontFamily.headlineSemibold,
    fontSize: Theme.typography.bodyLg.fontSize,
    color: Theme.colors.text.primary,
  },
  emptyBody: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyMd.fontSize,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
});
