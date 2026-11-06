import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import FadeInView from '../components/common/FadeInView';
import GestureCardDeck from '../components/common/GestureCardDeck';
import {
  AbilitiesAndGearCard,
  AbilityScoresCard,
  BackstoryCard,
  FeatureListCard,
  IdentityCard,
  StoryCard,
} from '../components/common/CharacterSheetCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { PhotoPageCard } from '../components/common/ReadingCards';
import ShareCard from '../components/common/ShareCard';
import ShareOptionsModal, { MAX_SELECTABLE_SECTIONS } from '../components/common/ShareOptionsModal';
import StoryProgressBar from '../components/common/StoryProgressBar';
import TapToRevealCard from '../components/common/TapToRevealCard';
import { CharacterSheet, ReadingResult, readingShareableSections } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { DEFAULT_SHARE_PALETTE_ID, SharePaletteId, Theme } from '../ui/theme';
import { playSwipeChime } from '../utils/sound';

type Translate = ReturnType<typeof useTranslation>;

// One page per photo, then the character sheet one section per page:
// identity first (the big reveal), building through stats, abilities and
// backstory to the mode's story last. Each page sits behind
// TapToRevealCard's veil-then-flip ritual. Shapes are guaranteed by each
// mode's response schema (backend readingSchema.ts).
function sheetPages(prefix: string, sheet: CharacterSheet, t: Translate, identityIcon: string): React.ReactNode[] {
  const tapHint = t('reveal.tapToUnveil');
  return [
    <TapToRevealCard key={`${prefix}-identity`} icon={identityIcon} title={sheet.name} tapHint={tapHint} testID={`${prefix}-identity-page`}>
      <IdentityCard sheet={sheet} icon={identityIcon} />
    </TapToRevealCard>,
    <TapToRevealCard key={`${prefix}-scores`} icon="🎲" title={t('sheet.abilityScores')} tapHint={tapHint} testID={`${prefix}-scores-page`}>
      <AbilityScoresCard sheet={sheet} />
    </TapToRevealCard>,
    <TapToRevealCard key={`${prefix}-abilities`} icon="✨" title={t('sheet.signatureAbilities')} tapHint={tapHint} testID={`${prefix}-abilities-page`}>
      <AbilitiesAndGearCard sheet={sheet} />
    </TapToRevealCard>,
    <TapToRevealCard key={`${prefix}-backstory`} icon="📜" title={t('sheet.backstory')} tapHint={tapHint} testID={`${prefix}-backstory-page`}>
      <BackstoryCard sheet={sheet} />
    </TapToRevealCard>,
  ];
}

function readingCards(reading: ReadingResult, images: string[], t: Translate): React.ReactNode[] {
  const photos = images.map((photo, i) => (
    <PhotoPageCard key={`photo-${i}`} photo={photo} testID={i === 0 ? 'reveal-photos' : undefined} />
  ));
  const tapHint = t('reveal.tapToUnveil');

  switch (reading.module) {
    case 'hero_sheet':
      return [
        ...photos,
        ...sheetPages('hero', reading.hero, t, '🛡️'),
        <TapToRevealCard key="quest-hook" icon="🗺️" title={reading.quest_hook.title} tapHint={tapHint} testID="quest-hook-page">
          <StoryCard icon="🗺️" story={reading.quest_hook} testID="quest-hook-card" />
        </TapToRevealCard>,
      ];
    case 'party_sheet':
      return [
        ...photos,
        ...reading.heroes.flatMap((hero, index) => sheetPages(`party-${index}`, hero, t, index === 0 ? '🛡️' : '⚔️')),
        <TapToRevealCard key="party-synergy" icon="🤝" title={reading.party_name} tapHint={tapHint} testID="party-synergy-page">
          <FeatureListCard
            icon="🤝"
            title={reading.party_name}
            testID="party-synergy-card"
            features={[reading.combo_move, { name: t('sheet.partyDynamic'), description: reading.party_dynamic }]}
          />
        </TapToRevealCard>,
        <TapToRevealCard key="shared-quest" icon="🗺️" title={reading.shared_quest.title} tapHint={tapHint} testID="shared-quest-page">
          <StoryCard icon="🗺️" story={reading.shared_quest} testID="shared-quest-card" />
        </TapToRevealCard>,
      ];
    case 'nemesis_sheet':
      return [
        ...photos,
        ...sheetPages('villain', reading.villain, t, '😈'),
        <TapToRevealCard key="evil-scheme" icon="🕯️" title={t('sheet.evilScheme')} tapHint={tapHint} testID="evil-scheme-page">
          <FeatureListCard
            icon="🕯️"
            title={t('sheet.evilScheme')}
            testID="evil-scheme-card"
            features={[
              { name: t('sheet.evilScheme'), description: reading.evil_scheme },
              { name: t('sheet.lair'), description: reading.lair },
              { name: t('sheet.weakness'), description: reading.comedic_weakness },
            ]}
          />
        </TapToRevealCard>,
        <TapToRevealCard key="showdown" icon="⚔️" title={reading.showdown.title} tapHint={tapHint} testID="showdown-page">
          <StoryCard icon="⚔️" story={reading.showdown} testID="showdown-card" />
        </TapToRevealCard>,
      ];
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
