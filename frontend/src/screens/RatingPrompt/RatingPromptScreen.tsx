import { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import * as StoreReview from 'expo-store-review';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientBackground } from '../../components/common/GradientBackground';
import { GlassCard } from '../../components/common/GlassCard';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { StarRating } from './components/StarRating';
import { Theme } from '../../ui/theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingPrompt'>;

export function RatingPromptScreen({ navigation }: Props) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const goToPaywall = () => navigation.navigate('Paywall');

  const handleRate = async (value: number) => {
    setRating(value);
    if (value >= 4) {
      const available = await StoreReview.isAvailableAsync();
      if (available) {
        await StoreReview.requestReview();
      }
      goToPaywall();
    } else {
      setShowFeedbackInput(true);
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Enjoying your reading?</Text>
        <StarRating rating={rating} onRate={handleRate} />
        {showFeedbackInput && (
          <>
            <Text style={styles.subtitle}>Tell us what we can improve.</Text>
            <TextInput
              style={styles.input}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Your feedback…"
              placeholderTextColor={Theme.colors.text.muted}
              multiline
            />
            <PrimaryButton label="Send Feedback" onPress={goToPaywall} style={styles.submitButton} />
          </>
        )}
      </GlassCard>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineMd.fontSize,
    color: Theme.colors.text.primary,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyMd.fontSize,
    color: Theme.colors.text.secondary,
  },
  input: {
    width: '100%',
    minHeight: 80,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    padding: Theme.spacing.sm,
    color: Theme.colors.text.primary,
    fontFamily: Theme.typography.fontFamily.body,
    textAlignVertical: 'top',
  },
  submitButton: {
    width: '100%',
  },
});
