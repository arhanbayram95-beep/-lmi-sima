import { View, Pressable, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '../../../../components/common/GlassCard';
import { Theme } from '../../../../ui/theme';

export type SettingsRowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

export function SettingsRow({ icon, label, onPress }: SettingsRowProps) {
  return (
    <GlassCard onPress={onPress}>
      <View style={styles.row}>
        <MaterialIcons name={icon} size={22} color={Theme.colors.accent.goldSecondary} />
        <Text style={styles.label}>{label}</Text>
        <MaterialIcons name="chevron-right" size={22} color={Theme.colors.text.muted} />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.bodyMedium,
    fontSize: Theme.typography.bodyMd.fontSize,
    color: Theme.colors.text.primary,
  },
});
