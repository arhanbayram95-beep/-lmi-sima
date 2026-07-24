import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DisclaimerFooter from '../components/common/DisclaimerFooter';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import PrivacyPolicyModal from '../components/common/PrivacyPolicyModal';
import TermsModal from '../components/common/TermsModal';
import { useTranslation } from '../i18n/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

type PlanId = 'weekly' | 'annual';

const FEATURE_KEYS: TranslationKey[] = ['paywall.feature1', 'paywall.feature2', 'paywall.feature3'];

function PlanCard({
  selected,
  onPress,
  testID,
  children,
}: React.PropsWithChildren<{ selected: boolean; onPress: () => void; testID: string }>) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selected) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.02, useNativeDriver: true, speed: 40, bounciness: 12 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 12 }),
      ]).start();
    }
  }, [selected, scale]);

  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }} testID={testID}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <GlassCard style={selected ? styles.planSelected : styles.plan}>{children}</GlassCard>
      </Animated.View>
    </Pressable>
  );
}

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('weekly');
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const goBack = useAppStore((s) => s.goBack);
  const isProActive = useAppStore((s) => s.isProActive);
  const setProActive = useAppStore((s) => s.setProActive);
  const t = useTranslation();

  // Subscribing and starting the trial land the user in the same place
  // today (no real billing integration yet — see PROJECT_SPEC.md Phase
  // 5.1). The trial is deliberately the smaller, secondary action so a
  // full subscription is the path of least resistance.
  const enterApp = () => {
    setProActive(true);
    goToScreen('welcome');
  };

  // No RevenueCat integration yet (Phase 5.1) — this can't look up real
  // purchase history, so it honestly reports finding nothing rather than
  // silently doing nothing when tapped.
  const handleRestorePurchases = () => {
    Alert.alert(t('paywall.restorePurchases'), t('restorePurchases.alertBody'));
  };

  return (
    <View style={styles.container} testID="paywall-screen">
      <View style={styles.header}>
        {isProActive && (
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={styles.closeButton}
            testID="paywall-close-button"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <FadeInView>
          <Text style={styles.headline}>{t('paywall.headline')}</Text>
          <Text style={styles.subtitle}>{t('paywall.subtitle')}</Text>
        </FadeInView>

        <FadeInView delay={80}>
          <GlassCard style={styles.featureCard}>
            <Text style={styles.featuresHeading}>{t('paywall.featuresHeading')}</Text>
            {FEATURE_KEYS.map((key) => (
              <View key={key} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconGlyph}>✓</Text>
                </View>
                <Text style={styles.featureText}>{t(key)}</Text>
              </View>
            ))}
          </GlassCard>
        </FadeInView>

        <FadeInView delay={160} style={styles.plans}>
          <PlanCard selected={selectedPlan === 'weekly'} onPress={() => setSelectedPlan('weekly')} testID="plan-weekly">
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{t('paywall.mostPopular')}</Text>
            </View>
            <View style={styles.planRow}>
              <View>
                <Text style={styles.planName}>{t('paywall.weeklyName')}</Text>
                <Text style={styles.planDescription}>{t('paywall.weeklyDescription')}</Text>
              </View>
              <View style={styles.planPriceBlock}>
                <Text style={styles.planPrice}>$4.99</Text>
                <Text style={styles.planCadence}>{t('paywall.weeklyCadence')}</Text>
              </View>
            </View>
          </PlanCard>

          <PlanCard selected={selectedPlan === 'annual'} onPress={() => setSelectedPlan('annual')} testID="plan-annual">
            <View style={styles.planRow}>
              <View>
                <View style={styles.planNameRow}>
                  <Text style={styles.planName}>{t('paywall.annualName')}</Text>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveBadgeText}>{t('paywall.saveBadge')}</Text>
                  </View>
                </View>
                <Text style={styles.planDescription}>{t('paywall.annualDescription')}</Text>
              </View>
              <View style={styles.planPriceBlock}>
                <Text style={styles.planPrice}>$39.99</Text>
                <Text style={styles.planCadence}>{t('paywall.annualCadence')}</Text>
              </View>
            </View>
          </PlanCard>
        </FadeInView>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label={t('paywall.subscribeNow')} onPress={enterApp} />
        <Text style={styles.reassurance}>{t('paywall.reassurance')}</Text>

        <Pressable onPress={enterApp} accessibilityRole="button" testID="paywall-trial-link">
          <Text style={styles.trialLink}>{t('paywall.trialLink')}</Text>
        </Pressable>

        <View style={styles.footerLinks}>
          <Pressable onPress={handleRestorePurchases} accessibilityRole="button" testID="paywall-restore-purchases">
            <Text style={styles.footerLink}>{t('paywall.restorePurchases')}</Text>
          </Pressable>
          <Text style={styles.footerLinkDivider}>•</Text>
          <Pressable onPress={() => setTermsVisible(true)} accessibilityRole="link" testID="paywall-terms-of-service">
            <Text style={styles.footerLink}>{t('paywall.termsOfService')}</Text>
          </Pressable>
          <Text style={styles.footerLinkDivider}>•</Text>
          <Pressable onPress={() => setPrivacyVisible(true)} accessibilityRole="link">
            <Text style={styles.footerLink}>{t('paywall.privacyPolicy')}</Text>
          </Pressable>
        </View>
        <DisclaimerFooter />
      </View>
      </ScrollView>

      <PrivacyPolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} />
      <TermsModal visible={termsVisible} onClose={() => setTermsVisible(false)} />
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
    minHeight: Theme.spacing.xl + 40,
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: Theme.spacing.sm,
  },
  content: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.xs,
    gap: Theme.spacing.md,
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
  },
  featuresHeading: {
    ...Theme.typography.labelSm,
    color: Theme.colors.accent.goldSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
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
    backgroundColor: 'rgba(129, 199, 132, 0.18)',
  },
  featureIconGlyph: {
    color: Theme.colors.status.success,
    fontWeight: '700',
  },
  featureText: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.primary,
    flex: 1,
  },
  plans: {
    gap: Theme.spacing.sm,
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
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBadge: {
    backgroundColor: 'rgba(235, 201, 131, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saveBadgeText: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.accent.goldSecondary,
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
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  reassurance: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    textAlign: 'center',
  },
  trialLink: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: 'rgba(179, 176, 205, 0.55)',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
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
