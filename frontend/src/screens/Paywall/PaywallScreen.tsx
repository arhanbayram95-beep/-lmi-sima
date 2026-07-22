import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientBackground } from '../../components/common/GradientBackground';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Disclaimer } from '../../components/common/Disclaimer';
import { PricingTierCard } from './components/PricingTierCard';
import { Theme } from '../../ui/theme';
import { useEntitlementStore } from '../../store/useEntitlementStore';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export function PaywallScreen({ navigation }: Props) {
  const markPaywallSeen = useEntitlementStore((state) => state.markPaywallSeen);
  const [selectedTier, setSelectedTier] = useState<'weekly' | 'annual'>('weekly');

  const handleContinue = () => {
    markPaywallSeen();
    navigation.reset({ index: 0, routes: [{ name: 'MainHub' }] });
  };

  return (
    <GradientBackground style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aura Pro Access</Text>
        <Text style={styles.subtitle}>Unlock unlimited readings and your full character vibe log.</Text>
      </View>

      <View style={styles.tiers}>
        <PricingTierCard
          id="weekly"
          title="Weekly Pass"
          description="Unlimited full access"
          price="$4.99"
          billingPeriod="/WEEK"
          badge={{ label: 'MOST POPULAR', variant: 'crimson' }}
          selected={selectedTier === 'weekly'}
          onSelect={() => setSelectedTier('weekly')}
        />
        <PricingTierCard
          id="annual"
          title="Annual Pass"
          description="Best value for enthusiasts"
          price="$39.99"
          billingPeriod="/YEAR"
          badge={{ label: 'SAVE 60%', variant: 'gold' }}
          selected={selectedTier === 'annual'}
          onSelect={() => setSelectedTier('annual')}
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Start My Aura Pro" onPress={handleContinue} style={styles.cta} />
        <PrimaryButton label="Not Now" onPress={handleContinue} variant="ghost" style={styles.secondaryCta} />
        <Disclaimer text="Cancel anytime, as easily as you subscribed. For entertainment purposes only." />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xl,
  },
  header: {
    gap: Theme.spacing.xs,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineLg.fontSize,
    color: Theme.colors.accent.goldSecondary,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyMd.fontSize,
    color: Theme.colors.text.secondary,
  },
  tiers: {
    gap: Theme.spacing.sm,
  },
  footer: {
    gap: Theme.spacing.xs,
  },
  cta: {
    width: '100%',
  },
  secondaryCta: {
    width: '100%',
  },
});
