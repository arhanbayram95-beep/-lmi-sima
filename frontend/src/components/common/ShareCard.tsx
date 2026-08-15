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
  // 'flexible' (default): height grows to fit however many sections are
  // selected — see the 2026-08-05 product decision below.
  // 'story': fixed 9:16, Instagram-Story-ready. The first selected section
  // (in practice: the module's archetype/vibe/work-archetype card, since
  // readingShareableSections always puts it first) becomes a big hero
  // treatment; everything else after it renders as compact badge chips
  // instead of full paragraphs, capped at 3 so the fixed canvas doesn't
  // overflow.
  layout?: 'flexible' | 'story';
}

const STORY_BADGE_LIMIT = 3;

// Vertical, story-ready card captured via react-native-view-shot (see
// RevealScreen). Rendered off-screen — never shown directly in the normal
// layout flow, only measured and snapshotted. 'flexible' layout height is
// intentionally not fixed to a 9:16 crop like the old single-headline
// version (2026-08-05 product decision) — the number of sections is
// entirely up to the user, so the card grows to fit them. 'story' brings
// the fixed 9:16 crop back as an explicit second option instead of
// reverting that decision for everyone.
const ShareCard = forwardRef<View, ShareCardProps>(
  ({ sections, photo, paletteId = DEFAULT_SHARE_PALETTE_ID, layout = 'flexible' }, ref) => {
    const palette = shareCardPalette(paletteId);
    const isStory = layout === 'story';
    const [hero, ...rest] = sections;
    const badges = rest.slice(0, STORY_BADGE_LIMIT);

    return (
      <View
        ref={ref}
        testID="share-card"
        style={[styles.card, isStory && styles.cardStory, { backgroundColor: palette.background }]}
        collapsable={false}
      >
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
          {isStory ? (
            <>
              {hero && (
                <View style={styles.heroSection} testID="share-card-hero">
                  <Text style={[styles.heroTitle, { color: palette.accent }]}>{hero.title}</Text>
                  <Text style={styles.heroBody}>{hero.body}</Text>
                </View>
              )}
              {badges.length > 0 && (
                <View style={styles.badgeRow}>
                  {badges.map((section) => (
                    <View key={section.id} style={[styles.storyBadge, { borderColor: palette.accent }]}>
                      <Text style={[styles.storyBadgeText, { color: palette.accent }]} numberOfLines={1}>
                        {section.title}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            sections.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.accent }]}>{section.title}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    );
  }
);

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
  // Fixed, not minHeight — the whole point of 'story' layout is a
  // guaranteed 9:16 canvas regardless of how much content is selected.
  cardStory: {
    height: (CARD_WIDTH * 16) / 9,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  heroTitle: {
    ...Theme.typography.labelSm,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  heroBody: {
    ...Theme.typography.headlineLg,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.4,
    color: Theme.colors.text.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 2 },
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
  },
  storyBadge: {
    borderWidth: 1,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    maxWidth: '100%',
  },
  storyBadgeText: {
    ...Theme.typography.labelSm,
    fontSize: 11,
  },
});
