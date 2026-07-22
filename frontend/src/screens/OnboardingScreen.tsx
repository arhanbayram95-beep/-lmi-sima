import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

const STEP_COUNT = 2;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const ageVerified = useAppStore((s) => s.ageVerified);
  const imageConsentGiven = useAppStore((s) => s.imageConsentGiven);
  const setAgeVerified = useAppStore((s) => s.setAgeVerified);
  const setImageConsentGiven = useAppStore((s) => s.setImageConsentGiven);
  const goToScreen = useAppStore((s) => s.goToScreen);

  const canContinue = step === 0 || (ageVerified && imageConsentGiven);

  const handlePrimaryPress = () => {
    if (step < STEP_COUNT - 1) {
      setStep(step + 1);
      return;
    }
    if (!canContinue) return;
    goToScreen('review');
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
            <View style={styles.textBlock}>
              <Text style={styles.headline}>AI-Powered Expression Reading</Text>
              <Text style={styles.body}>
                Capture three distinct facets of your character through our neural matrix:{' '}
                <Text style={styles.highlight}>Calm</Text>, <Text style={styles.highlight}>Bright</Text>, and{' '}
                <Text style={styles.highlight}>Deep</Text>.
              </Text>
            </View>
          ) : (
            <View style={styles.textBlock}>
              <Text style={styles.headline}>Before We Begin</Text>
              <Text style={styles.body}>
                Your photos are analyzed instantly and never stored. This is for entertainment only.
              </Text>

              <Pressable
                style={styles.checkboxRow}
                onPress={() => setAgeVerified(!ageVerified)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: ageVerified }}
                testID="age-gate-checkbox"
              >
                <View style={[styles.checkbox, ageVerified && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>I confirm I am 18 years of age or older.</Text>
              </Pressable>

              <Pressable
                style={styles.checkboxRow}
                onPress={() => setImageConsentGiven(!imageConsentGiven)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: imageConsentGiven }}
                testID="consent-checkbox"
              >
                <View style={[styles.checkbox, imageConsentGiven && styles.checkboxChecked]} />
                <Text style={styles.checkboxLabel}>
                  I consent to my photos being processed for this entertainment reading.
                </Text>
              </Pressable>
            </View>
          )}
        </GlassCard>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={step < STEP_COUNT - 1 ? 'Next' : 'Get Started'}
          onPress={handlePrimaryPress}
          style={!canContinue ? styles.disabled : undefined}
        />
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
  highlight: {
    color: Theme.colors.accent.crimsonPrimary,
    fontWeight: '600',
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
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.lg,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
