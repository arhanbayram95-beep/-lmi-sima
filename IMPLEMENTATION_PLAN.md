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
- [ ] **5.1 RevenueCat Hook Integration — deferred (2026-07-26)**
  - Setup the paywall component inside the frontend app.
  - Lock deep-dive interpretations and reading history behind a weekly/monthly
    subscription — cancel flow must be equally frictionless as sign-up.
  - Product decision: `react-native-purchases` is a native module, same
    category as Phase 6's face detection — installing it drops plain Expo
    Go support in favor of an EAS dev-client build. Deferred together with
    6.1 rather than sprung on the project mid-prompt-tuning session.
    Blocked on: `REVENUECAT_API_KEY` (missing from `.env`), a RevenueCat
    account, and App Store Connect / Google Play Console developer
    accounts with in-app products configured — RevenueCat sits on top of
    those, it doesn't replace them. Revisit alongside 6.1.
- [x] **5.2 End-to-End Testing Matrix (audited 2026-07-29)**
  - `backend/tests/unit` covers JSON payload handling thoroughly — malformed/
    missing/wrong-type fields at every schema nesting level, network failure,
    non-JSON response.
  - Edge-case audit against CLAUDE.md's required list: non-face-detected
    photo (`AnalyzingScreen.test.tsx`), network failure mid-analysis (3
    layers: `api/reading.test.ts`, `AnalyzingScreen.test.tsx`, backend
    `reading.route.test.ts`), age-gate rejection (`OnboardingScreen.test.tsx`)
    — all already covered, nothing to add. Expired/missing entitlement has
    nothing to test yet — `requireActiveEntitlement` is still a permissive
    stub pending 5.1, no real logic branch exists. Apparent-minor/poor-lighting
    fallbacks are AI-content behavior, not code branches — manually verified
    live against the real API in `QA_FINDINGS.md`'s MOD-2 pass; the
    schema-conformance tests above are what's actually automatable for this.
- [x] **5.3 Deployment Preparation (partial, 2026-07-29)**
  - `Dockerfile` was already complete (multi-stage, non-root user, prod-only
    deps) — verified `npm run build` produces exactly what it expects.
  - `frontend/eas.json` added (development/preview/production build
    profiles) and `app.json` gained `ios.bundleIdentifier` /
    `android.package` (`app.faceai.facereader` — a **placeholder** derived
    from the `faceai.app` domain already referenced in `ShareCard.tsx`'s
    footer; confirm/replace with the real reverse-DNS identifier before an
    actual store submission, it's effectively permanent once published).
  - Still blocked on the user: an EAS/Expo account (`eas login` +
    `eas build:configure` to generate a real `extra.eas.projectId`), Apple
    Developer Program + App Store Connect membership, Google Play Console
    developer account. None of these can be created by an agent.
  - Legal review pass: see new root-level `LEGAL_REVIEW_PACKET.md` — compiles
    all three system prompts, the full Privacy Policy/Terms text, and every
    in-app consent/disclaimer string in one place for actual review, with
    known open items (placeholder Governing Law, paid-tier AI key
    requirement) called out. The review itself still needs a human (ideally
    counsel), not something this pass could complete.
  - Also done in this pass, not originally scoped here: Privacy
    Policy/Terms are now hosted as real public pages
    (`backend/src/routes/legal.ts`, `/legal/privacy` + `/legal/terms`) —
    required for the App Store Connect / Play Console privacy policy URL
    field, which plain in-app modal text can't satisfy. See `PROJECT_SPEC.md`
    §3.

---

## Phase 6: Deferred — On-Device Face Detection (+ RevenueCat, see 5.1)
Pushed to the very end of the plan per product decision (2026-07-24): Expo
dropped its built-in face-detector module, so real detection needs a native
dependency (`react-native-vision-camera` + an ML Kit frame-processor plugin)
and a move off plain Expo Go to an EAS dev-client build — a bigger
architecture change than the rest of the plan, deliberately sequenced last.
RevenueCat (5.1) hits the exact same Expo Go tradeoff, so it's grouped in
here too (2026-07-26) — tackle both together when ready for a dev-client build.
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

---

## Phase 7: Reading Modules (Relationship Harmony & Career Match)
Added 2026-07-24, not in the original spec — the Analyze hub had shipped
`Relationship Harmony Analyzer` and `Career Match` as frontend-only "COMING
SOON" teaser cards (`available: false`, routed nowhere) with zero backend
support: no per-module prompt, no request parameter, nothing in
PROJECT_SPEC.md. Product decision: build real per-module differentiation
rather than just flip the flag, since the card copy already promises
relationship/career-specific content a generic reading wouldn't deliver.
- [x] **7.1 Backend: per-module system prompts + request routing**
  - `ReadingModuleId` type (`three-expression` | `relationship-harmony` |
    `career-match`) in `backend/src/services/readingSchema.ts`.
  - `READING_SYSTEM_PROMPTS` map in `backend/src/services/systemPrompt.ts` —
    each module's prompt shares the same `SAFETY_RULES` block (entertainment-
    only, no clinical language, no negative traits, non-face/minor
    fallbacks) so a future edit can't silently apply to only one module.
  - `POST /api/v1/reading/analyze` accepts an optional `module` field
    (defaults to `three-expression` for backward compatibility) and forwards
    it to `generateReading`.
  - **Flagged for product owner review** (same as the original system
    prompt draft): all three prompts are first drafts, not legally
    reviewed — read them before this ships to real users.
- [x] **7.2 Frontend: module selection threaded through capture → reading**
  - `CaptureSlice.selectedModule` (Zustand) set by `AnalyzeScreen` when a
    module card is tapped, read by `AnalyzingScreen` when calling
    `analyzeReading`.
  - Both modules flipped to `available: true` on the Analyze hub; mock API
    mode (`mockReading.ts`) returns a distinct canned reading per module so
    `EXPO_PUBLIC_USE_MOCK_API=true` testing can verify the content actually
    differs, not just that navigation works.
- [x] **7.3 Per-module photo counts (2026-07-25)** — product decision
  revising 7.1/7.2's original "same 3-expression mechanic for every module"
  assumption: Character Analysis stays at 3 photos of the user, Relationship
  Harmony now captures 2 (**one of the user, one of another person** — a
  materially bigger scope than the module's original one-person design, see
  PROJECT_SPEC.md §2.3), Career Match captures 1.
  - Generalized the reading schema off the fixed Calm/Bright/Deep shape:
    `expression_insights: [{expression, insight}]` → `insights: [{label,
    insight}]` (both `backend/src/services/readingSchema.ts` and
    `frontend/src/api/types.ts`), `AnalyzeReadingPayload.{calm,bright,deep}`
    → `photos: string[]`. `MODULE_PHOTO_COUNTS` (mirrored on both sides)
    enforces the right count per module; `generateReading` rejects a
    mismatched count before ever calling Gemini.
  - `CaptureSlice.images` is now a plain ordered array (was a
    calm/bright/deep record) — `CaptureScreen`'s step sequence is now a
    per-module `MODULE_STEPS` map; Relationship Harmony's second step uses
    the back camera (photographing someone else) where every other step
    uses the front camera (a selfie).
  - Relationship Harmony's prompt rewritten for the real two-person
    scenario: independent per-person insights, explicitly never a
    compatibility score or a claim about the two people's actual
    relationship (see PROJECT_SPEC.md §2.3 and the Biometric Data section
    of `legalContent.ts`, both updated to match — a second real person's
    photo being processed is a materially different privacy posture than
    the module's original one-person design, flagged and confirmed with
    the product owner before building rather than assumed).
  - `RevealScreen`'s per-insight cards now render a generic label instead
    of a Calm/Bright/Deep-keyed glyph lookup — works unchanged for any
    module's insight shape. `ShareCard` was already headline/narrative-only
    and needed no changes to work across all three modules.

---

## Phase 8: Reveal Screen Polish & Results History (2026-07-28)
- [x] **8.1 Reveal screen action row restyle** — the Share/Done buttons no
  longer sit on a filled pill; `PrimaryButton` gained a `flow` prop that
  strips the background/border down to bold icon+label text so the footer
  reads as floating controls, not a block. `DisclaimerFooter` moved out of
  that footer into the end of the card `ScrollView` and shrank (fontSize 9)
  per product direction — still always rendered (CLAUDE.md's disclaimer
  requirement stands), just no longer competing with the buttons for
  attention.
- [x] **8.2 Reveal card punchlines enlarged** — `ReadingCards.tsx`'s
  `badgeChipText` (headlineLg/22, glow) and `matchName` (headlineLg/30,
  glow) now read as the loudest text in each card, per product direction
  for "more dynamic, more visible" hooks.
- [x] **8.3 Results tab: reading history log** — new `HistorySlice`
  (`frontend/src/state/slices/historySlice.ts`) logs every completed
  `ReadingResult` (text only, never the photos — same process-and-discard
  boundary as before) the moment `AnalyzingScreen` gets a result back.
  `ResultsScreen` now lists past reads (module, punchline, summary, date)
  instead of always showing the empty state; tapping an entry reopens it in
  `RevealScreen`. In-memory only — resets on app restart, since no
  local-storage dependency is in `PROJECT_SPEC.md` yet and one wasn't added
  here. Product decision (2026-07-28): the original 5.1 plan to gate
  reading history behind Aura Pro no longer applies now that there's no
  free tier — history is unconditional, not `isProActive`-gated.
