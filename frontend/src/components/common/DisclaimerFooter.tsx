import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../i18n/useTranslation';
import { Theme } from '../../ui/theme';

// Non-negotiable per CLAUDE.md "Entertainment Framing" — must stay legible
// and present on every result/paywall surface. Do not shrink or hide.
export default function DisclaimerFooter() {
  const t = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('disclaimer.text')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
  },
  text: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
