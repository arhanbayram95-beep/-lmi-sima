import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientBackground } from '../../components/common/GradientBackground';
import { GlassCard } from '../../components/common/GlassCard';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Disclaimer } from '../../components/common/Disclaimer';
import { ConsentCheckbox } from './components/ConsentCheckbox';
import { AgeDeclinedScreen } from './components/AgeDeclinedScreen';
import { Theme } from '../../ui/theme';
import { useConsentStore } from '../../store/useConsentStore';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AgeGate'>;

const CONSENT_LABEL =
  'Your photos are analyzed instantly and never stored. This is for entertainment only.';

export function AgeGateScreen({ navigation }: Props) {
  const affirmAge = useConsentStore((state) => state.affirmAge);
  const setConsent = useConsentStore((state) => state.setConsent);
  const completeOnboarding = useConsentStore((state) => state.completeOnboarding);
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  if (isAdult === false) {
    return <AgeDeclinedScreen />;
  }

  const canContinue = isAdult === true && consentChecked;

  const handleContinue = () => {
    affirmAge(true);
    setConsent(true);
    completeOnboarding();
    navigation.navigate('RatingPrompt');
  };

  return (
    <GradientBackground style={styles.container}>
      <GlassCard>
        <View style={styles.card}>
          <Text style={styles.title}>Before we begin</Text>
          <Text style={styles.subtitle}>Please confirm the following to continue.</Text>

          <View style={styles.ageButtons}>
            <Pressable
              onPress={() => setIsAdult(true)}
              style={[styles.ageButton, isAdult === true && styles.ageButtonActive]}
            >
              <Text style={styles.ageButtonLabel}>I'm 18 or older</Text>
            </Pressable>
            <Pressable onPress={() => setIsAdult(false)} style={styles.ageButton}>
              <Text style={styles.ageButtonLabel}>I'm under 18</Text>
            </Pressable>
          </View>

          <ConsentCheckbox checked={consentChecked} onToggle={() => setConsentChecked((v) => !v)} label={CONSENT_LABEL} />

          <PrimaryButton label="Continue" onPress={handleContinue} disabled={!canContinue} style={styles.continueButton} />
        </View>
      </GlassCard>
      <Disclaimer />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  card: {
    gap: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineLg.fontSize,
    color: Theme.colors.text.primary,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyMd.fontSize,
    color: Theme.colors.text.secondary,
  },
  ageButtons: {
    gap: Theme.spacing.xs,
  },
  ageButton: {
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.md,
    paddingVertical: Theme.spacing.xs + 4,
    paddingHorizontal: Theme.spacing.sm,
  },
  ageButtonActive: {
    borderColor: Theme.colors.accent.crimsonPrimary,
    backgroundColor: 'rgba(158, 41, 65, 0.2)',
  },
  ageButtonLabel: {
    fontFamily: Theme.typography.fontFamily.bodyMedium,
    fontSize: Theme.typography.bodyMd.fontSize,
    color: Theme.colors.text.primary,
  },
  continueButton: {
    marginTop: Theme.spacing.xs,
  },
});
