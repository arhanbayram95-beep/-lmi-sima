import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppLogo from '../components/common/AppLogo';
import GlassCard from '../components/common/GlassCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { Theme } from '../ui/theme';

const FEATURE_CARDS = [
  {
    title: 'Vibe & Temperament',
    body: 'Instant mood & energy check based on expression mapping.',
    glyph: '◐',
  },
  {
    title: 'Expression Dynamics',
    body: 'Micro-expression shifts tracked across your 3-shot session.',
    glyph: '⟡',
  },
  {
    title: 'Face Symmetry',
    body: 'Proportion & balance reading using Golden Ratio landmarks.',
    glyph: '▦',
  },
  {
    title: 'Daily Vibe Log',
    body: 'Track mood patterns over time with historical AI insights.',
    glyph: '✦',
  },
];

const NAV_ITEMS = [
  { key: 'analyze', label: 'Analyze', glyph: '◉' },
  { key: 'results', label: 'Results', glyph: '▤' },
  { key: 'settings', label: 'Settings', glyph: '⚙' },
] as const;

export default function MainMenuScreen() {
  const [activeNav, setActiveNav] = React.useState<(typeof NAV_ITEMS)[number]['key']>('analyze');

  return (
    <View style={styles.container} testID="main-menu-screen">
      <View style={styles.header}>
        <AppLogo />
        <View style={styles.headerRight}>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.heroCard}>
          <Text style={styles.heroTitle}>3-Expression Face Reading</Text>
          <Text style={styles.heroBody}>
            Capture Calm, Bright, and Deep expressions to reveal your character vibe.
          </Text>
          <PrimaryButton label="Start Analysis" onPress={() => {}} />
        </GlassCard>

        <View style={styles.grid}>
          {FEATURE_CARDS.map((card) => (
            <GlassCard key={card.title} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureTitle}>{card.title}</Text>
                <Text style={styles.featureGlyph}>{card.glyph}</Text>
              </View>
              <Text style={styles.featureBody}>{card.body}</Text>
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeNav;
          return (
            <Pressable
              key={item.key}
              onPress={() => setActiveNav(item.key)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  proBadge: {
    backgroundColor: Theme.colors.accent.crimsonPrimary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  proBadgeText: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: 120,
    gap: Theme.spacing.gutter,
  },
  heroCard: {
    gap: Theme.spacing.sm,
  },
  heroTitle: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.text.primary,
  },
  heroBody: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  grid: {
    gap: Theme.spacing.gutter,
  },
  featureCard: {
    gap: Theme.spacing.xs,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featureTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.text.primary,
  },
  featureGlyph: {
    color: Theme.colors.accent.crimsonPrimary,
    fontSize: 20,
  },
  featureBody: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
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
