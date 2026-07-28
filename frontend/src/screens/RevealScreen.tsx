import React, { useEffect, useRef } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import DisclaimerFooter from '../components/common/DisclaimerFooter';
import FadeInView from '../components/common/FadeInView';
import PrimaryButton from '../components/common/PrimaryButton';
import ShareCard from '../components/common/ShareCard';
import {
  BadgeSummaryCard,
  CelebrityMatchCard,
  ChecklistCard,
  MetadataBadgeRow,
  PillsCard,
  ReadingScoreCard,
} from '../components/common/ReadingCards';
import { ReadingResult } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

type Translate = ReturnType<typeof useTranslation>;

// One card stack per module, in the order the reading reads best: the hook
// (badge tag), then the score, then the detail. Each module's shape is
// guaranteed by its own response schema — see backend readingSchema.ts.
function readingCards(reading: ReadingResult, t: Translate): React.ReactNode[] {
  switch (reading.module) {
    case 'character_analysis':
      return [
        <BadgeSummaryCard key="archetype" card={reading.archetype_card} testID="archetype-card" />,
        <ReadingScoreCard
          key="score"
          card={reading.temperament_score_card}
          overallLabel={t('reveal.overallLabel')}
          testID="score-card"
        />,
        <PillsCard
          key="traits"
          title={reading.traits_card.title}
          testID="traits-card"
          groups={[
            { label: t('reveal.strengths'), pills: reading.traits_card.strength_pills },
            { label: t('reveal.growthEdges'), pills: reading.traits_card.growth_pills, tone: 'caution' },
          ]}
        >
          <MetadataBadgeRow badges={reading.traits_card.metadata_badges} />
        </PillsCard>,
        <CelebrityMatchCard
          key="celebrity"
          title={reading.celebrity_match_card.title}
          name={reading.celebrity_match_card.match_name}
          description={reading.celebrity_match_card.match_description}
          testID="celebrity-card"
        />,
      ];
    case 'relationship_harmony':
      return [
        <BadgeSummaryCard key="vibe" card={reading.vibe_card} testID="archetype-card" />,
        <ReadingScoreCard
          key="score"
          card={reading.chemistry_score_card}
          overallLabel={t('reveal.overallLabel')}
          testID="score-card"
        />,
        <PillsCard
          key="dynamics"
          title={reading.dynamics_card.title}
          testID="dynamics-card"
          groups={[
            { label: t('reveal.bestChemistry'), pills: reading.dynamics_card.best_chemistry_pills },
            { label: t('reveal.vibesToAvoid'), pills: reading.dynamics_card.vibes_to_avoid_pills, tone: 'caution' },
          ]}
        />,
        <ChecklistCard
          key="guidance"
          title={reading.guidance_card.title}
          items={reading.guidance_card.checklist_items}
          testID="checklist-card"
        />,
      ];
    case 'career_path':
      return [
        <BadgeSummaryCard key="work" card={reading.work_archetype_card} testID="archetype-card" />,
        <ReadingScoreCard
          key="score"
          card={reading.suitability_score_card}
          overallLabel={t('reveal.overallLabel')}
          testID="score-card"
        />,
        <PillsCard
          key="domains"
          title={reading.domains_card.title}
          testID="domains-card"
          groups={[{ pills: reading.domains_card.top_industry_pills }]}
        />,
        <ChecklistCard
          key="roles"
          title={reading.recommendations_card.title}
          items={reading.recommendations_card.checklist_items}
          testID="checklist-card"
        />,
      ];
  }
}

export default function RevealScreen() {
  const reading = useAppStore((s) => s.reading);
  const clearImages = useAppStore((s) => s.clearImages);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();
  const shareCardRef = useRef<View>(null);

  // The card stack no longer shows the captured photos, but they are still
  // in memory when this screen mounts (never persisted, per PROJECT_SPEC.md
  // §3) — purged the moment the user leaves, however they leave.
  useEffect(() => clearImages, [clearImages]);

  const handleShare = async () => {
    if (!shareCardRef.current) return;
    try {
      const uri = await captureRef(shareCardRef, { format: 'png', quality: 0.9 });
      await Share.share({ url: uri });
    } catch {
      // Sharing is a nice-to-have — never block the reveal flow on failure.
    }
  };

  if (!reading) {
    return (
      <View style={styles.container} testID="reveal-screen">
        <PrimaryButton label={t('reveal.doneButton')} onPress={() => goToScreen('review')} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="reveal-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('reveal.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {readingCards(reading, t).map((card, index) => (
          <FadeInView key={index} delay={index * 70}>
            {card}
          </FadeInView>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={t('reveal.shareButton')} variant="secondary" onPress={handleShare} testID="share-reading-button" />
        <PrimaryButton label={t('reveal.doneButton')} onPress={() => goToScreen('review')} />
        <DisclaimerFooter />
      </View>

      <View style={styles.offscreen} pointerEvents="none">
        <ShareCard ref={shareCardRef} reading={reading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  footer: {
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  offscreen: {
    position: 'absolute',
    top: 0,
    left: -9999,
  },
});
