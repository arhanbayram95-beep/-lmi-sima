import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '../../../components/common/GlassCard';
import { Theme } from '../../../ui/theme';

export type FeatureCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <MaterialIcons name={icon} size={28} color={Theme.colors.accent.crimsonPrimary} />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headlineSemibold,
    fontSize: Theme.typography.bodyMd.fontSize,
    color: Theme.colors.text.primary,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.labelSm.fontSize,
    lineHeight: Theme.typography.labelSm.lineHeight,
    color: Theme.colors.text.secondary,
  },
});
