# Ilm-i Sima *(working title)* 🔮✨
### A Cosmic Face Reading Experience

An interactive, mobile face-reading app that blends AI vision with a modern,
"cosmic fortune-teller" experience — in the spirit of apps like Co-Star, Nebula,
and Faladdin — built for the US & EU entertainment/mystic-app market.

⚠️ **Strict Framing Note:** This application is built exclusively for
entertainment and self-reflection. It has zero scientific or clinical validity,
performs no biometric identification, and carries clear, always-visible
disclaimers across every screen.

## 🌟 The Experience & HCI Principles
* **Visual Identity:** Deep cosmic gradients (midnight indigo, violet, magenta),
  glowing celestial motifs, glassmorphic cards, holographic accents. Premium,
  modern-mystic — closer to a meditation/astrology app than a medieval RPG.
* **High-Fidelity Interaction:** Soft particle shimmer transitions, gentle
  ambient audio (light chimes, cosmic twinkles), haptic feedback on capture.
* **The Triple-Expression Flow:** Users submit three expressions — **Calm**,
  **Bright**, **Deep** — to feed the AI reading engine.
* **Tone of Voice:** Warm, a little playful, unmistakably "for fun." Short,
  punchy copy — think horoscope-app energy, not fortune-teller-in-a-tent.

## 🛠️ Technical Stack
* **Frontend:** React Native (TypeScript) via Expo.
* **State Management:** Zustand.
* **Sound & Feedback:** `expo-av` for audio, native haptics API.
* **Backend Bridge:** Node.js (TypeScript) or FastAPI, acting as a secure gateway
  to the Claude API.
* **AI Engine:** Claude Sonnet 5 (vision, via the Messages API), structured
  output via tool-use JSON schema.
* **Monetization:** RevenueCat — weekly/monthly subscription for deep-dive
  readings, built with a frictionless native cancel flow.

## 🌍 Target Market
Primary: US and EU, positioned in the mainstream astrology/mystic entertainment
app category. Branding and copy should read naturally in English first, with
localization planned for key EU languages post-MVP.

## 🚀 Quick Start (Local Development)
Commands and environment variables will be populated as infrastructure tasks
complete in `IMPLEMENTATION_PLAN.md`.
