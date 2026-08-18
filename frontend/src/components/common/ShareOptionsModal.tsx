import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { readingBadgeCard, ReadingResult, ShareableSection } from '../../api/types';
import { useTranslation } from '../../i18n/useTranslation';
import { SHARE_CARD_PALETTES, SharePaletteId, Theme } from '../../ui/theme';
import { getStoreListingUrl } from '../../utils/storeLinks';
import AnimatedCheckbox from './AnimatedCheckbox';
import PrimaryButton from './PrimaryButton';

// The flexible-layout ShareCard has no max height — every selected section
// stacks as a full paragraph block. Product report (2026-08-15): with a
// photo plus most/all of a 5-6-section module selected, the resulting
// off-screen view gets tall enough that react-native-view-shot's capture
// sometimes silently fails or comes back missing content ("insights"
// dropped from the shared image) rather than throwing a catchable error.
// Capping selection is the fix, not detecting the failure after the fact.
export const MAX_SELECTABLE_SECTIONS = 5;

interface ShareOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  reading: ReadingResult;
  sections: ShareableSection[];
  hasPhoto: boolean;
  includePhoto: boolean;
  onIncludePhotoChange: (value: boolean) => void;
  selectedSectionIds: Set<string>;
  onSelectedSectionIdsChange: (ids: Set<string>) => void;
  selectedPaletteId: SharePaletteId;
  onSelectedPaletteIdChange: (id: SharePaletteId) => void;
  storyLayout: boolean;
  onStoryLayoutChange: (value: boolean) => void;
  // The image-card path still needs the parent's off-screen ShareCard +
  // view-shot ref (see RevealScreen) — this modal only decides *what* goes
  // on the card, not how it's captured.
  onShareImage: () => void;
}

// One tappable swatch per SHARE_CARD_PALETTES entry (theme.ts) — a radio
// selection (exactly one active at a time), not a checkbox list like the
// section picklist below it.
function PaletteSwatch({
  paletteId,
  selected,
  onSelect,
}: {
  paletteId: SharePaletteId;
  selected: boolean;
  onSelect: () => void;
}) {
  const palette = SHARE_CARD_PALETTES.find((p) => p.id === paletteId)!;
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={palette.name}
      hitSlop={6}
      testID={`share-palette-${paletteId}`}
      style={styles.swatchWrap}
    >
      <View style={styles.swatchStack}>
        {/* An actual circular ring behind the swatch, not a shadowRadius/
            shadowOpacity glow — RN's shadow rasterizes to the view's
            rectangular layer bounds, which on a circular swatch reads as a
            soft rounded-*square* halo rather than a clean circular glow
            (product feedback: "looks cheesy... as it is a square"). A real
            circle sidesteps that platform quirk entirely instead of
            fighting it. */}
        {selected && <View style={[styles.swatchGlow, { backgroundColor: palette.accent }]} pointerEvents="none" />}
        <View
          style={[
            styles.swatch,
            { backgroundColor: palette.background, borderColor: palette.accent },
            selected && styles.swatchSelected,
          ]}
        >
          {selected && <Text style={[styles.swatchCheck, { color: palette.accent }]}>✓</Text>}
        </View>
      </View>
      {/* Nine options now share only 3 accent colors between them — at
          this size two sharing an accent can look near-identical as a
          bare circle, so the name (visible on the full card even when the
          swatch alone isn't enough) lets someone pick by that instead. */}
      <Text
        style={[styles.swatchLabel, selected && { color: palette.accent }]}
        numberOfLines={1}
      >
        {palette.name}
      </Text>
    </Pressable>
  );
}

function ShareOptionRow({
  icon,
  title,
  subtitle,
  onPress,
  testID,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable style={styles.optionRow} onPress={onPress} accessibilityRole="button" testID={testID}>
      <Text style={styles.optionIcon}>{icon}</Text>
      <View style={styles.optionTextBlock}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

export default function ShareOptionsModal({
  visible,
  onClose,
  reading,
  sections,
  hasPhoto,
  includePhoto,
  onIncludePhotoChange,
  selectedSectionIds,
  onSelectedSectionIdsChange,
  selectedPaletteId,
  onSelectedPaletteIdChange,
  storyLayout,
  onStoryLayoutChange,
  onShareImage,
}: ShareOptionsModalProps) {
  const t = useTranslation();
  const [mode, setMode] = useState<'menu' | 'builder'>('menu');

  const close = () => {
    setMode('menu');
    onClose();
  };

  const toggleSection = (id: string) => {
    const next = new Set(selectedSectionIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      if (next.size >= MAX_SELECTABLE_SECTIONS) return;
      next.add(id);
    }
    onSelectedSectionIdsChange(next);
  };

  // Pulls in the next two cards after the badge (every module's first
  // section duplicates the badge/summary already shown — see
  // readingShareableSections) so the shared text carries real substance
  // instead of just the headline tag.
  const buildShareText = () => {
    const badge = readingBadgeCard(reading);
    const highlights = sections
      .slice(1, 3)
      .map((section) => `✦ ${section.title}: ${section.body}`)
      .join('\n');
    return t('share.shareTextTemplate', {
      badge: badge.badge_tag,
      summary: badge.summary,
      details: highlights ? `${highlights}\n\n` : '',
      link: `\n\n${getStoreListingUrl()}`,
    });
  };

  const handleShareImage = () => {
    close();
    onShareImage();
  };

  const handleShareText = async () => {
    close();
    try {
      await Share.share({ message: buildShareText() });
    } catch {
      // Sharing is a nice-to-have — never block the reveal flow on failure.
    }
  };

  const handleCopyText = async () => {
    await Clipboard.setStringAsync(buildShareText());
    close();
    Alert.alert(t('share.copiedTitle'), t('share.copiedBody'));
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID="share-options-modal">
          {mode === 'menu' ? (
            <>
              <Text style={styles.title}>{t('share.modalTitle')}</Text>
              <View style={styles.options}>
                <ShareOptionRow
                  icon="🖼️"
                  title={t('share.optionImage.title')}
                  subtitle={t('share.optionImage.subtitle')}
                  onPress={() => setMode('builder')}
                  testID="share-option-image"
                />
                <ShareOptionRow
                  icon="💬"
                  title={t('share.optionText.title')}
                  subtitle={t('share.optionText.subtitle')}
                  onPress={handleShareText}
                  testID="share-option-text"
                />
                <ShareOptionRow
                  icon="📋"
                  title={t('share.optionCopy.title')}
                  subtitle={t('share.optionCopy.subtitle')}
                  onPress={handleCopyText}
                  testID="share-option-copy"
                />
              </View>
              <PrimaryButton label={t('common.close')} variant="secondary" onPress={close} testID="share-options-close" />
            </>
          ) : (
            <>
              <Text style={styles.title}>{t('share.builder.title')}</Text>
              <Text style={styles.builderSubtitle}>{t('share.builder.subtitle')}</Text>

              {hasPhoto && (
                <AnimatedCheckbox
                  checked={includePhoto}
                  onToggle={() => onIncludePhotoChange(!includePhoto)}
                  label={t('share.includePhoto')}
                  // Photo and text sections are mutually exclusive, not
                  // just discouraged — the two together needed a stack of
                  // hard caps (badge/line limits, overflow:hidden) to keep
                  // from silently clipping content out of the captured
                  // image (2026-08-15/16), and product decided the
                  // combination just isn't worth offering as a choice at
                  // all. Disabling one while the other is active blocks it
                  // outright rather than letting it be picked and then
                  // reactively clearing something.
                  disabled={!includePhoto && selectedSectionIds.size > 0}
                  testID="share-include-photo-checkbox"
                />
              )}

              <AnimatedCheckbox
                checked={storyLayout}
                onToggle={() => onStoryLayoutChange(!storyLayout)}
                label={t('share.storyFormat')}
                testID="share-story-format-checkbox"
              />

              <View style={styles.paletteBlock}>
                <Text style={styles.groupLabel}>{t('share.builder.colorLabel')}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.paletteRow}
                  accessibilityRole="radiogroup"
                  testID="share-palette-row"
                >
                  {SHARE_CARD_PALETTES.map((palette) => (
                    <PaletteSwatch
                      key={palette.id}
                      paletteId={palette.id}
                      selected={selectedPaletteId === palette.id}
                      onSelect={() => onSelectedPaletteIdChange(palette.id)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.sectionListHeader}>
                <Text style={styles.groupLabel}>{t('share.builder.sectionsLabel')}</Text>
                <Text style={styles.sectionCapHint}>
                  {selectedSectionIds.size}/{MAX_SELECTABLE_SECTIONS}
                </Text>
              </View>
              <View style={styles.sectionList}>
                {sections.map((section) => {
                  const checked = selectedSectionIds.has(section.id);
                  // Same mutual-exclusivity rule as the photo checkbox
                  // above, plus the pre-existing section cap.
                  const disabled =
                    !checked && (includePhoto || selectedSectionIds.size >= MAX_SELECTABLE_SECTIONS);
                  return (
                    <AnimatedCheckbox
                      key={section.id}
                      checked={checked}
                      onToggle={() => toggleSection(section.id)}
                      label={section.title}
                      disabled={disabled}
                      testID={`share-section-${section.id}`}
                    />
                  );
                })}
              </View>

              <PrimaryButton
                label={t('share.builder.createButton')}
                onPress={handleShareImage}
                disabled={selectedSectionIds.size === 0 && !includePhoto}
                testID="share-builder-create"
              />
              <PrimaryButton
                label={t('share.builder.back')}
                variant="secondary"
                onPress={() => setMode('menu')}
                testID="share-builder-back"
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 7, 27, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.containerPadding,
  },
  sheet: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: Theme.colors.background.middle,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  title: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  builderSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: -Theme.spacing.sm,
  },
  options: {
    gap: Theme.spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
  },
  optionIcon: {
    fontSize: 26,
  },
  optionTextBlock: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  optionSubtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 12,
    color: Theme.colors.text.secondary,
  },
  sectionListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCapHint: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
  },
  sectionList: {
    gap: Theme.spacing.sm,
  },
  paletteBlock: {
    gap: Theme.spacing.xs,
  },
  groupLabel: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // A horizontal slider, not a wrapped grid — product feedback (2026-08-15):
  // 9 palettes at 56px each wrapped into 3 stacked rows read as too crowded
  // inside an already content-heavy builder sheet. A single swipeable row
  // keeps every option reachable without eating three rows of vertical
  // space the section picklist below it also needs.
  paletteRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    paddingVertical: 2,
  },
  swatchWrap: {
    alignItems: 'center',
    gap: 4,
    width: 64,
  },
  swatchStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: Theme.radius.full,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // A real circle, not a CSS shadow — see the comment at its usage above.
  // Sized a little larger than the swatch and centered behind it via
  // absolute positioning, so it reads as a soft ring rather than a solid
  // halo (low opacity does that job instead of a shadow's blur falloff).
  // Tightened and dimmed (2026-08-19 product feedback: "minimize the
  // glow") — a smaller radius past the swatch's own edge plus a lower
  // opacity than the original pass reads as a subtle accent instead of a
  // bright halo.
  swatchGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: Theme.radius.full,
    opacity: 0.18,
  },
  // Bigger, bolder selected state than a small centered dot — a full
  // checkmark plus a stronger glow and a slight scale-up, so the active
  // theme choice reads clearly at a glance instead of blending into the
  // row (product feedback: the swatches felt too quiet to register as a
  // real choice).
  swatchSelected: {
    transform: [{ scale: 1.1 }],
  },
  swatchCheck: {
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  swatchLabel: {
    ...Theme.typography.labelSm,
    fontSize: 10,
    color: Theme.colors.text.muted,
  },
});
