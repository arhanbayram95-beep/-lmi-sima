import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DisclaimerFooter from '../components/common/DisclaimerFooter';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

type PlanId = 'weekly' | 'annual';

const FEATURES = [
  'Unlimited 3-Expression AI Character Readings',
  'Deep Personality & Vibe Reports',
  'Full Reading History & High-Res Story Share Cards',
];

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('weekly');
  const goToScreen = useAppStore((s) => s.goToScreen);

  return (
    <View style={styles.container} testID="paywall-screen">
      <View style={styles.header}>
        <Pressable
          onPress={() => goToScreen('mainMenu')}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.headline}>Unlock Full AI Face Insights</Text>
        <Text style={styles.subtitle}>
          Experience unlimited 3-expression analysis and deep personality reports.
        </Text>

        <GlassCard style={styles.featureCard}>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconGlyph}>✦</Text>
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </GlassCard>

        <View style={styles.plans}>
          <Pressable
            onPress={() => setSelectedPlan('weekly')}
            accessibilityRole="radio"
            accessibilityState={{ checked: selectedPlan === 'weekly' }}
            testID="plan-weekly"
          >
            <GlassCard style={selectedPlan === 'weekly' ? styles.planSelected : styles.plan}>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>MOST POPULAR</Text>
              </View>
              <View style={styles.planRow}>
                <View>
                  <Text style={styles.planName}>Weekly Pass</Text>
                  <Text style={styles.planDescription}>Unlimited full access</Text>
                </View>
                <View style={styles.planPriceBlock}>
                  <Text style={styles.planPrice}>$4.99</Text>
                  <Text style={styles.planCadence}>/WEEK</Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>

          <Pressable
            onPress={() => setSelectedPlan('annual')}
            accessibilityRole="radio"
            accessibilityState={{ checked: selectedPlan === 'annual' }}
            testID="plan-annual"
          >
            <GlassCard style={selectedPlan === 'annual' ? styles.planSelected : styles.plan}>
              <View style={styles.planRow}>
                <View>
                  <Text style={styles.planName}>Annual Pass</Text>
                  <Text style={styles.planDescription}>Best value for enthusiasts</Text>
                </View>
                <View style={styles.planPriceBlock}>
                  <Text style={styles.planPrice}>$39.99</Text>
                  <Text style={styles.planCadence}>($3.33/MO)</Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Continue & Unlock Pro" onPress={() => goToScreen('mainMenu')} />
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Restore Purchases</Text>
          <Text style={styles.footerLinkDivider}>•</Text>
          <Text style={styles.footerLink}>Terms of Service</Text>
          <Text style={styles.footerLinkDivider}>•</Text>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </View>
        <DisclaimerFooter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  closeIcon: {
    color: Theme.colors.text.secondary,
    fontSize: 16,
  },
  content: {
    paddingHorizontal: Theme.spacing.containerPadding,
    gap: Theme.spacing.sm,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  featureCard: {
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(158, 41, 65, 0.3)',
  },
  featureIconGlyph: {
    color: Theme.colors.accent.goldSecondary,
  },
  featureText: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.primary,
    flex: 1,
  },
  plans: {
    gap: Theme.spacing.xs,
  },
  plan: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
  planSelected: {
    borderColor: Theme.colors.accent.crimsonPrimary,
    backgroundColor: 'rgba(158, 41, 65, 0.1)',
  },
  planBadge: {
    alignSelf: 'flex-end',
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  planBadgeText: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.primary,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    ...Theme.typography.headlineMd,
    fontSize: 18,
    color: Theme.colors.text.primary,
  },
  planDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
  planPriceBlock: {
    alignItems: 'flex-end',
  },
  planPrice: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    color: Theme.colors.text.primary,
  },
  planCadence: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.secondary,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  footerLink: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: 'rgba(179, 176, 205, 0.6)',
  },
  footerLinkDivider: {
    color: 'rgba(179, 176, 205, 0.3)',
  },
});
