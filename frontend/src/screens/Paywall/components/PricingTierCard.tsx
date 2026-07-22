import { Pressable, View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../../../components/common/GlassCard';
import { Theme } from '../../../ui/theme';

export type PricingTierCardProps = {
  id: 'weekly' | 'annual';
  title: string;
  price: string;
  billingPeriod: string;
  description: string;
  badge?: { label: string; variant: 'crimson' | 'gold' };
  selected: boolean;
  onSelect: () => void;
};

export function PricingTierCard({
  title,
  price,
  billingPeriod,
  description,
  badge,
  selected,
  onSelect,
}: PricingTierCardProps) {
  return (
    <Pressable onPress={onSelect}>
      <GlassCard
        borderVariant={selected ? 'crimsonToGold' : 'goldToCrimson'}
        style={styles.card}
      >
        {badge && (
          <View style={[styles.badge, badge.variant === 'crimson' ? styles.badgeCrimson : styles.badgeGold]}>
            <Text style={[styles.badgeLabel, badge.variant === 'gold' && styles.badgeLabelDark]}>
              {badge.label}
            </Text>
          </View>
        )}
        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.period}>{billingPeriod}</Text>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  badgeCrimson: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  badgeGold: {
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  badgeLabel: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 10,
    letterSpacing: 1,
    color: Theme.colors.text.primary,
  },
  badgeLabelDark: {
    color: Theme.colors.background.start,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    gap: 4,
  },
  right: {
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headlineSemibold,
    fontSize: Theme.typography.bodyLg.fontSize,
    color: Theme.colors.text.primary,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.labelSm.fontSize,
    color: Theme.colors.text.secondary,
  },
  price: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineMd.fontSize,
    color: Theme.colors.text.primary,
  },
  period: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 10,
    color: Theme.colors.text.secondary,
  },
});
