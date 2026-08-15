import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SHARE_CARD_PALETTES } from '../../ui/theme';
import { Theme } from '../../ui/theme';

// Deterministic, not random — a fixed seed (e.g. a card's own badge_tag)
// always produces the same badge on re-render/re-navigation instead of
// flickering a new one every time, and two different readings still land
// on different bands. This is explicitly a playful flourish, not a real
// statistic: there's no population of other users' readings anywhere in
// this app to compute an actual percentile against, and the copy doesn't
// claim otherwise ("vibe" framing, same register as the rest of the
// reading — see CLAUDE.md's Entertainment Framing).
function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function cardRarity(seed: string): { percent: number; auraName: string } {
  const hash = hashSeed(seed);
  const percent = 1 + (hash % 20);
  const auraName = SHARE_CARD_PALETTES[hash % SHARE_CARD_PALETTES.length].name;
  return { percent, auraName };
}

export default function RarityBadge({ seed }: { seed: string }) {
  const { percent, auraName } = cardRarity(seed);
  return (
    <View style={styles.badge} testID="rarity-badge">
      <Text style={styles.text} numberOfLines={1}>
        ✦ Top {percent}% · {auraName} Aura
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(235, 201, 131, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.35)',
    borderRadius: Theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    maxWidth: 170,
  },
  text: {
    ...Theme.typography.labelSm,
    fontSize: 9,
    letterSpacing: 0.4,
    color: Theme.colors.accent.goldSecondary,
  },
});
