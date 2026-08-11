// Design tokens per DESIGN.md §2. Colors are locked — do not introduce new
// hex values outside this file; reference Theme.colors.* everywhere else.
export const Theme = {
  colors: {
    background: {
      start: '#1A050B', // Deep Obsidian Crimson
      middle: '#2D0A12', // Dark Burgundy
      end: '#0A071B', // Midnight Violet Tint
    },
    surface: {
      glassBackground: 'rgba(255, 255, 255, 0.05)',
      glassBorder: 'rgba(158, 41, 65, 0.35)',
      glassOverlay: 'rgba(26, 5, 11, 0.75)',
    },
    accent: {
      crimsonPrimary: '#9E2941',
      goldSecondary: '#EBC983',
      iridescentShimmer: '#C792EA',
    },
    text: {
      primary: '#F5F3FF',
      secondary: '#B3B0CD',
      accentGold: '#EBC983',
      muted: '#6E6A8A',
    },
    status: {
      error: '#E57373',
      success: '#81C784',
    },
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64,
    containerPadding: 20,
    gutter: 16,
  },
  radius: {
    sm: 4,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    headlineLg: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
    headlineMd: { fontSize: 24, fontWeight: '600' as const },
    bodyLg: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
    bodyMd: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    labelSm: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 1.2 },
  },
} as const;

export type ThemeColors = typeof Theme.colors;

// Share-card color options (see ShareOptionsModal's builder). Every value
// here is one already defined in Theme.colors above — no new hex values,
// per the "colors are locked" rule at the top of this file — just
// recombined so the card background/accent pairing can differ from the
// app chrome's own crimson-on-obsidian default while staying inside the
// locked palette.
export const SHARE_CARD_PALETTES = [
  {
    id: 'crimson',
    background: Theme.colors.background.start,
    accent: Theme.colors.accent.goldSecondary,
  },
  {
    id: 'burgundy',
    background: Theme.colors.background.middle,
    accent: Theme.colors.accent.goldSecondary,
  },
  {
    id: 'midnight',
    background: Theme.colors.background.end,
    accent: Theme.colors.accent.iridescentShimmer,
  },
  {
    id: 'iridescent',
    background: Theme.colors.background.start,
    accent: Theme.colors.accent.iridescentShimmer,
  },
] as const;

export type SharePaletteId = (typeof SHARE_CARD_PALETTES)[number]['id'];

export const DEFAULT_SHARE_PALETTE_ID: SharePaletteId = 'crimson';

export function shareCardPalette(id: SharePaletteId) {
  return SHARE_CARD_PALETTES.find((palette) => palette.id === id) ?? SHARE_CARD_PALETTES[0];
}
