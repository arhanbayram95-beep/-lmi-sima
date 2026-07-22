import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../ui/theme';

// Non-negotiable per CLAUDE.md "Entertainment Framing" — must stay legible
// and present on every result/paywall surface. Do not shrink or hide.
export default function DisclaimerFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        For entertainment purposes only. FaceAI does not provide clinical, psychological, or diagnostic
        assessments. Photos are processed in memory and never stored.
      </Text>
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
