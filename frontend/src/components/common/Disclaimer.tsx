import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../ui/theme';

export type DisclaimerProps = {
  text?: string;
  style?: StyleProp<ViewStyle>;
};

// Placeholder copy pending the legal review called for in PROJECT_SPEC.md §6 —
// do not treat as final without that pass.
const DEFAULT_TEXT =
  'For entertainment purposes only. No scientific or clinical validity. Your photos are analyzed instantly and never stored.';

export function Disclaimer({ text = DEFAULT_TEXT, style }: DisclaimerProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  text: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.labelSm.fontSize,
    lineHeight: Theme.typography.labelSm.lineHeight,
    color: Theme.colors.text.muted,
    textAlign: 'center',
  },
});
