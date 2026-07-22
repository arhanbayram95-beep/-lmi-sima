// Colors locked in DESIGN.md §2 — verbatim, do not edit without a spec change.
// Typography/spacing are NOT locked by DESIGN.md; resolved from the majority
// pattern across stitch_designs/DESIGN*.md (see IMPLEMENTATION_PLAN.md Phase 2.1).
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

  typography: {
    fontFamily: {
      headline: 'Manrope_700Bold',
      headlineSemibold: 'Manrope_600SemiBold',
      body: 'HankenGrotesk_400Regular',
      bodyMedium: 'HankenGrotesk_500Medium',
      label: 'Geist_500Medium',
    },
    display: { fontSize: 48, lineHeight: 56, letterSpacing: -0.02 * 48 },
    headlineLg: { fontSize: 32, lineHeight: 40, letterSpacing: -0.02 * 32 },
    headlineMd: { fontSize: 24, lineHeight: 32 },
    bodyLg: { fontSize: 18, lineHeight: 28 },
    bodyMd: { fontSize: 16, lineHeight: 24 },
    labelSm: { fontSize: 12, lineHeight: 16, letterSpacing: 0.05 * 12 },
  },

  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
} as const;
