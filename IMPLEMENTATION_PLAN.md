# Implementation Plan: Ilm-i Sima *(working title)*
**Version:** 1.1.0 (MVP Sprint Plan — US/EU Market Re-skin)
**Objective:** Build a high-fidelity, immersive mobile app with a backend bridge
to Claude Sonnet 5 Vision, styled for the mainstream US/EU "modern mystic" app
category, within a strict entertainment framing.

---

## Phase 1: Local Environment & Audio-Visual Asset Prep
- [x] **1.1 Expo Initialization Verification**
  - Ensure the `/frontend` directory contains a compile-ready TypeScript blank template.
  - Test run via `npm run android` or `npm run ios`.
- [ ] **1.2 Asset Gathering (Cosmic Mystic)**
  - Source or generate 3 audio effect files (`.mp3`/`.wav`, `expo-av` compatible):
    - `capture_chime.mp3` (light camera-shutter click layered with a soft cosmic twinkle).
    - `prompt_chime.mp3` (gentle bell/sparkle cue for expression prompts).
    - `ambient_shimmer.mp3` (soft looping pad/shimmer for the loading screen).
  - Place assets under `frontend/assets/audio/` and cosmic-themed SVG icons
    (stars, moons, constellations, sparkles) under `frontend/assets/icons/`.

---

## Phase 2: Frontend Navigation Shell & Design System Harmonization
- [x] **2.0 Merge & Dependency Bootstrap**
  - Merge `origin/main` (DESIGN.md, CLAUDE.md, README.md, stitch_designs/) into this branch.
  - Install navigation deps: `@react-navigation/native`, `@react-navigation/native-stack`,
    `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`.
  - Install `zustand`, `@react-native-async-storage/async-storage`.
  - Install `expo-linear-gradient`, `expo-blur`, `expo-font`,
    `@expo-google-fonts/manrope`, `@expo-google-fonts/hanken-grotesk`, `@expo-google-fonts/geist`,
    `expo-store-review`, `@expo/vector-icons`.
  - Update `PROJECT_SPEC.md`'s tech stack section with the full dependency list + rationale.
- [x] **2.1 Design System Foundation**
  - Port `DESIGN.md`'s `Theme.colors` verbatim into `frontend/src/ui/theme.ts`.
  - Extend `theme.ts` with `Theme.typography` (Manrope/Hanken Grotesk/Geist roles) and
    `Theme.spacing` (8px base scale).
  - Build `GradientBackground.tsx`, `GlassCard.tsx` (two-layer gradient-border trick,
    no `react-native-masked-view` dependency needed), `PrimaryButton.tsx` (filled/ghost
    variants), `Disclaimer.tsx`, `AppLogo.tsx` (placeholder-glyph variant with a
    swappable `source` prop for when final art arrives).
- [x] **2.2 Navigation Shell**
  - Build `navigation/types.ts` (RootStackParamList, MainTabParamList, SettingsStackParamList).
  - Build `RootNavigator.tsx` (native-stack, `headerShown: false`).
  - Build `FloatingTabBar.tsx` matching the `BottomTabBarProps` custom-tabBar signature,
    styled per code2.html's floating pill (Analyze/Results/Settings, `MaterialIcons`
    glyphs `face`/`assessment`/`settings`), hiding on pushed Settings subpages.
  - Build `MainTabNavigator.tsx` wiring `FloatingTabBar` as the custom `tabBar`.
  - Build `SettingsStackNavigator.tsx` for Privacy/Terms/Data-discard subpages.
- [x] **2.3 Zustand Store Bootstrap**
  - Build `useConsentStore.ts`, `useCaptureStore.ts`, `useEntitlementStore.ts`.
  - Wire `persist` middleware + AsyncStorage on `useConsentStore` only — consent
    persists across restarts so returning users skip straight to Main Hub.
  - `useCaptureStore` is explicitly never persisted (process-and-discard invariant).
- [x] **2.4 Screen: Splash**
  - Build `SplashScreen.tsx`: animated logo (`AppLogo`), shimmer/progress bar,
    cycling status text, cosmic gradient background.
  - Gate navigation on `useFonts()` resolving + `useConsentStore` hydrating from storage.
  - Branch: completed onboarding+age-gate before -> `navigation.reset` to `MainHub`;
    else -> `Onboarding`.
- [x] **2.5 Screen: Onboarding Carousel**
  - Build `OnboardingScreen.tsx`: paging `ScrollView`, 3 slides (Calm/Bright/Deep
    explanation), `PaginationDots.tsx`.
  - "Skip Introduction" and final-slide "Next" both route to `AgeGate`.
- [x] **2.6 Screen: Age Gate & Consent**
  - Build `AgeGateScreen.tsx`: self-attestation buttons, `ConsentCheckbox.tsx`,
    disabled-until-both-affirmed Continue CTA.
  - Build the "under 18" dead-end branch (`AgeDeclinedScreen.tsx`).
  - Disable swipe-back gesture on this route.
- [x] **2.7 Screen: Rating Prompt**
  - Build `RatingPromptScreen.tsx` + `StarRating.tsx` (5-star tap widget).
  - Wire the compliant review-gate pattern: 4-5 stars -> `expo-store-review`'s
    `requestReview()`; 1-3 stars -> lightweight in-app feedback capture, never an
    external App Store deep link.
- [x] **2.8 Screen: Paywall**
  - Build `PaywallScreen.tsx` + `PricingTierCard.tsx` (Weekly Pass w/ crimson highlight
    tag, Annual Pass w/ gold "SAVE 60%" tag), sticky CTA, feature list.
  - `onSelect`/CTA handlers are stubs (`markPaywallSeen()` only) — no RevenueCat call yet.
  - Persistent, legible disclaimer footer (`Disclaimer.tsx`).
- [x] **2.9 Screen: Main Hub — Analyze Tab**
  - Build `AnalyzeScreen.tsx`: top app bar (logo, PRO badge), hero section
    ("3-Expression Face Reading" + Start Analysis CTA — stubbed, no camera wiring),
    4-card feature grid matching code2.html's icon set.
- [x] **2.10 Screen: Main Hub — Results/Log Tab**
  - Build `ResultsScreen.tsx`: new UI (no Stitch mapping) — reading history empty state,
    shareable-card affordance deferred to Phase 4 (`react-native-view-shot`).
- [x] **2.11 Screen: Main Hub — Settings Tab & Subpages**
  - Build `SettingsScreen.tsx` (list of nav rows: Privacy, Terms, Data Discard).
  - Build `PrivacyScreen.tsx`, `TermsScreen.tsx`, `DataDiscardScreen.tsx` (static
    content screens + a functional in-memory capture-store clear action on the
    Data Discard screen), pushed via `SettingsStackNavigator`.
  - Floating tab bar hides on these pushed subpages.
- [ ] **2.12 Cross-Cutting: Flow Wiring & Initial Route Determination**
  - Finalize the Splash-screen branching logic from 2.4 end-to-end across a fresh
    install vs. a returning-user relaunch (manual device/simulator verification).
- [ ] **2.13 Frontend Test Pass**
  - Jest + RNTL smoke tests per screen (renders, mocked navigation prop) and per
    shared component (`GlassCard`, `AppLogo`, `FloatingTabBar`).
  - Mock `expo-camera`/`expo-av`/RevenueCat hooks per `CLAUDE.md`'s testing rules
    even though they're unused this phase, so later phases don't need to retrofit mocks.
- [ ] **2.14 Screen: The Three-Expression Capture (Sequential Camera UI)**
  - Integrate `expo-camera` or `react-native-vision-camera`.
  - Design a continuous single-session capture flow with soft glowing face-guide overlays:
    - Step 1: **Calm** → capture, triggers `capture_chime.mp3` + light haptic.
    - Step 2: **Bright** → prompt "Show us your glow ✨", triggers `prompt_chime.mp3`.
    - Step 3: **Deep** → prompt "Now give us your mysterious side 🌙", final capture.
  - Implement on-device face bounding verification (reject non-face frames locally).
  - Wire `AnalyzeScreen`'s "Start Analysis" CTA to launch this flow, writing into
    `useCaptureStore`.

---

## Phase 3: The Gateway Backend & Claude Vision Integration
- [ ] **3.1 Backend Skeleton Framework (`FastAPI` or `Node.js`)**
  - Initialize the server structure inside `/backend`.
  - Configure `.env` mapping `ANTHROPIC_API_KEY` and `REVENUECAT_API_KEY`.
- [ ] **3.2 Payload Serialization (`backend/src/reading/protocol/`)**
  - Construct an endpoint `/api/v1/reading/analyze` accepting 3 base64 strings in a JSON wrapper.
  - Embed the **system prompt** (warm cosmic-guide persona, defensive wording
    template, safety-first constructive-traits-only filter) into the Anthropic SDK call.
  - Use **Claude Sonnet 5** (`claude-sonnet-5`) with a **tool-use JSON schema**
    (not `response_format` — that param doesn't exist on the Anthropic API) to
    lock the output to the target schema. Force the tool via `tool_choice`.
- [ ] **3.3 Privacy Shield Enforcement (`backend/src/reading/transport/`)**
  - Implement an aggressive memory-clear function: the moment Claude returns the
    structured result, delete the base64 arrays from active memory
    (process-and-discard architecture).

---

## Phase 4: High-Fidelity Loading & The Reveal Screen
- [ ] **4.1 Screen 3: Reading in Progress (Loading Core)**
  - While the backend call is in flight (3–6s), loop `ambient_shimmer.mp3` softly.
  - Render a scanning animation — soft particles/light traversing the captured
    faces, or a subtle constellation-forming effect.
- [ ] **4.2 Screen 4: The Reading (Results Architecture)**
  - Reveal a glassmorphic card UI displaying: `headline`, `expression_insights`, `narrative`.
  - Mount a persistent, clearly legible `footer_disclaimer` component on every result layout.
- [ ] **4.3 The Viral Catalyst (Share Card Compilation)**
  - Integrate `react-native-view-shot` to capture a vertical 9:16 story-ready
    graphic in the app's cosmic visual style.
  - Trigger native share sheet on tap.

---

## Phase 5: Monetization & Final Deploy
- [ ] **5.1 RevenueCat Hook Integration**
  - Wire real `react-native-purchases` calls into the existing `PaywallScreen.tsx`
    (built in Phase 2.8) and `useEntitlementStore` (built in Phase 2.3) — no new
    screen work, only replacing the stubbed `onSelect`/purchase handlers with live
    RevenueCat calls and syncing `CustomerInfo` into the store's shape.
  - Cancel flow must be equally frictionless as sign-up.
- [ ] **5.2 End-to-End Testing Matrix**
  - Run `backend/tests/unit` to verify JSON payload handling.
  - Run edge-case checks: non-face photo, apparent-minor photo (graceful,
    non-clinical fallback message without crashing), poor lighting/no-face-detected.
- [ ] **5.3 Deployment Preparation**
  - Finalize the `Dockerfile` for backend server compilation.
  - Package frontend configuration for Apple TestFlight and Google Play internal testing.
  - Legal review pass on paywall copy + disclaimers per target market (US, key EU
    markets) before public launch.
