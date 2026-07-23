import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import PrivacyPolicyModal from '../components/common/PrivacyPolicyModal';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

const STEP_COUNT = 2;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const ageVerified = useAppStore((s) => s.ageVerified);
  const imageConsentGiven = useAppStore((s) => s.imageConsentGiven);
  const setAgeVerified = useAppStore((s) => s.setAgeVerified);
  const setImageConsentGiven = useAppStore((s) => s.setImageConsentGiven);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();

  const canContinue = step === 0 || (ageVerified && imageConsentGiven);

  const handlePrimaryPress = () => {
    if (step < STEP_COUNT - 1) {
      setStep(step + 1);
      return;
    }
    if (!canContinue) return;
    goToScreen('paywall');
  };

  return (
    <View style={styles.container} testID="onboarding-screen">
      <View style={styles.header}>
        <AppLogo />
      </View>

      <View style={styles.content}>
        <GlassCard style={styles.card}>
          <View style={styles.dots} accessibilityLabel="Onboarding progress">
            {Array.from({ length: STEP_COUNT }).map((_, index) => (
              <View key={index} style={[styles.dot, index === step && styles.dotActive]} />
            ))}
          </View>

          {step === 0 ? (
            <FadeInView key="step-0" style={styles.textBlock}>
              <Text style={styles.headline}>{t('onboarding.step0.headline')}</Text>
              <Text style={styles.body}>{t('onboarding.step0.body')}</Text>
            </FadeInView>
          ) : (
            <FadeInView key="step-1" style={styles.textBlock}>
              <Text style={styles.headline}>{t('onboarding.step1.headline')}</Text>
              <Text style={styles.body}>{t('onboarding.step1.body')}</Text>

              <Pressable
                style={styles.checkboxRow}
                onPress={() => setAgeVerified(!ageVerified)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: ageVerified }}
                testID="age-gate-checkbox"
              >
                <View style={[styles.checkbox, ageVerified && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>{t('onboarding.ageCheckbox')}</Text>
              </Pressable>

              <Pressable
                style={styles.checkboxRow}
                onPress={() => setImageConsentGiven(!imageConsentGiven)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: imageConsentGiven }}
                testID="consent-checkbox"
              >
                <View style={[styles.checkbox, imageConsentGiven && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>{t('onboarding.consentCheckbox')}</Text>
              </Pressable>

              <Pressable onPress={() => setPrivacyVisible(true)} accessibilityRole="link">
                <Text style={styles.privacyLink}>{t('onboarding.privacyLink')}</Text>
              </Pressable>
            </FadeInView>
          )}
        </GlassCard>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={step < STEP_COUNT - 1 ? t('onboarding.next') : t('onboarding.getStarted')}
          onPress={handlePrimaryPress}
          disabled={!canContinue}
        />
      </View>

      <PrivacyPolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  card: {
    gap: Theme.spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 223, 158, 0.4)',
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  textBlock: {
    gap: Theme.spacing.sm,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  body: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.colors.text.secondary,
  },
  checkboxChecked: {
    backgroundColor: Theme.colors.accent.goldSecondary,
    borderColor: Theme.colors.accent.goldSecondary,
  },
  checkboxLabel: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.primary,
    flex: 1,
  },
  privacyLink: {
    ...Theme.typography.labelSm,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.lg,
    alignItems: 'center',
  },
});
