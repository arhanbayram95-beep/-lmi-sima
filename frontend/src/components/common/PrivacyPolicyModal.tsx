import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../ui/theme';
import PrimaryButton from './PrimaryButton';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

// Placeholder copy only — per PROJECT_SPEC.md §6 this needs a real legal
// review pass per target market before launch. Do not treat this text as
// binding; it exists so the required link/affordance is in place early.
export default function PrivacyPolicyModal({ visible, onClose }: PrivacyPolicyModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID="privacy-policy-modal">
          <Text style={styles.title}>Privacy Policy</Text>
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.paragraph}>
              FaceAI captures three photos to generate your entertainment reading. Photos are held in
              memory only for the duration of the request and are never written to disk, stored in a
              database, or shared with third parties.
            </Text>
            <Text style={styles.paragraph}>
              Once your reading is generated, the photos are discarded immediately. We do not build a
              face-recognition profile of you or retain any biometric data between sessions.
            </Text>
            <Text style={styles.paragraph}>
              This screen is a placeholder summary pending full legal review per target market (see
              PROJECT_SPEC.md §6) and does not constitute the final Privacy Policy.
            </Text>
          </ScrollView>
          <PrimaryButton label="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 7, 27, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.containerPadding,
  },
  sheet: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: Theme.colors.background.middle,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  body: {
    marginBottom: Theme.spacing.xs,
  },
  paragraph: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.sm,
  },
});
