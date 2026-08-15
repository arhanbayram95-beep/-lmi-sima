import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import FadeInView from '../components/common/FadeInView';
import GestureCardDeck from '../components/common/GestureCardDeck';
import MasterCard from '../components/common/MasterCard';
import {
  AdviceNote,
  AuraStat,
  ChecklistRows,
  GoldenRatioStat,
  IndustryPillsRow,
  MutedPillsRow,
  NameChip,
  RarityStat,
  ResonanceStat,
  StructuralDominanceStat,
  SynergyScoreDial,
} from '../components/common/MasterCardStats';
import PolarityMeterBar from '../components/common/PolarityMeterBar';
import PrimaryButton from '../components/common/PrimaryButton';
import { PhotoPageCard } from '../components/common/ReadingCards';
import ShareCard from '../components/common/ShareCard';
import ShareOptionsModal, { MAX_SELECTABLE_SECTIONS } from '../components/common/ShareOptionsModal';
import StoryProgressBar from '../components/common/StoryProgressBar';
import TapToRevealCard from '../components/common/TapToRevealCard';
import { PolarityMeter, ReadingResult, readingShareableSections } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { DEFAULT_SHARE_PALETTE_ID, SharePaletteId, Theme } from '../ui/theme';
import { playSwipeChime } from '../utils/sound';

type Translate = ReturnType<typeof useTranslation>;

function PolarityMeters({ meters }: { meters: PolarityMeter[] }) {
  return (
    <View style={styles.meterStack}>
      {meters.map((meter, index) => (
        <PolarityMeterBar
          key={index}
          leftTrait={meter.left_trait}
          leftPercent={meter.left_percent}
          rightTrait={meter.right_trait}
        />
      ))}
    </View>
  );
}

// One page per photo, then one deep master card per page, in the order
// each module's reading reads best: the captured photos first (each its
// own page — see PhotoPageCard's comment on why this isn't a nested
// sub-carousel), then the oracle-match hook, building to the richest
// Shadow Arcana card last. Every card is wrapped in TapToRevealCard's
// veil-then-flip ritual, with MasterCard rendering the shared narrative
// shape (hero_hook/anatomical_decoding/living_scenario/actionable_insight
// — identical across all three modules, see api/types.ts) plus a
// per-card statsSection built from MasterCardStats' small, focused
// pieces. Each module's shape is guaranteed by its own response schema —
// see backend readingSchema.ts. RevealScreen pages through this list one
// card at a time (see GestureCardDeck below) rather than a single long
// scroll.
function readingCards(reading: ReadingResult, images: string[], t: Translate): React.ReactNode[] {
  const photos = images.map((photo, i) => (
    <PhotoPageCard key={`photo-${i}`} photo={photo} testID={i === 0 ? 'reveal-photos' : undefined} />
  ));
  const tapHint = t('reveal.tapToUnveil');

  switch (reading.module) {
    case 'character_analysis': {
      const { oracle_match_card, sacred_anatomy_card, animal_totem_card, trait_symphony_card, shadow_arcana_card } = reading;
      return [
        ...photos,
        <TapToRevealCard key="oracle-match" icon="🎭" title={oracle_match_card.title} tapHint={tapHint} testID="oracle-match-card">
          <MasterCard
            icon="🎭"
            title={oracle_match_card.title}
            narrative={oracle_match_card}
            statsSection={
              <>
                <NameChip label={oracle_match_card.archetype_tag} />
                <ResonanceStat resonance={oracle_match_card.facial_landmark_resonance} />
                <AuraStat aura={oracle_match_card.aura} />
              </>
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="sacred-anatomy" icon="📐" title={sacred_anatomy_card.title} tapHint={tapHint} testID="sacred-anatomy-card">
          <MasterCard
            icon="📐"
            title={sacred_anatomy_card.title}
            narrative={sacred_anatomy_card}
            statsSection={
              <>
                <GoldenRatioStat shapeTag={sacred_anatomy_card.shape_tag} score={sacred_anatomy_card.golden_ratio_score} />
                <StructuralDominanceStat dominance={sacred_anatomy_card.structural_dominance} />
              </>
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="animal-totem" icon="🐾" title={animal_totem_card.title} tapHint={tapHint} testID="animal-totem-card">
          <MasterCard
            icon="🐾"
            title={animal_totem_card.title}
            narrative={animal_totem_card}
            statsSection={
              <>
                <NameChip label={animal_totem_card.spirit_animal} />
                <PolarityMeters meters={animal_totem_card.instinctual_radar} />
              </>
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="trait-symphony" icon="🎼" title={trait_symphony_card.title} tapHint={tapHint} testID="trait-symphony-card">
          <MasterCard
            icon="🎼"
            title={trait_symphony_card.title}
            narrative={trait_symphony_card}
            statsSection={
              <>
                <PolarityMeters meters={trait_symphony_card.polarity_meters} />
                <RarityStat rarity={trait_symphony_card.rarity_index} />
              </>
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="shadow-arcana" icon="🌑" title={shadow_arcana_card.title} tapHint={tapHint} testID="shadow-arcana-card">
          <MasterCard
            icon="🌑"
            title={shadow_arcana_card.title}
            narrative={shadow_arcana_card}
            mythicTale={shadow_arcana_card.mythic_tale}
            statsSection={
              <>
                <NameChip label={shadow_arcana_card.signature_catchphrase} />
                <MutedPillsRow pills={shadow_arcana_card.shadow_traits} testID="shadow-traits" />
                <AdviceNote text={shadow_arcana_card.life_advice} />
              </>
            }
          />
        </TapToRevealCard>,
      ];
    }
    case 'relationship_harmony': {
      const { bond_oracle_card, chemistry_geometry_card, instinctual_dynamics_card, bond_shadow_arcana_card } = reading;
      return [
        ...photos,
        <TapToRevealCard key="bond-oracle" icon="💞" title={bond_oracle_card.title} tapHint={tapHint} testID="bond-oracle-card">
          <MasterCard
            icon="💞"
            title={bond_oracle_card.title}
            narrative={bond_oracle_card}
            statsSection={
              <>
                <NameChip label={bond_oracle_card.bond_archetype_tag} />
                <ResonanceStat resonance={bond_oracle_card.bond_resonance} />
                <AuraStat aura={bond_oracle_card.aura} />
              </>
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="chemistry-geometry" icon="🔥" title={chemistry_geometry_card.title} tapHint={tapHint} testID="chemistry-geometry-card">
          <MasterCard
            icon="🔥"
            title={chemistry_geometry_card.title}
            narrative={chemistry_geometry_card}
            statsSection={
              <SynergyScoreDial
                overallScore={chemistry_geometry_card.synergy_score.overall_score}
                overallLabel={t('reveal.overallLabel')}
                metrics={chemistry_geometry_card.synergy_score.breakdown_metrics}
              />
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="instinctual-dynamics" icon="🌊" title={instinctual_dynamics_card.title} tapHint={tapHint} testID="instinctual-dynamics-card">
          <MasterCard
            icon="🌊"
            title={instinctual_dynamics_card.title}
            narrative={instinctual_dynamics_card}
            statsSection={<PolarityMeters meters={instinctual_dynamics_card.dynamics_radar} />}
          />
        </TapToRevealCard>,
        <TapToRevealCard key="bond-shadow-arcana" icon="🌑" title={bond_shadow_arcana_card.title} tapHint={tapHint} testID="bond-shadow-arcana-card">
          <MasterCard
            icon="🌑"
            title={bond_shadow_arcana_card.title}
            narrative={bond_shadow_arcana_card}
            mythicTale={bond_shadow_arcana_card.mythic_tale}
            statsSection={
              <>
                <NameChip label={bond_shadow_arcana_card.duo_catchphrase} />
                <MutedPillsRow pills={bond_shadow_arcana_card.shadow_traits} testID="shadow-traits" />
                <ChecklistRows items={bond_shadow_arcana_card.guidance_checklist} testID="guidance-checklist" />
              </>
            }
          />
        </TapToRevealCard>,
      ];
    }
    case 'career_path': {
      const { career_oracle_card, industry_geometry_card, career_trait_symphony_card, career_shadow_arcana_card } = reading;
      return [
        ...photos,
        <TapToRevealCard key="career-oracle" icon="💼" title={career_oracle_card.title} tapHint={tapHint} testID="career-oracle-card">
          <MasterCard
            icon="💼"
            title={career_oracle_card.title}
            narrative={career_oracle_card}
            statsSection={
              <>
                <NameChip label={career_oracle_card.work_archetype_tag} />
                <ResonanceStat resonance={career_oracle_card.career_resonance} />
                <AuraStat aura={career_oracle_card.aura} />
              </>
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="industry-geometry" icon="🧭" title={industry_geometry_card.title} tapHint={tapHint} testID="industry-geometry-card">
          <MasterCard
            icon="🧭"
            title={industry_geometry_card.title}
            narrative={industry_geometry_card}
            statsSection={
              <>
                <PolarityMeters meters={industry_geometry_card.work_style_radar} />
                <IndustryPillsRow pills={industry_geometry_card.top_industry_pills} />
              </>
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="career-trait-symphony" icon="🎼" title={career_trait_symphony_card.title} tapHint={tapHint} testID="career-trait-symphony-card">
          <MasterCard
            icon="🎼"
            title={career_trait_symphony_card.title}
            narrative={career_trait_symphony_card}
            statsSection={
              <>
                <PolarityMeters meters={career_trait_symphony_card.polarity_meters} />
                <RarityStat rarity={career_trait_symphony_card.rarity_index} />
              </>
            }
          />
        </TapToRevealCard>,
        <TapToRevealCard key="career-shadow-arcana" icon="🌑" title={career_shadow_arcana_card.title} tapHint={tapHint} testID="career-shadow-arcana-card">
          <MasterCard
            icon="🌑"
            title={career_shadow_arcana_card.title}
            narrative={career_shadow_arcana_card}
            mythicTale={career_shadow_arcana_card.mythic_tale}
            statsSection={
              <>
                <NameChip label={career_shadow_arcana_card.work_catchphrase} />
                <MutedPillsRow pills={career_shadow_arcana_card.shadow_traits} testID="shadow-traits" />
                <ChecklistRows items={career_shadow_arcana_card.role_recommendations} testID="role-recommendations" />
                <AdviceNote text={career_shadow_arcana_card.life_advice} />
              </>
            }
          />
        </TapToRevealCard>,
      ];
    }
  }
}

export default function RevealScreen() {
  const reading = useAppStore((s) => s.reading);
  const images = useAppStore((s) => s.images);
  const clearImages = useAppStore((s) => s.clearImages);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const t = useTranslation();
  const shareCardRef = useRef<View>(null);
  const insets = useSafeAreaInsets();
  const [pageIndex, setPageIndex] = useState(0);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [includePhotoInCard, setIncludePhotoInCard] = useState(false);
  const [selectedSectionIds, setSelectedSectionIds] = useState<Set<string>>(new Set());
  const [selectedPaletteId, setSelectedPaletteId] = useState<SharePaletteId>(DEFAULT_SHARE_PALETTE_ID);
  const [storyLayout, setStoryLayout] = useState(false);

  // The captured photos are still in memory when this screen mounts (never
  // persisted, per PROJECT_SPEC.md §3) — shown as the opening pages of the
  // card-by-card reveal below, then purged the moment the user leaves,
  // however they leave.
  useEffect(() => clearImages, [clearImages]);

  // Every section starts selected, up to MAX_SELECTABLE_SECTIONS — the
  // builder is an opt-out picker, not an opt-in one, so a user who never
  // opens it still gets a full-looking card, just not necessarily
  // *every* section for a 6-section module: capped the same as manual
  // selection is (see ShareOptionsModal), since an uncapped default was
  // exactly how a capture could still end up too tall to reliably render
  // even for someone who never touched the builder at all.
  // A fresh reading also always opens back on its first page/card.
  useEffect(() => {
    if (reading) {
      const ids = readingShareableSections(reading)
        .slice(0, MAX_SELECTABLE_SECTIONS)
        .map((section) => section.id);
      setSelectedSectionIds(new Set(ids));
    }
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

  // Same haptic treatment as a swipe (GestureCardDeck's own commitTo) —
  // the fallback arrow buttons are still a real way to change cards, not
  // just a decoration, so they shouldn't feel different from swiping.
  const goToPage = (target: number) => {
    const clamped = Math.max(0, Math.min(lastPageIndex, target));
    if (clamped === pageIndex) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (soundEnabled) playSwipeChime();
    if (clamped === lastPageIndex) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setPageIndex(clamped);
  };

  return (
    <View style={styles.container} testID="reveal-screen">
      <View style={styles.header}>
        <Text style={styles.title}>{t('reveal.title')}</Text>
        <StoryProgressBar count={cards.length} activeIndex={pageIndex} />
      </View>

      <GestureCardDeck index={pageIndex} onIndexChange={setPageIndex} style={styles.pager}>
        {cards.map((card, index) => (
          <ScrollView key={index} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
            <FadeInView delay={index === 0 ? 0 : 80}>{card}</FadeInView>
          </ScrollView>
        ))}
      </GestureCardDeck>

      {/* The deck above is swipe-driven now (GestureCardDeck) — this row is
          a deliberately subtle fallback, not the primary way to move
          between cards, for anyone who doesn't swipe (accessibility,
          screen readers, or just habit). Same testIDs/behavior as before
          so nothing about how tests exercise paging needed to change. */}
      <View style={styles.pageNav} testID="reveal-page-nav">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('reveal.previousCard')}
          accessibilityState={{ disabled: pageIndex === 0 }}
          disabled={pageIndex === 0}
          onPress={() => goToPage(pageIndex - 1)}
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
          onPress={() => goToPage(pageIndex + 1)}
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
          layout={storyLayout ? 'story' : 'flexible'}
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
        storyLayout={storyLayout}
        onStoryLayoutChange={setStoryLayout}
        onShareImage={handleShareImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  meterStack: {
    marginTop: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  header: {
    gap: Theme.spacing.sm,
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
  // Smaller and quieter than before (36px, solid border) — swiping is the
  // primary way to move between cards now (GestureCardDeck above), so this
  // row is a fallback, not something that should compete for attention.
  navArrow: {
    width: 28,
    height: 28,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  navArrowDisabled: {
    opacity: 0.25,
  },
  navArrowGlyph: {
    ...Theme.typography.headlineMd,
    fontSize: 17,
    lineHeight: 19,
    color: Theme.colors.text.muted,
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
