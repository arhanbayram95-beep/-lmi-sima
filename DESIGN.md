# Design System & UI/UX Specification: Ilm-i Sima
**Version:** 1.0.0  
**Target Platform:** Mobile (iOS / Android — Expo React Native)  
**Core Theme:** Modern Cosmic Mysticism x Medieval Ottoman Physiognomy

---

## 1. Visual Identity & Brand Philosophy

Ilm-i Sima merges medieval physiognomy folklore with a sleek, high-end "modern mystic" aesthetic (popular in US/EU astrology & entertainment apps). The app must **never** feel like a cheap utility or a flat administrative form. Every interaction is designed as an immersive, theatrical "ritual."

### Key Principles
* **Glassmorphic Depth:** Translucent surfaces, subtle blurred overlays, and soft glowing borders create a multi-layered sense of mystery.
* **Tactile & Auditory Rituals:** Every touch action is paired with custom haptic feedback and distinct audio cues (heavy iron shutter, cosmic chimes, parchment rustles).
* **Parity Across Platforms:** Pixel-perfect visual identity on both iOS and Android using unified tokens.

---

## 2. Design Tokens

### 2.1 Color Palette (`frontend/src/ui/theme.ts`)

```typescript
export const Theme = {
  colors: {
    // Background Gradients
    background: {
      start: '#0A071B', // Deep Midnight Indigo
      middle: '#140D2B', // Dark Violet
      end: '#1B0922', // Muted Cosmic Magenta
    },

    // Card Surfaces (Glassmorphism)
    surface: {
      glassBackground: 'rgba(255, 255, 255, 0.05)',
      glassBorder: 'rgba(235, 201, 131, 0.25)', // Subtle gold glow border
      glassOverlay: 'rgba(10, 7, 27, 0.65)',
      parchmentBackground: 'rgba(244, 235, 216, 0.08)',
    },

    // Accents & Typography
    accent: {
      goldPrimary: '#EBC983', // Celestial Gold
      goldLight: '#FCEFD2', // Warm Highlight Gold
      iridescentShimmer: '#C792EA', // Soft Holographic Violet
    },

    text: {
      primary: '#F5F3FF', // Warm Off-White
      secondary: '#B3B0CD', // Soft Lavender Gray
      gold: '#EBC983',
      muted: '#6E6A8A',
    },

    // Status & Utility
    status: {
      error: '#E57373',
      success: '#81C784',
    }
  }
};