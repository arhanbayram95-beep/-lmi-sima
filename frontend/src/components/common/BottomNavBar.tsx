import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../state/useAppStore';
import { Theme } from '../../ui/theme';

const NAV_ITEMS = [
  { key: 'analyze', label: 'Analyze', glyph: '◉' },
  { key: 'results', label: 'Results', glyph: '▤' },
  { key: 'settings', label: 'Settings', glyph: '⚙' },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]['key'];

interface BottomNavBarProps {
  active: NavKey;
}

export default function BottomNavBar({ active }: BottomNavBarProps) {
  const goToScreen = useAppStore((s) => s.goToScreen);

  const handlePress = (key: NavKey) => {
    if (key === 'analyze') goToScreen('analyze');
    if (key === 'results') goToScreen('results');
    if (key === 'settings') goToScreen('settings');
  };

  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active;
        return (
          <Pressable
            key={item.key}
            onPress={() => handlePress(item.key)}
            style={[styles.navItem, isActive && styles.navItemActive]}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <Text style={[styles.navGlyph, isActive && styles.navGlyphActive]}>{item.glyph}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.surface.glassOverlay,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
    gap: 2,
  },
  navItemActive: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  navGlyph: {
    color: Theme.colors.text.secondary,
    fontSize: 16,
  },
  navGlyphActive: {
    color: Theme.colors.text.primary,
  },
  navLabel: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.secondary,
  },
  navLabelActive: {
    color: Theme.colors.text.primary,
  },
});
