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
  // instead of full paragraphs, capped at 3 (or 1 when a photo is also
  // included — see STORY_BADGE_LIMIT_WITH_PHOTO) so the fixed canvas
  // never has more content than it can guarantee room for.
  layout?: 'flexible' | 'story';
}

const STORY_BADGE_LIMIT = 3;
// A photo already claims a fixed chunk of the fixed 9:16 canvas — capping
// badges to 1 instead of 3 when one's present buys the hero text more
// guaranteed room, rather than relying on it "probably" fitting (see
// heroBody's numberOfLines below for the hard backstop either way).
const STORY_BADGE_LIMIT_WITH_PHOTO = 1;
// Hard caps, not estimates — a long hero_hook plus wrapped badges could
// still exceed the space actually left after a fixed-height photo even
// with generous layout math, and react-native-view-shot's captureRef only
// captures the card's own laid-out frame: anything that overflowed past
// it before was silently missing from the image, not just visually tight.
// numberOfLines truncates with an ellipsis instead — worse case is a
// clipped sentence, never vanished text.
const STORY_HERO_LINES_WITH_PHOTO = 3;
const STORY_HERO_LINES = 5;

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
    const badges = rest.slice(0, photo ? STORY_BADGE_LIMIT_WITH_PHOTO : STORY_BADGE_LIMIT);

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

        <View style={[styles.body, isStory && styles.bodyStory]}>
          {photo && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${photo}` }}
              style={[styles.photo, isStory && styles.photoStory]}
              resizeMode="cover"
              testID="share-card-photo"
            />
          )}
          {isStory ? (
            <>
              {hero && (
                <View style={styles.heroSection} testID="share-card-hero">
                  <Text style={[styles.heroTitle, { color: palette.accent }]}>{hero.title}</Text>
                  <Text style={styles.heroBody} numberOfLines={photo ? STORY_HERO_LINES_WITH_PHOTO : STORY_HERO_LINES}>
                    {hero.body}
                  </Text>
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
  // Bounds `body` to the rest of the fixed 9:16 canvas (see cardStory
  // below) so a flex:1 child like heroSection has real space to claim
  // instead of none — without this, `body` sized itself off its natural
  // content, which meant a photo (a full square) could push hero text
  // past the card's laid-out bounds. react-native-view-shot's captureRef
  // snapshots exactly that laid-out frame, so anything pushed past it was
  // silently cropped out of the resulting image rather than erroring —
  // "insta story + photo drops the text" (2026-08-15).
  bodyStory: {
    flex: 1,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
  },
  // A capped height instead of a full aspect-ratio square specifically in
  // story mode — the fixed 9:16 canvas has to fit branding, the photo,
  // the hero text, and up to 3 badge chips all at once, and a full square
  // photo (would be 360px on a 360px-wide card) alone left too little of
  // the fixed canvas for the rest.
  photoStory: {
    aspectRatio: undefined,
    height: 150,
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
  // overflow: 'hidden' is a hard backstop, not the primary fix (that's
  // bodyStory's flex-bounding plus heroBody's numberOfLines cap) — belt
  // and suspenders so a still-untested content combination clips at the
  // frame's edge at worst, rather than silently vanishing from the
  // captured image the way the pre-fix version did.
  cardStory: {
    height: (CARD_WIDTH * 16) / 9,
    overflow: 'hidden',
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
