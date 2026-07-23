import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import { AppScreen } from '../state/slices/navigationSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

interface AnalysisModule {
  id: string;
  title: string;
  description: string;
  glyph: string;
  targetScreen: AppScreen;
  available: boolean;
}

// Only one module ships today. This screen exists so more modules can be
// added later as entries here without touching navigation elsewhere.
const MODULES: AnalysisModule[] = [
  {
    id: 'three-expression',
    title: '3-Expression Face Reading',
    description: 'Capture Calm, Bright, and Deep expressions for your AI character reading.',
    glyph: '◐',
    targetScreen: 'capture',
    available: true,
  },
];

export default function AnalyzeScreen() {
  const goToScreen = useAppStore((s) => s.goToScreen);

  return (
    <View style={styles.container} testID="analyze-screen">
      <View style={styles.header}>
        <Text style={styles.title}>Analyze</Text>
        <Text style={styles.subtitle}>Choose a reading to run.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {MODULES.map((module, index) => (
          <FadeInView key={module.id} delay={index * 80}>
            <Pressable
              onPress={() => module.available && goToScreen(module.targetScreen)}
              accessibilityRole="button"
              accessibilityLabel={module.title}
              testID={`analyze-module-${module.id}`}
            >
              <GlassCard style={styles.moduleCard}>
                <View style={styles.moduleIcon}>
                  <Text style={styles.moduleGlyph}>{module.glyph}</Text>
                </View>
                <View style={styles.moduleTextBlock}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleDescription}>{module.description}</Text>
                </View>
                <Text style={styles.moduleChevron}>›</Text>
              </GlassCard>
            </Pressable>
          </FadeInView>
        ))}

        <FadeInView delay={MODULES.length * 80}>
          <GlassCard style={styles.comingSoonCard}>
            <Text style={styles.comingSoonText}>More reading modules are on the way ✦</Text>
          </GlassCard>
        </FadeInView>
      </ScrollView>

      <BottomNavBar active="analyze" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
    gap: 4,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.text.primary,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: 120,
    gap: Theme.spacing.sm,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  moduleIcon: {
    width: 44,
    height: 44,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(158, 41, 65, 0.25)',
  },
  moduleGlyph: {
    color: Theme.colors.accent.crimsonPrimary,
    fontSize: 22,
  },
  moduleTextBlock: {
    flex: 1,
    gap: 2,
  },
  moduleTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 16,
    color: Theme.colors.text.primary,
  },
  moduleDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
  moduleChevron: {
    color: Theme.colors.text.muted,
    fontSize: 20,
  },
  comingSoonCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  comingSoonText: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.muted,
  },
});
