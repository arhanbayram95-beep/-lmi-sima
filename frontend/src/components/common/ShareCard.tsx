import React, { forwardRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ShareableSection } from '../../api/types';
import { DEFAULT_SHARE_PALETTE_ID, shareCardPalette, SharePaletteId, Theme } from '../../ui/theme';
import AppLogo from './AppLogo';

interface ShareCardProps {
  // Already filtered to whatever the user picked in the share card builder
  // (see ShareOptionsModal) — this component doesn't know or care which
  // module produced them, it just lays out whatever it's handed. An empty
  // selection still renders a valid (if sparse) card rather than erroring.
  sections: ShareableSection[];
  // Base64 photo, opt-in only — the reading itself never requires a photo
  // on the card, this is purely a user preference for a more personal
  // share.
  photo?: string;
  // Which of the locked SHARE_CARD_PALETTES (see theme.ts) the user picked
  // in the builder. Defaults to the app's own crimson-on-obsidian look.
  paletteId?: SharePaletteId;
}

// Vertical, story-ready card captured via react-native-view-shot (see
// RevealScreen). Rendered off-screen — never shown directly in the normal
// layout flow, only measured and snapshotted. Height is intentionally not
// fixed to a 9:16 crop like the old single-headline version — the number of
// sections is entirely up to the user, so the card grows to fit them.
const ShareCard = forwardRef<View, ShareCardProps>(({ sections, photo, paletteId = DEFAULT_SHARE_PALETTE_ID }, ref) => {
  const palette = shareCardPalette(paletteId);

  return (
    <View ref={ref} testID="share-card" style={[styles.card, { backgroundColor: palette.background }]} collapsable={false}>
      <View style={styles.brand}>
        <AppLogo showWordmark />
      </View>

      <View style={styles.body}>
        {photo && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${photo}` }}
            style={styles.photo}
            resizeMode="cover"
            testID="share-card-photo"
          />
        )}
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: palette.accent }]}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

ShareCard.displayName = 'ShareCard';
export default ShareCard;

const CARD_WIDTH = 360;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    minHeight: (CARD_WIDTH * 16) / 9,
    backgroundColor: Theme.colors.background.start,
    padding: Theme.spacing.lg,
    justifyContent: 'space-between',
    gap: Theme.spacing.lg,
  },
  brand: {
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  body: {
    gap: Theme.spacing.lg,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
  },
  section: {
    gap: Theme.spacing.xs,
  },
  sectionTitle: {
    ...Theme.typography.headlineMd,
    fontSize: 18,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  sectionBody: {
    ...Theme.typography.bodyLg,
    fontSize: 16,
    color: Theme.colors.text.primary,
    textAlign: 'center',
  },
});
