import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../i18n/useTranslation';
import { Theme } from '../../ui/theme';
import PrimaryButton from './PrimaryButton';

interface PhotoSourceModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromLibrary: () => void;
}

// Same optionRow/backdrop shape as ShareOptionsModal's menu mode — the app
// already has one established "small sheet of tappable choices" pattern,
// reused here rather than introducing a second one.
function SourceOptionRow({
  icon,
  title,
  subtitle,
  onPress,
  testID,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable style={styles.optionRow} onPress={onPress} accessibilityRole="button" testID={testID}>
      <Text style={styles.optionIcon}>{icon}</Text>
      <View style={styles.optionTextBlock}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

export default function PhotoSourceModal({ visible, onClose, onTakePhoto, onChooseFromLibrary }: PhotoSourceModalProps) {
  const t = useTranslation();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID="photo-source-modal">
          <Text style={styles.title}>{t('capture.sourceModal.title')}</Text>
          <View style={styles.options}>
            <SourceOptionRow
              icon="📷"
              title={t('capture.sourceModal.takePhoto.title')}
              subtitle={t('capture.sourceModal.takePhoto.subtitle')}
              onPress={onTakePhoto}
              testID="photo-source-camera"
            />
            <SourceOptionRow
              icon="🖼️"
              title={t('capture.sourceModal.library.title')}
              subtitle={t('capture.sourceModal.library.subtitle')}
              onPress={onChooseFromLibrary}
              testID="photo-source-library"
            />
          </View>
          <PrimaryButton
            label={t('capture.cancelButton')}
            variant="secondary"
            onPress={onClose}
            testID="photo-source-cancel"
          />
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
    backgroundColor: Theme.colors.background.middle,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  options: {
    gap: Theme.spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
  },
  optionIcon: {
    fontSize: 26,
  },
  optionTextBlock: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  optionSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.text.secondary,
  },
});
