import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LegalSection } from '../../content/legalContent';
import { useTranslation } from '../../i18n/useTranslation';
import { Theme } from '../../ui/theme';
import PrimaryButton from './PrimaryButton';

interface LegalDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  testID: string;
}

export default function LegalDocumentModal({
  visible,
  onClose,
  title,
  lastUpdated,
  sections,
  testID,
}: LegalDocumentModalProps) {
  const t = useTranslation();
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID={testID}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {sections.map((section) => (
              <View key={section.heading} style={styles.section}>
                <Text style={styles.sectionHeading}>{section.heading}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            ))}
            <Text style={styles.disclaimer}>
              This document is a working draft pending final legal review per target market (see
              PROJECT_SPEC.md §6) and may be updated before public launch.
            </Text>
          </ScrollView>
          <PrimaryButton label={t('common.close')} onPress={onClose} />
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
    maxHeight: '80%',
    backgroundColor: Theme.colors.background.middle,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  lastUpdated: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  body: {
    marginBottom: Theme.spacing.xs,
  },
  section: {
    marginBottom: Theme.spacing.sm,
  },
  sectionHeading: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  sectionBody: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    lineHeight: 20,
    color: Theme.colors.text.secondary,
  },
  disclaimer: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    color: Theme.colors.text.muted,
    marginTop: Theme.spacing.xs,
    marginBottom: Theme.spacing.sm,
  },
});
