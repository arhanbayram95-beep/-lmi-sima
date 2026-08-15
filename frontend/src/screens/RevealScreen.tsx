import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import FadeInView from '../components/common/FadeInView';
import PrimaryButton from '../components/common/PrimaryButton';
import ShareCard from '../components/common/ShareCard';
import ShareOptionsModal from '../components/common/ShareOptionsModal';
import SwipeablePager from '../components/common/SwipeablePager';
import {
  BadgeSummaryCard,
  ChecklistCard,
  HighlightCard,
  MetadataBadgeRow,
  PhotoPageCard,
  PillsCard,
  ReadingScoreCard,
} from '../components/common/ReadingCards';
import { ReadingResult, readingShareableSections } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { DEFAULT_SHARE_PALETTE_ID, SharePaletteId, Theme } from '../ui/theme';

type Translate = ReturnType<typeof useTranslation>;

// One page per photo, then one card stack per module, in the order the
// reading reads best: the captured photos first (each its own page — see
// PhotoPageCard's comment on why this isn't a nested sub-carousel), then
// the hook (badge tag), then progressively more detail as it goes — score
// only survives for relationship_harmony now (see systemPrompt.ts). Each
// module's shape is guaranteed by its own response schema — see backend
// readingSchema.ts. RevealScreen pages through this list one card at a
// time (see SwipeablePager below) rather than a single long scroll.
function readingCards(reading: ReadingResult, images: string[], t: Translate): React.ReactNode[] {
  const photos = images.map((photo, i) => (
    <PhotoPageCard key={`photo-${i}`} photo={photo} testID={i === 0 ? 'reveal-photos' : undefined} />
  ));

  switch (reading.module) {
    case 'character_analysis':
      return [
        ...photos,
        <BadgeSummaryCard key="archetype" card={reading.archetype_card} icon="🎭" testID="archetype-card" />,
        <BadgeSummaryCard key="catchphrase" card={reading.catchphrase_card} icon="💬" testID="catchphrase-card" />,
        <BadgeSummaryCard
          key="facial-structure"
          card={{
            title: reading.facial_structure_card.title,
            badge_tag: reading.facial_structure_card.shape_tag,
            summary: reading.facial_structure_card.description,
          }}
          icon="📐"
          testID="facial-structure-card"
        />,
        <HighlightCard
          key="spirit-animal"
          title={reading.spirit_animal_card.title}
          icon="🐾"
          name={reading.spirit_animal_card.animal}
          description={reading.spirit_animal_card.description}
          tapHint={t('reveal.tapToReveal')}
          testID="spirit-animal-card"
        />,
        <PillsCard
          key="traits"
          title={reading.traits_card.title}
          icon="✨"
          testID="traits-card"
          groups={[
            { label: t('reveal.strengths'), pills: reading.traits_card.strength_pills },
            { label: t('reveal.growthEdges'), pills: reading.traits_card.growth_pills, tone: 'caution' },
          ]}
        >
          <MetadataBadgeRow badges={reading.traits_card.metadata_badges} />
        </PillsCard>,
        <HighlightCard
          key="celebrity"
          title={reading.celebrity_match_card.title}
          icon="⭐"
          name={reading.celebrity_match_card.match_name}
          description={reading.celebrity_match_card.match_description}
          tapHint={t('reveal.tapToReveal')}
          testID="celebrity-card"
        />,
      ];
    case 'relationship_harmony':
      return [
        ...photos,
        <BadgeSummaryCard key="vibe" card={reading.vibe_card} icon="💞" testID="archetype-card" />,
        <BadgeSummaryCard key="catchphrase" card={reading.catchphrase_card} icon="💬" testID="catchphrase-card" />,
        <ReadingScoreCard
          key="score"
          card={reading.chemistry_score_card}
          overallLabel={t('reveal.overallLabel')}
          icon="🔥"
          testID="score-card"
        />,
        <PillsCard
          key="dynamics"
          title={reading.dynamics_card.title}
          icon="🌊"
          testID="dynamics-card"
          groups={[
            { label: t('reveal.bestChemistry'), pills: reading.dynamics_card.best_chemistry_pills },
            { label: t('reveal.vibesToAvoid'), pills: reading.dynamics_card.vibes_to_avoid_pills, tone: 'caution' },
          ]}
        />,
        <ChecklistCard
          key="guidance"
          title={reading.guidance_card.title}
          icon="✅"
          items={reading.guidance_card.checklist_items}
          testID="checklist-card"
        />,
      ];
    case 'career_path':
      return [
        ...photos,
        <BadgeSummaryCard key="work" card={reading.work_archetype_card} icon="💼" testID="archetype-card" />,
        <BadgeSummaryCard key="catchphrase" card={reading.catchphrase_card} icon="💬" testID="catchphrase-card" />,
        <PillsCard
          key="domains"
          title={reading.domains_card.title}
          icon="🧭"
          testID="domains-card"
          groups={[{ pills: reading.domains_card.top_industry_pills }]}
        />,
        <PillsCard
          key="strengths-growth"
          title={reading.strengths_growth_card.title}
          icon="⚖️"
          testID="strengths-growth-card"
          groups={[
            { label: t('reveal.strengths'), pills: reading.strengths_growth_card.strength_pills },
            { label: t('reveal.growthEdges'), pills: reading.strengths_growth_card.growth_pills, tone: 'caution' },
          ]}
        />,
        <ChecklistCard
          key="roles"
          title={reading.recommendations_card.title}
          icon="✅"
          items={reading.recommendations_card.checklist_items}
          testID="checklist-card"
        />,
      ];
  }
}

export default function RevealScreen() {
  const reading = useAppStore((s) => s.reading);
  const images = useAppStore((s) => s.images);
  const clearImages = useAppStore((s) => s.clearImages);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();
  const shareCardRef = useRef<View>(null);
  const insets = useSafeAreaInsets();
  const [pageIndex, setPageIndex] = useState(0);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [includePhotoInCard, setIncludePhotoInCard] = useState(false);
  const [selectedSectionIds, setSelectedSectionIds] = useState<Set<string>>(new Set());
  const [selectedPaletteId, setSelectedPaletteId] = useState<SharePaletteId>(DEFAULT_SHARE_PALETTE_ID);

  // The captured photos are still in memory when this screen mounts (never
  // persisted, per PROJECT_SPEC.md §3) — shown as the opening pages of the
  // card-by-card reveal below, then purged the moment the user leaves,
  // however they leave.
  useEffect(() => clearImages, [clearImages]);

  // Every section starts selected — the builder is an opt-out picker, not
  // an opt-in one, so a user who never opens it still gets the full card.
  // A fresh reading also always opens back on its first page/card.
  useEffect(() => {
    if (reading) setSelectedSectionIds(new Set(readingShareableSections(reading).map((section) => section.id)));
    setPageIndex(0);
  }, [reading]);

  // The off-screen ShareCard below already re-renders with the current
  // includePhotoInCard/images/palette state, so capturing it here always
  // reflects whatever the user picked in ShareOptionsModal — no extra
  // plumbing needed between the builder and the capture.
  //
  // React Native's built-in Share.share only honors its `url` field on
  // iOS -- on Android it's silently dropped, so the OS share sheet still
  // opens (it has no way to know the intent is empty) but carries neither
  // a message nor an attachment, and the receiving app (WhatsApp, etc.)
  // rejects it as an empty message. expo-sharing's shareAsync is the
  // correct cross-platform way to actually attach a local image file.
  const handleShareImage = async () => {
    if (!shareCardRef.current) return;
    try {
      const uri = await captureRef(shareCardRef, { format: 'png', quality: 0.9 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t('share.optionImage.title') });
      }
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

  // Recomputed on every render rather than memoized — cheap pure functions
  // over already-fetched data, not worth the hook overhead (see CLAUDE.md
  // "don't add complexity beyond what the task requires").
  const cards = readingCards(reading, images, t);
  const lastPageIndex = cards.length - 1;

  return (
    <View style={styles.container} testID="reveal-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('reveal.title')}</Text>
      </View>

      <SwipeablePager index={pageIndex} onIndexChange={setPageIndex} style={styles.pager}>
        {cards.map((card, index) => (
          <ScrollView key={index} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
            <FadeInView delay={index === 0 ? 0 : 80}>{card}</FadeInView>
          </ScrollView>
        ))}
      </SwipeablePager>

      <View style={styles.pageNav} testID="reveal-page-nav">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('reveal.previousCard')}
          accessibilityState={{ disabled: pageIndex === 0 }}
          disabled={pageIndex === 0}
          onPress={() => setPageIndex((current) => Math.max(0, current - 1))}
          style={[styles.navArrow, pageIndex === 0 && styles.navArrowDisabled]}
          testID="reveal-page-prev"
        >
          <Text style={styles.navArrowGlyph}>‹</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('reveal.nextCard')}
          accessibilityState={{ disabled: pageIndex === lastPageIndex }}
          disabled={pageIndex === lastPageIndex}
          onPress={() => setPageIndex((current) => Math.min(lastPageIndex, current + 1))}
          style={[styles.navArrow, pageIndex === lastPageIndex && styles.navArrowDisabled]}
          testID="reveal-page-next"
        >
          <Text style={styles.navArrowGlyph}>›</Text>
        </Pressable>
      </View>

      <View style={[styles.footer, { paddingBottom: Theme.spacing.sm + insets.bottom }]}>
        <PrimaryButton
          label={t('reveal.shareButton')}
          variant="secondary"
          flow
          icon="⤴"
          onPress={() => setShareOptionsVisible(true)}
          testID="share-reading-button"
        />
        <PrimaryButton label={t('reveal.doneButton')} flow icon="✓" onPress={() => goToScreen('review')} />
      </View>

      <View style={styles.offscreen} pointerEvents="none">
        <ShareCard
          ref={shareCardRef}
          sections={readingShareableSections(reading).filter((section) => selectedSectionIds.has(section.id))}
          photo={includePhotoInCard ? images[0] : undefined}
          paletteId={selectedPaletteId}
        />
      </View>

      <ShareOptionsModal
        visible={shareOptionsVisible}
        onClose={() => setShareOptionsVisible(false)}
        reading={reading}
        sections={readingShareableSections(reading)}
        hasPhoto={images.length > 0}
        includePhoto={includePhotoInCard}
        onIncludePhotoChange={setIncludePhotoInCard}
        selectedSectionIds={selectedSectionIds}
        onSelectedSectionIdsChange={setSelectedSectionIds}
        selectedPaletteId={selectedPaletteId}
        onSelectedPaletteIdChange={setSelectedPaletteId}
        onShareImage={handleShareImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
  },
  // Fills the space between the header and the page-nav/disclaimer/action
  // footer below — each child page is its own vertical ScrollView so a
  // card taller than the available height still scrolls, independent of
  // the horizontal swipe between cards.
  pager: {
    flex: 1,
  },
  // Tighter than Theme.spacing.containerPadding (20) — the reveal cards
  // read bigger and closer to the design_examples reference with less
  // margin eating into their width.
  pageContent: {
    paddingHorizontal: 8,
    paddingTop: Theme.spacing.xs,
    paddingBottom: Theme.spacing.md,
  },
  pageNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Wider than the old arrow-counter-arrow gap (spacing.sm) — with
    // nothing between them now, the two arrows need real separation of
    // their own or they read as one cramped control instead of two.
    gap: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xs,
  },
  navArrow: {
    width: 36,
    height: 36,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface.glassBackground,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
  },
  navArrowDisabled: {
    opacity: 0.3,
  },
  navArrowGlyph: {
    ...Theme.typography.headlineMd,
    fontSize: 20,
    lineHeight: 22,
    color: Theme.colors.accent.goldSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  offscreen: {
    position: 'absolute',
    top: 0,
    left: -9999,
  },
});
