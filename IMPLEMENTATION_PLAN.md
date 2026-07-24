# Implementation Plan: Ilm-i Sima *(working title)*
**Version:** 1.1.0 (MVP Sprint Plan — US/EU Market Re-skin)
**Objective:** Build a high-fidelity, immersive mobile app with a backend bridge
to an AI vision model (currently Google Gemini, see PROJECT_SPEC.md §4), styled
for the mainstream US/EU "modern mystic" app category, within a strict
entertainment framing.

---

## Phase 1: Local Environment & Audio-Visual Asset Prep
- [ ] **1.1 Expo Initialization Verification**
  - Ensure the `/frontend` directory contains a compile-ready TypeScript blank template.
  - Test run via `npm run android` or `npm run ios`.
- [x] **1.2 Asset Gathering (Cosmic Mystic)**
  - Source or generate 3 audio effect files (`.mp3`/`.wav`, `expo-av` compatible):
    - `capture_chime.mp3` (light camera-shutter click layered with a soft cosmic twinkle).
    - `prompt_chime.mp3` (gentle bell/sparkle cue for expression prompts).
    - `ambient_shimmer.mp3` (soft looping pad/shimmer for the loading screen).
  - Place assets under `frontend/assets/audio/` and cosmic-themed SVG icons
    (stars, moons, constellations, sparkles) under `frontend/assets/icons/`.
  - Audio done (`frontend/assets/audio/*.wav`, wired via `utils/sound.ts`).
    No dedicated SVG icon set was built — `DESIGN.md` v2.0.0 re-skinned the
    app to the crimson/gold glassmorphic system, dropping the older
    "Cosmic Mystic" star/moon iconography this row was written for; the app
    uses emoji glyphs and simple vector shapes instead throughout.

---

## Phase 2: Frontend Navigation & The Reading Flow UX (HCI Focus)
- [x] **2.1 Global State & Core Theming (`Zustand`)**
  - Install Zustand (`npm install zustand`) to manage global state:
    - User age certification status (+18 gate).
    - Base64 image cache array (max 3: Calm, Bright, Deep).
    - Active paywall status derived from RevenueCat hooks.
  - Setup a master theme palette in `frontend/src/ui/theme.ts`:
    - Background: midnight indigo → violet → magenta gradient
    - Accent: holographic/iridescent foil (animated gradient shimmer)
    - Text: warm off-white / soft lavender for secondary text
    - Card surfaces: glassmorphic (blur + low-opacity white overlay + soft glow border)
- [x] **2.2 Screen 1: Onboarding & Age Gate**
  - Build a clean, cosmic-gradient welcome carousel with +18 age gate verification.
  - Add explicit checkbox for image-processing consent with a warm, plain-language
    disclaimer (see PROJECT_SPEC §2.1).
- [x] **2.3 Screen 2: The Three-Expression Capture (Sequential Camera UI)**
  - Integrate `expo-camera` or `react-native-vision-camera`.
  - Design a continuous single-session capture flow with soft glowing face-guide overlays:
    - Step 1: **Calm** → capture, triggers `capture_chime.mp3` + light haptic.
    - Step 2: **Bright** → prompt "Show us your glow ✨", triggers `prompt_chime.mp3`.
    - Step 3: **Deep** → prompt "Now give us your mysterious side 🌙", final capture.
  - On-device face bounding verification carved out to **6.1** below (deferred
    to the end of the plan per product decision).

---

## Phase 3: The Gateway Backend & AI Vision Integration
- [x] **3.1 Backend Skeleton Framework (`FastAPI` or `Node.js`)**
  - Initialize the server structure inside `/backend`.
  - Configure `.env` mapping `ANTHROPIC_API_KEY` and `REVENUECAT_API_KEY`.
  - **2026-07-24:** provider swapped to Gemini — `.env` now maps
    `GEMINI_API_KEY` instead (see PROJECT_SPEC.md §4; pricing decision still
    open between Gemini and Claude).
- [x] **3.2 Payload Serialization (`backend/src/reading/protocol/`)**
  - Construct an endpoint `/api/v1/reading/analyze` accepting 3 base64 strings in a JSON wrapper.
  - Embed the **system prompt** (warm cosmic-guide persona, defensive wording
    template, safety-first constructive-traits-only filter) into the Anthropic SDK call.
  - Use **Claude Sonnet 5** (`claude-sonnet-5`) with a **tool-use JSON schema**
    (not `response_format` — that param doesn't exist on the Anthropic API) to
    lock the output to the target schema. Force the tool via `tool_choice`.
  - **2026-07-24:** rewritten for Gemini (`gemini-2.5-flash` via
    `@google/genai`) — structured output now via `config.responseSchema` +
    `responseMimeType: 'application/json'` instead of tool-use. Live-tested
    end to end (real key, real schema, real images) — see
    `backend/src/services/{geminiClient,readingService,readingSchema}.ts`.
- [x] **3.3 Privacy Shield Enforcement (`backend/src/reading/transport/`)**
  - Implement an aggressive memory-clear function: the moment Claude returns the
    structured result, delete the base64 arrays from active memory
    (process-and-discard architecture).

---

## Phase 4: High-Fidelity Loading & The Reveal Screen
- [x] **4.1 Screen 3: Reading in Progress (Loading Core)**
  - While the backend call is in flight (3–6s), loop `ambient_shimmer.mp3` softly.
  - Render a scanning animation — soft particles/light traversing the captured
    faces, or a subtle constellation-forming effect.
  - Implemented in `AnalyzingScreen.tsx`: `startAmbientShimmerLoop()` loops
    the ambient audio for the call's duration; a pulsing logo + rotating
    scan ring stand in for the literal particle effect (simplified, matches
    the glassmorphic system rather than a separate particle engine).
- [x] **4.2 Screen 4: The Reading (Results Architecture)**
  - Reveal a glassmorphic card UI displaying: `headline`, `expression_insights`, `narrative`.
  - Mount a persistent, clearly legible `footer_disclaimer` component on every result layout.
- [x] **4.3 The Viral Catalyst (Share Card Compilation)**
  - Integrate `react-native-view-shot` to capture a vertical 9:16 story-ready
    graphic in the app's cosmic visual style.
  - Trigger native share sheet on tap.

---

## Phase 5: Monetization & Final Deploy
- [ ] **5.1 RevenueCat Hook Integration**
  - Setup the paywall component inside the frontend app.
  - Lock deep-dive interpretations and reading history behind a weekly/monthly
    subscription — cancel flow must be equally frictionless as sign-up.
- [ ] **5.2 End-to-End Testing Matrix**
  - Run `backend/tests/unit` to verify JSON payload handling.
  - Run edge-case checks: non-face photo, apparent-minor photo (graceful,
    non-clinical fallback message without crashing), poor lighting/no-face-detected.
- [ ] **5.3 Deployment Preparation**
  - Finalize the `Dockerfile` for backend server compilation.
  - Package frontend configuration for Apple TestFlight and Google Play internal testing.
  - Legal review pass on paywall copy + disclaimers per target market (US, key EU
    markets) before public launch.

---

## Phase 6: Deferred — On-Device Face Detection
Pushed to the very end of the plan per product decision (2026-07-24): Expo
dropped its built-in face-detector module, so real detection needs a native
dependency (`react-native-vision-camera` + an ML Kit frame-processor plugin)
and a move off plain Expo Go to an EAS dev-client build — a bigger
architecture change than the rest of the plan, deliberately sequenced last.
- [x] **6.0 Placeholder UI** — `NoFaceDetectedScreen` built and wired: a
  `ReadingApiError` thrown with `code: 'NO_FACE_DETECTED'` (frontend or
  backend, once real detection exists) routes `AnalyzingScreen` straight to
  it instead of the generic error state. Nothing throws that code yet.
- [ ] **6.1 On-device face bounding verification**
  - Add `react-native-vision-camera` + a face-detector frame-processor
    plugin; switch `CaptureScreen` off `expo-camera`.
  - Reject non-face frames locally before `capture_chime` fires, per
    `PROJECT_SPEC.md` §2.2 (privacy + cost control) — route straight to
    `NoFaceDetectedScreen` rather than letting a bad frame reach the backend.
  - Requires an EAS dev-client build (no longer testable in plain Expo Go).
