import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/common/GradientBackground';
import { AppLogo } from '../../components/common/AppLogo';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { FeatureCard } from './components/FeatureCard';
import { Theme } from '../../ui/theme';
import { useEntitlementStore } from '../../store/useEntitlementStore';

const FEATURES = [
  { icon: 'lens-blur' as const, title: 'Vibe & Temperament', description: 'Instant mood & energy check.' },
  { icon: 'face-retouching-natural' as const, title: 'Expression Dynamics', description: 'Micro-expression shifts tracked live.' },
  { icon: 'grid-view' as const, title: 'Face Symmetry', description: 'Proportion & balance reading.' },
  { icon: 'auto-awesome-motion' as const, title: 'Daily Vibe Log', description: 'Track mood patterns over time.' },
];

export function AnalyzeScreen() {
  const isPro = useEntitlementStore((state) => state.isPro);

  return (
    <GradientBackground style={styles.fill}>
      <SafeAreaView style={styles.fill} edges={['top']}>
        <View style={styles.topBar}>
          <AppLogo size="sm" variant="full" />
          {isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeLabel}>PRO</Text>
            </View>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>3-Expression Face Reading</Text>
            <Text style={styles.heroBody}>
              Capture Calm, Bright, and Deep expressions to reveal your character vibe.
            </Text>
            <PrimaryButton label="Start Analysis" icon="auto-awesome" onPress={() => {}} />
          </View>
          <View style={styles.grid}>
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  proBadge: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  proBadgeLabel: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 10,
    letterSpacing: 2,
    color: Theme.colors.text.primary,
  },
  scrollContent: {
    padding: Theme.spacing.sm,
    paddingBottom: 140,
    gap: Theme.spacing.md,
  },
  hero: {
    gap: Theme.spacing.sm,
  },
  heroTitle: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineLg.fontSize,
    color: Theme.colors.text.primary,
  },
  heroBody: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyLg.fontSize,
    lineHeight: Theme.typography.bodyLg.lineHeight,
    color: Theme.colors.text.secondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
});
