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
// per the "colors are locked" rule at the top of this file. Product
// feedback (2026-08-15): the original 4 leaned on the same gold/iridescent
// accents repeatedly, so they read as near-duplicates in the picker. This
// is the full 3x3 grid of the 3 locked backgrounds x 3 locked accents —
// crimsonPrimary included as a card accent for the first time, not just
// app chrome — so every option is a genuinely different combination rather
// than a shade of one already covered. Named (not just id'd) so the picker
// can label each swatch — at 56px, two options sharing an accent read
// similarly as tiny circles, but the full-size share card makes the
// background difference obvious, and a name lets someone pick by that
// difference before seeing it rendered.
export const SHARE_CARD_PALETTES = [
  {
    id: 'crimson',
    name: 'Crimson',
    background: Theme.colors.background.start,
    accent: Theme.colors.accent.goldSecondary,
  },
  {
    id: 'ember',
    name: 'Ember',
    background: Theme.colors.background.start,
    accent: Theme.colors.accent.crimsonPrimary,
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    background: Theme.colors.background.start,
    accent: Theme.colors.accent.iridescentShimmer,
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    background: Theme.colors.background.middle,
    accent: Theme.colors.accent.goldSecondary,
  },
  {
    id: 'rosewood',
    name: 'Rosewood',
    background: Theme.colors.background.middle,
    accent: Theme.colors.accent.crimsonPrimary,
  },
  {
    id: 'velvet',
    name: 'Velvet',
    background: Theme.colors.background.middle,
    accent: Theme.colors.accent.iridescentShimmer,
  },
  {
    id: 'nightfall',
    name: 'Nightfall',
    background: Theme.colors.background.end,
    accent: Theme.colors.accent.goldSecondary,
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    background: Theme.colors.background.end,
    accent: Theme.colors.accent.crimsonPrimary,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    background: Theme.colors.background.end,
    accent: Theme.colors.accent.iridescentShimmer,
  },
] as const;

export type SharePaletteId = (typeof SHARE_CARD_PALETTES)[number]['id'];

export const DEFAULT_SHARE_PALETTE_ID: SharePaletteId = 'crimson';

export function shareCardPalette(id: SharePaletteId) {
  return SHARE_CARD_PALETTES.find((palette) => palette.id === id) ?? SHARE_CARD_PALETTES[0];
}
