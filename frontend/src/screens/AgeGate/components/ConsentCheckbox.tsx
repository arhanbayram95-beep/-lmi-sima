import { Pressable, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../../ui/theme';

export type ConsentCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

export function ConsentCheckbox({ checked, onToggle, label }: ConsentCheckboxProps) {
  return (
    <Pressable onPress={onToggle} style={styles.row} testID="consent-checkbox">
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <MaterialIcons name="check" size={16} color={Theme.colors.background.start} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: Theme.radius.sm,
    borderWidth: 1.5,
    borderColor: Theme.colors.accent.crimsonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  boxChecked: {
    backgroundColor: Theme.colors.accent.goldSecondary,
    borderColor: Theme.colors.accent.goldSecondary,
  },
  label: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyMd.fontSize,
    lineHeight: Theme.typography.bodyMd.lineHeight,
    color: Theme.colors.text.secondary,
  },
});
