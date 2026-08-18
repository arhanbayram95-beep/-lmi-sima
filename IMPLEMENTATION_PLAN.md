# Implementation Plan: Ilm-i Sima *(working title)*
**Version:** 1.1.0 (MVP Sprint Plan — US/EU Market Re-skin)
**Objective:** Build a high-fidelity, immersive mobile app with a backend bridge
to an AI vision model (currently Google Gemini, see PROJECT_SPEC.md §4), styled
for the mainstream US/EU "modern mystic" app category, within a strict
entertainment framing.

---

## Phase 1: Local Environment & Audio-Visual Asset Prep
- [x] **1.1 Expo Initialization Verification (audited 2026-07-29)**
  - Ensure the `/frontend` directory contains a compile-ready TypeScript blank template.
  - Test run via `npm run android` or `npm run ios`.
  - No Android/iOS device or emulator is available in this environment, so
    `npm run android`/`ios` can't launch interactively here — verified the
    same underlying guarantee (the template actually compiles and bundles)
    via `npx expo export --platform android` and `--platform ios`: both
    produced a clean Metro bundle (665/667 modules, zero errors). Also ran
    `npx expo-doctor`: 18/18 checks passed. `tsc --noEmit` and the full Jest
    suite (29 suites, 125 tests) are already green as of the same pass.
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
  - **Dependency/integration groundwork done (2026-07-30):**
    `react-native-purchases@10.5.0` installed and wired end to end —
    `frontend/src/utils/purchases.ts` wraps `configure`/`getOfferings`/
    `purchasePackage`/`restorePurchases`; `PaywallScreen.tsx` calls the real
    SDK whenever `EXPO_PUBLIC_REVENUECAT_API_KEY` is set, falling back to
    the original local-only stub otherwise (every environment today, since
    no RevenueCat account exists — confirmed with the product owner before
    building past the stub). See `PROJECT_SPEC.md` §6 for the full
    rationale, the `aura_pro_access` entitlement identifier that must match
    the RevenueCat dashboard once it exists, and the `REVENUECAT_API_KEY` →
    `EXPO_PUBLIC_REVENUECAT_API_KEY` naming clarification against
    `CLAUDE.md`'s locked env var list. `jest.config.js` extended for
    `@revenuecat/*` sub-packages; `tsc`/full Jest suite (137 tests)/
    `expo-doctor`/`expo export` all verified green. This row stays
    unchecked — the account/key/dashboard-config blockers above are
    unchanged, this is purely code that's ready for them.
  - **Live-tested end to end against a real RevenueCat project (2026-08-04):**
    a real RevenueCat account/project now exists (Test Store, not yet a real
    App Store Connect / Play Console product) — packages switched from
    weekly/annual to weekly/monthly per product decision (`purchases.ts`,
    `PaywallScreen.tsx`, translations, both copies of the Terms text).
    Verified on-device via the RevenueCat Test Store purchase dialog: a real
    `purchasePackage()` call, entitlement check, and paywall dismissal all
    worked. Row stays unchecked — still blocked on real store products, per
    the blockers above.
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
  - **2026-08-12: Apple Developer Program obtained; bundle identifier
    finalized.** `ios.bundleIdentifier` / `android.package` changed from the
    `app.faceai.facereader` placeholder to `com.arhanbayram.facereader`
    (product owner decision — no domain is owned, so this is a personal-name
    reverse-DNS identifier; Apple/Google don't require the string to
    resolve). This is now considered permanent. `ShareCard.tsx`'s footer
    also dropped its `faceai.app` mention (same unowned-domain issue,
    user-facing copy). `storeLinks.ts`'s `ANDROID_PACKAGE_NAME` updated to
    match; `IOS_APP_STORE_ID` stays a placeholder — that numeric ID doesn't
    exist until an App Store Connect app record is created.
    `ios.infoPlist.ITSAppUsesNonExemptEncryption: false` added — surfaced by
    a real `eas build` attempt as a hard requirement (app only does standard
    HTTPS/TLS, no custom encryption, so `false` is correct).
    EAS/Expo account confirmed already logged in (`arhan_bayram` /
    `arhanbayrams-team`, matches the existing `extra.eas.projectId`) — that
    blocker from the note above is resolved.
    **Still blocked on the user, cannot be done by an agent:** an
    `eas build --platform ios --profile preview` (or `production`) run
    itself needs to be started interactively by the user in their own
    terminal — EAS has no iOS credentials yet and must authenticate against
    the new Apple Developer Program membership (Apple ID login + 2FA, or an
    App Store Connect API key) to generate a Distribution Certificate and
    Provisioning Profile; a non-interactive attempt from this pass
    confirmed it fails fast with "couldn't find any credentials suitable
    for internal distribution, run in interactive mode" rather than hanging.
    An agent should not hold or relay Apple ID credentials/2FA codes.
    TestFlight distribution additionally needs the App Store Connect app
    record created first (not done yet) and `eas submit -p ios` run
    afterward.

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
- [x] **6.1 On-device face bounding verification**
  - Add `react-native-vision-camera` + a face-detector frame-processor
    plugin; switch `CaptureScreen` off `expo-camera`.
  - Reject non-face frames locally before `capture_chime` fires, per
    `PROJECT_SPEC.md` §2.2 (privacy + cost control) — route straight to
    `NoFaceDetectedScreen` rather than letting a bad frame reach the backend.
  - Requires an EAS dev-client build (no longer testable in plain Expo Go).
  - **Dependency groundwork done (2026-07-29):** `react-native-vision-camera`
    v5 needs a worklets runtime requiring React Native 0.83–0.86, which
    forced an Expo SDK 54→57 upgrade first (see `PROJECT_SPEC.md` §3 for the
    full cascade — RN 0.86, `expo-av`→`expo-audio`, app.json schema fixes,
    TS 6.0's breaking `types` default, `StyleSheet.absoluteFillObject`
    removal).
  - **`CaptureScreen` rewrite done (2026-07-30):** off `expo-camera` entirely
    (package removed, its `app.json` plugin entry replaced with a manual
    `ios.infoPlist.NSCameraUsageDescription` — see `PROJECT_SPEC.md` §3),
    onto `react-native-vision-camera-face-detector`'s `<Camera>` +
    `usePhotoOutput`. Shutter press checks live `onFacesDetected` state
    first — no face routes straight to `NoFaceDetectedScreen` (discarding
    any already-captured photos in the sequence) without ever calling
    `capturePhoto` or reaching the backend, per §2.2. Capture stays fully
    in-memory (`getFileDataAsync()` → `base64-js`, never
    `capturePhotoToFile`/a temp file) per the Privacy Architecture.
    `tsc --noEmit` and the full Jest suite (139 tests) are green.
    In fixing this, also found and fixed pre-existing lockfile drift from
    the SDK 57 upgrade blocking any `npm install` (`react-native`/
    `react-test-renderer` version mismatch — see `PROJECT_SPEC.md` §3) and a
    missing `expo-dev-client` dependency (required by `eas.json`'s
    `development` build profile).
  - **On-device verification done (2026-08-04):** built and installed a real
    EAS development client on a physical Android device (Galaxy A06,
    Android 14) and drove the full flow end to end via `adb` (screenshots +
    logcat at every step, including live-typed shutter taps) — onboarding,
    paywall test purchase, all 3 Character Analysis captures, and a real
    backend-generated reading all completed successfully. `NoFaceDetectedScreen`
    routing confirmed working (an empty/faceless frame routes there without
    ever calling `capturePhoto` or reaching the backend, per §2.2).
    - Found and fixed a real bug surfaced only by physical hardware, not
      Jest mocks: `CaptureScreen`'s `handleCapture` used a catch-less
      `try/finally`, so a failed `capturePhoto()` still silently advanced
      the step (or navigated to Analyzing) as if it had succeeded —
      producing a misleadingly-worded "check your connection" failure
      several steps later with images silently missing. Fixed to only
      advance on genuine success.
    - Found (via on-device logcat) that `react-native-vision-camera-face-detector`
      reconfigures its native camera session — an unbind/rebind cycle —
      automatically the instant `capturePhoto()` is called, and that
      reconfigure's own teardown step aborts the very request that
      triggered it (`ImageCaptureException: Camera is closed`, ~100ms,
      independent of `performanceMode`) on this device. The reconfigure
      finishes shortly after the failure, so `handleCapture` now retries
      once after a 400ms wait (an immediate retry was confirmed on-device
      to hit an even earlier failure, "Not bound to a valid Camera",
      because the rebind hadn't finished) — verified on-device this
      resolves cleanly. A capture that still fails after the retry now
      shows a real `Alert` (`capture.error.title`/`.body`) instead of
      silently resetting with no feedback.
    - Also suppressed (`LogBox.ignoreLogs` in `App.tsx`) the same
      "Camera is closed" exception when it's thrown from the library's own
      internal reconfigure coroutine rather than from the awaited
      `capturePhoto()` call — that promise isn't one this app ever holds a
      reference to, so it can't be caught locally, and it fires after the
      photo is already safely retrieved. Confirmed benign, just noisy.
    - Found and fixed a real, unrelated networking bug this pass also
      exposed: Android blocks an app's own cleartext (plain HTTP) traffic
      by default on modern `targetSdkVersion`, even though tools like `adb`/
      `nc` bypass that per-app policy entirely and falsely suggested the
      network path was fine. Added `android.usesCleartextTraffic: true` to
      `app.json` — **must come back out (or be scoped to dev builds only)
      before a real production submission**, once the backend has a real
      HTTPS domain. **Resolved 2026-08-05** — see 8.12 below.

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
- [x] **8.4 Multi-photo reveal: swipeable slider, enlarged** (2026-08-04) —
  `PhotoStripCard` (`ReadingCards.tsx`) now pages through Character
  Analysis/Relationship Harmony's multiple photos one at a time at full
  card width via `SwipeablePager` (the same component onboarding uses) with
  progress dots, instead of squeezing them into small side-by-side
  thumbnails. Career Match's single photo is unchanged (still fills the row
  directly — no pager needed for one photo).
- [x] **8.5 Reveal footer buttons enlarged** — `PrimaryButton`'s `flow`
  variant (used only by RevealScreen's Share Reading/Done buttons)
  increased from 14/16px to 18/19px padding and label size.
- [x] **8.6 Multiple share options + optional photo-in-card** — Share
  Reading now opens `ShareOptionsModal` instead of sharing immediately:
  Story Card (the existing `react-native-view-shot` image capture, now
  with an opt-in "Include my photo" toggle that embeds the first captured
  photo into `ShareCard`), Quick Message (native share sheet with a text
  summary), and Copy Text (`expo-clipboard`, new dependency — see
  PROJECT_SPEC.md). No image is ever included unless the user explicitly
  opts in, consistent with the process-and-discard privacy posture
  elsewhere.
- [x] **8.7 Transparent app icon** — `AppLogo` (used by `LoadingScreen`,
  `AnalyzingScreen`, `WelcomeScreen`, and `ShareCard`) switched from
  `logo-badge.png` to a new transparent-background mark supplied by the
  product owner (`assets/logo-badge-transparent.png`), `resizeMode:
  'contain'` since the source has generous padding around the emblem;
  dropped the now-pointless `borderRadius` on the badge frame.
- [x] **8.8 Share card builder v2** (2026-08-05) — Redefined per product
  feedback: sharing isn't a fixed text/image choice anymore, it's a
  per-module card the user builds themselves. `readingShareableSections()`
  (`api/types.ts`) flattens each module's cards into a titled-section
  picklist; `ShareOptionsModal` gained a `builder` mode with a
  photo-include toggle and a checkbox per section (`AnimatedCheckbox`,
  all-selected by default); `ShareCard` now renders whatever sections it's
  handed instead of a fixed headline/score layout, height driven by content
  instead of a fixed 9:16 crop.
- [x] **8.9 External legal links + logo size fix** (2026-08-05) — Terms and
  Privacy now open the product owner's Google Sites pages
  (`utils/legalLinks.ts`) from every surface (Onboarding consent step,
  Settings, Paywall footer) instead of an in-app modal; deleted the
  now-orphaned `PrivacyPolicyModal`/`TermsModal`/`LegalDocumentModal`
  components and trimmed `content/legalContent.ts` down to the one export
  still used in-app (`LEGAL_CONTACT_EMAIL`) — the full legal text stays
  live in `backend/src/routes/legal.ts` for the store-listing URL
  requirement, just no longer duplicated into the frontend bundle. Also
  re-cropped `assets/logo-badge-transparent.png` (source PNG's real emblem
  only filled ~23% of its canvas width) and bumped `AppLogo`'s badge sizes
  (60/168, was 44/128) — the product owner flagged the icon as "way too
  small" across loading screens.
- [x] **8.10 Fix unreachable bottom buttons on edge-to-edge Android**
  (2026-08-05) — On-device testing (Galaxy A06, Android 14, 3-button nav)
  found RevealScreen's Share Reading/Done buttons didn't respond to taps
  near the bottom of the screen; traced via `adb shell dumpsys window` to
  Android's edge-to-edge rendering drawing the system navigation bar
  (bottom 90px) on top of app content, with this app having no safe-area
  handling at all. Added `react-native-safe-area-context` (see
  PROJECT_SPEC.md), wrapped `App.tsx` in `SafeAreaProvider`, and added
  `useSafeAreaInsets().bottom` to every screen with a fixed bottom action:
  `BottomNavBar`, RevealScreen's Share/Done footer, OnboardingScreen's
  Next/Get Started footer, PaywallScreen's Subscribe footer. Verified live
  on-device (uiautomator dump confirmed the button bounds, then confirmed
  the fixed build's builder flow reaches the native share sheet).
- [x] **8.11 Fix Story Card share producing empty messages; richer text
  share** (2026-08-05) — The product owner reported the share sheet
  rejecting sends with "empty messages cannot be sent." Root cause: RN's
  `Share.share({ url: uri })` only honors `url` on iOS; on Android the
  share intent went out with no message and no attachment. Switched to
  `expo-sharing`'s `shareAsync()` (new dependency — see PROJECT_SPEC.md),
  which correctly attaches the captured PNG on both platforms. Also
  expanded the "Quick Message"/"Copy Text" template to pull in the next
  two cards after the badge (previously badge + one-line summary only)
  and append the app's store link via the existing `getStoreListingUrl()`
  helper — same placeholder-until-real-listing caveat already documented
  in `SettingsScreen.tsx`'s `SHARE_MESSAGE`.
- [x] **8.12 Backend live on Render; drop the cleartext exception**
  (2026-08-05) — Backend deployed to Render's free tier via the
  `render.yaml` blueprint (see PROJECT_SPEC.md §3, "Backend hosting"),
  confirmed live at `https://face-reader-backend-h0qb.onrender.com`
  (verified: root path 404s as expected, `POST /api/v1/reading/analyze`
  with an empty body returns the real Fastify validation error, not a
  connection failure). `frontend/.env`'s `EXPO_PUBLIC_API_BASE_URL` now
  points at that URL instead of the dev machine's LAN IP, and
  `android.usesCleartextTraffic` is removed from `app.json` — no longer
  needed now that the backend serves real HTTPS, closing out the TODO
  from 6.1.

---

## Phase 9: On-Device Bug Fixes, Reveal Polish, Catchphrase Card (2026-08-13)
Found and fixed during first real iOS dev-client testing.
- [x] **9.1 Fixed capture-screen camera freeze/black-flash** — traced to
  `react-native-vision-camera-face-detector`'s `<Camera>` wrapper rebuilding
  its `outputs` array on every render (confirmed in `node_modules`, not
  memoized upstream), which forced the native session to unbind/rebind.
  `CaptureScreen`'s per-frame `onFacesDetected` result was wired to
  `useState`, so every detection flicker (constant under normal handheld
  conditions) re-rendered the screen and triggered it. `hasFace` is now a
  ref instead — it's only ever read once, at shutter-press time, and never
  drove rendering, so a ref update triggers no re-render at all.
- [x] **9.2 `AnalyzeScreen` header alignment fix** — its header reused
  `HORIZONTAL_MARGIN` (4px, meant only for the edge-to-edge module card
  art) for its own padding, sitting well left of `ResultsScreen`/
  `SettingsScreen` headers (`Theme.spacing.gutter`, 16px). Decoupled.
- [x] **9.3 LoadingScreen ripple/logo overlap fix** — the ripple rings'
  base size (128px) was smaller than `AppLogo`'s `lg` badge (168px), so
  early in the animation the ring started inside the artwork and grew
  through it instead of starting outside it. Bumped to 190px.
- [x] **9.4 RevealScreen page indicator: dots removed, counter relocated**
  — the "n / total" counter moved from the header into the arrow row,
  replacing the dot row (tap-to-jump-any-page) entirely; now prev arrow /
  counter / next arrow only. Product direction: dots read as visual clutter
  once the counter already conveys position.
- [x] **9.5 Share-card theme swatches made more impactful** — 36px to
  56px, a checkmark + stronger glow/scale on the selected swatch instead of
  a small centered dot.
- [x] **9.6 ShareCard footer removed** (product decision, explicitly
  confirmed overriding CLAUDE.md's disclaimer-lock default) — "For
  entertainment purposes only" dropped from the share-card footer. Merged
  with a concurrent change dropping the `faceai.app` attribution from the
  same line (not an owned domain — see 8.12's Render URL work), so the
  footer is gone entirely rather than partially. The in-app disclaimer
  (`DisclaimerFooter`, every result screen) is unchanged and unaffected —
  this was the card that leaves the app, not the app's own disclaimer
  surface.
- [x] **9.7 Softened "AI" language in flavor copy, all 10 locales**
  (product decision) — reworded onboarding/paywall/analyzing/share/welcome
  copy that called the reading "AI" (e.g. "Unlock Full AI Face Insights" →
  "Unlock Full Face Insights", "Our AI is generating your reading..." →
  "Your reading is taking shape..."). Deliberately left
  `review.body`'s "helps us train our AI models" untouched — a data-use
  disclosure, not reading-flavor marketing. `legal.ts`/`legalContent.ts`
  untouched per CLAUDE.md — this was flavor copy only, not the legal or
  system-prompt safety text.
- [x] **9.8 New "Catchphrase" card, all three modules** — a short quotable
  one-liner (backend `catchphrase_card: BadgeCard`, e.g. `"Quiet Storm,
  Loud Impact"` for Character Analysis, `"Calm Meets Chaos, On Purpose"`
  for Relationship Harmony, `"Built the Spreadsheet, Ran the Room"` for
  Career Match) plus one sentence on why it fits. Positioned as card #2 in
  each module's build, right after the opening archetype/vibe/work-
  archetype hook — a second, still-brief punchy beat before the reading
  deepens, per `STRUCTURE_GUIDANCE`'s "build, not a flat list" rule. Added
  to `readingSchema.ts`'s three schemas/interfaces (and their `required`
  arrays — validated by `assertConformsToSchema`, no separate validator
  code needed), `systemPrompt.ts`'s three module prompts, mirrored in
  frontend `api/types.ts`, rendered via the existing `BadgeSummaryCard`
  (no new frontend component needed — reuses the same title/badge_tag/
  summary shape as `archetype_card`/`vibe_card`/`work_archetype_card`),
  included in `readingShareableSections()`'s picklist, and added to
  `mockReading.ts`'s fixtures. Backend (52 tests) and frontend (179 tests)
  suites both green.
- [x] **9.9 Page counter removed entirely** (product direction, follow-up to
  9.4) — the "n / total" text between the arrows is gone too; just prev/
  next arrows now, with more gap between them since nothing sits between
  them anymore. `reveal.cardProgress` (its accessibility label) dropped
  from `translations.ts` as unused. Tests rewritten to assert paging via
  the arrows' disabled-state transitions instead of the removed counter
  text, since that's the only positional signal left in the DOM.
- [x] **9.10 Variety guidance strengthened** — `VARIETY_GUIDANCE`
  (systemPrompt.ts) now explicitly asks the model to weigh several
  candidates and pick the least obvious one before committing to any
  open-ended pick, and extends the same push to phrasing/sentence
  structure, not just named picks (celebrity, spirit animal, archetype,
  catchphrase) — product ask: "much more various outcomes."
- [x] **9.11 Career Match: new "Strengths & Growth Areas" card** — a
  two-column pill breakdown (`strengths_growth_card: { strength_pills,
  growth_pills }`), same pattern as Character Analysis' `traits_card` and
  Relationship Harmony's `dynamics_card`, reusing the existing `PillsCard`
  component. Growth pills stay framed as tendencies to balance, never
  flaws/deficits/performance issues, consistent with how `growth_pills`
  is already framed everywhere else in this app — CLAUDE.md's "no
  negative or trust-undermining claims" applies here same as elsewhere,
  so this delivers the requested strengths/weaknesses table without the
  blunt "weaknesses" framing. Positioned between Recommended Industries
  and Ideal Role Matches (which stays the richest, last card). Added to
  `readingSchema.ts`/`systemPrompt.ts` (backend) and `api/types.ts`/
  `RevealScreen.tsx`/`mockReading.ts` (frontend).
- [x] **9.12 Richer content across all three modules** — `checklistCard`'s
  minimum items bumped 2→3 (Relationship Harmony's Harmony Recommendations,
  Career Match's Ideal Role Matches both get a third suggestion minimum);
  Character Analysis' `traits_card.metadata_badges` minimum bumped 2→3;
  `celebrity_match_card.match_description` bumped from two-to-three
  sentences to three-to-four, "across several concrete beats rather than
  one general impression." `minItems`/`maxItems` are Gemini-generation-time
  hints only (confirmed: `assertConformsToSchema` in `readingService.ts`
  doesn't re-check array counts, only presence/type), so this needed no
  fixture changes to keep tests passing — only the new 9.11 field did.
  Backend (52 tests) and frontend (179 tests) suites both green again.
- [x] **9.13 In-app disclaimer (`DisclaimerFooter`) removed from
  RevealScreen** — explicit product override of CLAUDE.md's disclaimer
  lock, confirmed after flagging the App Store review/liability
  implications directly (this is the persistent entertainment-only notice
  shown on every result inside the app, not the ShareCard footer from 9.6,
  which only affected images shared externally). `DisclaimerFooter.tsx`/
  `.test.tsx` deleted outright (no other screen imported it — PaywallScreen
  has its own separate disclaimer surface, untouched, out of scope of this
  request), `disclaimer.text` dropped from `translations.ts` as orphaned.
  Frontend suite: 177 tests (down from 179 — the component's own test and
  RevealScreen's "always renders the disclaimer" assertion both removed
  along with what they were testing).
- [x] **9.14 Apple §3.1.2 subscription-disclosure gaps closed** — audited
  the paywall/Terms against Apple's required auto-renewable-subscription
  disclosures (the most common subscription-app rejection reason).
  `legal.ts`'s "Subscriptions & Free Trial" section now states payment
  charges to the Apple ID/Google Play account at confirmation, the exact
  24-hour renewal/cancellation window (was vague "unless cancelled
  beforehand"), and that an unused free-trial portion is forfeited on
  purchase; `LEGAL_LAST_UPDATED` bumped to August 13, 2026. New
  `paywall.renewalDisclosure` (all 10 locales) renders directly under the
  Subscribe button in `PaywallScreen.tsx`, deliberately separate from the
  existing `paywall.reassurance` marketing line — no price embedded in it
  since both plan cards already show their own real price above it.
  Backend (52 tests) and frontend (177 tests) suites both green.
- [x] **9.15 Fixed 502 on every real reading — stray shell env var was
  shadowing GEMINI_API_KEY** (2026-08-15) — a placeholder-looking
  `GEMINI_API_KEY=AIza...` was set somewhere in the local shell environment
  (source not tracked down — not in `.bashrc`/`.profile`/`.zshrc`/
  `/etc/profile.d`/systemd user env, but present in every fresh login
  shell); `dotenv`'s default behavior never overrides a variable that's
  already set, so it silently won over the real key in `backend/.env`,
  and every live Gemini call failed with "API key not valid" — wrapped
  generically by `readingService.ts`'s catch-all as "Failed to reach the
  Gemini API." (502), indistinguishable from a real network failure
  without checking the actual thrown error. `config/env.ts` now calls
  `dotenv`'s `config({ override: true })` so `.env` always wins regardless
  of what the shell happens to have exported — reproduced with a live
  Gemini call (confirmed broken with the stray var present, confirmed
  fixed with the code change even with the stray var still set), verified
  again against the actually-running dev server after `tsx watch`
  auto-restarted it. Backend suite (52 tests) still green.
- [x] **9.16 Fixed AnalyzingScreen spinner getting stuck after repeated
  retries** — pulse/spin were native-driver `Animated.loop()`s started
  once at mount and left running indefinitely; on-device testing found
  the spinner could stop visibly advancing after several retries (not
  traced to one root line — the native driver's loop state getting
  wedged after enough start/stop churn). Every retry now explicitly stops
  whatever loop is running, resets both values, and starts a fresh one,
  so the spinner can never be stuck on a dead animation regardless of
  the previous loop's actual state. Also added an in-flight guard so a
  rapid double-tap on "Try Again" can't fire two overlapping
  `analyzeReading()` calls racing each other's resolution.
- [x] **9.17 Reveal screen made interactive; 9 share-card color options**
  (product feedback: reveal screen "too plain," share palettes "too
  similar") —
  - `CardHeader` bigger and glowing (18px plain gold → 22px with a soft
    text-shadow, icon 22px → 30px) so every card opens with the same
    visual weight the punchline text already had, not just the hook card.
  - `ChecklistCard` (Harmony Recommendations, Ideal Role Matches) is now
    an accordion — headline always visible, description (already the
    richest writing per `STRUCTURE_GUIDANCE`) hidden until tapped, one
    open at a time, `LayoutAnimation` for the expand/collapse, haptic on
    toggle. First item starts open so the card doesn't read as empty
    before any interaction.
  - `HighlightCard` (Spirit Animal Match, Celebrity Archetype Match) now
    shows the name immediately but holds the description behind a "Tap to
    reveal ✨" prompt, fading in on tap. New `reveal.tapToReveal` key,
    all 10 locales.
  - `ReadingScoreCard`'s four sub-score bars now animate their fill width
    from 0 on mount (staggered 150ms delay) instead of appearing
    pre-filled — the score number itself stays immediate/synchronous
    (a count-up version was tried and reverted: it starts at 0 and
    animates via `requestAnimationFrame`, which doesn't resolve
    synchronously in the test environment and broke the existing
    "renders the overall score" assertion — not worth chasing for a
    minor flourish).
  - `SHARE_CARD_PALETTES` (theme.ts) expanded from 4 to the full 3x3 grid
    of the 3 locked background tokens x 3 locked accent tokens (still no
    new hex values — `crimsonPrimary` just hadn't been used as a card
    accent before, only gold/iridescent had). Named, not just id'd
    (Crimson/Ember/Amethyst/Burgundy/Rosewood/Velvet/Nightfall/Eclipse/
    Midnight) — at 56px two palettes sharing an accent read as near-
    identical circles, so the picker now shows a name label per swatch;
    the full-size share card itself makes the background difference
    obvious even where the tiny swatch doesn't. `paletteRow` wraps
    (3 rows of 3) instead of overflowing. `iridescent` id renamed
    `amethyst`, test reference updated.
  - Frontend suite: 177 tests, still green (verified the accordion/reveal
    changes didn't silently need test updates — no test asserted on
    checklist description text or highlight-card description text being
    immediately rendered, only on the always-visible headline/name, which
    is why nothing broke).

---

## Phase 10: Gamified Reveal Screen Redesign (2026-08-15)
Product ask: "Duolingo/Spotify-Wrapped/Co-Star caliber" overhaul of the
reveal screen — real swipe physics, richer per-card-type visuals,
gamification, a story-format share option. Two corrections to the literal
ask, both flagged before starting: `expo-av` (named in the request) stays
banned per CLAUDE.md/PROJECT_SPEC.md — deprecated, no SDK-57-compatible
release — so the new transition sound uses `expo-audio` instead; `npx expo
typecheck` isn't a real command in this project, `npx tsc --noEmit` is what
was actually run throughout.
- [x] **10.1 New dependencies: react-native-reanimated (4.5.1),
  react-native-gesture-handler (~2.32.0), react-native-svg (15.15.4)** —
  installed via `expo install` (SDK-57-compatible versions), documented in
  PROJECT_SPEC.md. No `babel.config.js` added: read `babel-preset-expo`'s
  own source and confirmed it already auto-detects and wires
  `react-native-worklets/plugin` whenever the package is resolvable,
  exactly like it already does for vision-camera's worklets dependency —
  a babel.config.js was briefly added, then deliberately removed after
  realizing it would double-apply the plugin on top of that auto-detection
  and lose Metro's zero-config context options. `index.ts` gained the
  required `import 'react-native-gesture-handler'` first line; `App.tsx`
  gained the required `GestureHandlerRootView` wrapper.
  `jest.config.js` needed three real additions to make any of this
  testable at all (the official reanimated `mock.js` alone wasn't
  enough — it still imports from reanimated's real `index.ts`, which pulls
  in worklets' native initializer regardless): `react-native-worklets`'s
  own Jest resolver (`react-native-worklets/jest/resolver.js`, which stops
  Jest resolving worklets' `.native.ts` files), a `moduleNameMapper` entry
  pointing `react-native-reanimated` at its own `mock.js`, and
  `react-native-gesture-handler`'s official `jestSetup.js`.
- [x] **10.2 GestureCardDeck** (`components/common/GestureCardDeck.tsx`) —
  real pan-gesture-driven paging replacing SwipeablePager on the reveal
  screen specifically (SwipeablePager itself untouched — onboarding still
  uses it, and doesn't need reanimated/gesture-handler pulled in for its
  own simple linear carousel). Every page's scale/opacity is a single
  `useAnimatedStyle` computed off two shared values (`baseX` settled
  position, `dragX` live gesture offset), so the whole deck reacts to one
  drag as a system instead of each page animating independently.
  Committing a swipe (distance or velocity threshold) fires
  `Haptics.impactAsync(Light)`, a `Haptics.notificationAsync(Success)` on
  reaching the last card, and — if enabled — a transition chime.
- [x] **10.3 StoryProgressBar** — Instagram/Spotify-Wrapped-style segmented
  bar replacing the removed page counter (9.9) at the top of the screen.
- [x] **10.4 Fallback nav arrows kept, made deliberately subtle** — swipe
  is primary now; the arrow row (same testIDs/behavior as before) stays
  for accessibility/screen-reader users and anyone who doesn't swipe, but
  shrunk and the same haptic/sound treatment as a swipe wired into it too
  (`goToPage` in RevealScreen.tsx), so it doesn't feel like a lesser path.
- [x] **10.5 Bigger card headers** — see 9.17, already done; this phase's
  goal 1 ("bigger and more exciting headers") was already satisfied by
  that pass.
- [x] **10.6 RarityBadge** (`components/common/RarityBadge.tsx`) — top-right
  of every card via `CardHeader`'s new optional `raritySeed` prop.
  Deterministic (a hash of the card's own content — badge_tag/title/name,
  never random), not a real statistic: there's no population of other
  users' readings anywhere in this app to compute an actual percentile
  against, and nothing about the copy claims otherwise ("✦ Top {percent}%
  · {auraName} Aura", same "vibe" register as the rest of the reading).
  `auraName` reuses `SHARE_CARD_PALETTES`' names (Ember, Amethyst,
  Rosewood, ...) rather than inventing new flavor text — ties this back to
  the same visual language the share-card colors already established.
- [x] **10.7 FaceShapeIcon + FacialStructureCard** — real SVG (react-native-
  svg primitives — Ellipse/Rect/Polygon, not hand-tuned bezier paths, so
  geometry is predictable without needing visual iteration to get a custom
  curve looking right), one shape per real `shape_tag` enum value
  (readingSchema.ts's FACE_SHAPES), not a fabricated radar chart — there's
  no numeric per-feature jawline/cheekbone/forehead data in the schema to
  plot a real one against. A dashed vertical symmetry axis plus a brief
  mount-time opacity/scale entrance (via `useAnimatedProps`) is the
  "animated face-symmetry wireframe" the ask specifically named.
  `BadgeSummaryCard`'s generic rendering of `facial_structure_card`
  retired in favor of this dedicated component.
- [x] **10.8 Sound toggle** (`preferencesSlice.ts`, new — in-memory only,
  same as every other preference in this store today) — Settings → General
  → Sound Effects, a real `Switch` row (`SettingsRow` gained a `toggle`
  variant). `sound.ts` gained `playSwipeChime()`, reusing the existing
  prompt-chime asset rather than a new one (no audio-generation tool
  available in this environment to design a genuinely new sound).
  GestureCardDeck and RevealScreen's fallback arrows both check
  `soundEnabled` before playing it.
- [x] **10.9 Story-format (9:16) share card** — `ShareCard` gained a
  `layout?: 'flexible' | 'story'` prop (default unchanged) rather than
  reverting the 2026-08-05 product decision that deliberately moved away
  from a fixed 9:16 crop for everyone. `'story'`: fixed height, first
  selected section (in practice always the archetype/vibe/work-archetype
  card, since `readingShareableSections` always orders it first) becomes a
  big hero treatment, up to 3 more selected sections become compact badge
  chips, anything past that is dropped rather than overflowing the fixed
  canvas. New checkbox in `ShareOptionsModal`'s builder.
- [x] **10.10 Verification** — `tsc --noEmit` clean; full suite 30/30
  suites, 179/179 tests (up from 177 — added real story-layout coverage
  in `ShareCard.test.tsx` rather than just eyeballing it); `expo-doctor`
  run as an extra check given how many native modules landed in one pass —
  2 pre-existing findings surfaced (react-native-nitro-image's New-
  Architecture flag, already documented in PROJECT_SPEC.md from the
  vision-camera work; 8 unrelated packages with patch-version drift, none
  of which are the 3 added here) — neither touched, out of scope for this
  pass, flagged as a follow-up instead of bundling an unrelated dependency
  bump into this change.
- [x] **10.11 Fixed frequent 502s — retry transient Gemini 503s**
  (2026-08-15) — live testing found `gemini-flash-latest` returning a real
  503 UNAVAILABLE ("This model is currently experiencing high demand...")
  on roughly 2 of every 3 calls in a short burst; confirmed via direct SDK
  calls bypassing this app entirely (a standalone debug script, deleted
  after use), so this is Google's model capacity, not this app's key,
  config, or code — every occurrence was surfacing as a hard 502 with zero
  retry, so a single short-lived capacity blip read as a broken feature.
  `readingService.ts`'s `generateContentWithRetry` now retries up to 2
  more times (600ms/1200ms backoff) on 429/500/503 specifically
  (`ApiError.status`, real SDK error class) before giving up as the same
  `ReadingServiceError` → 502 as before. New tests cover retry-then-
  succeed, exhausting all 3 attempts, and NOT retrying a genuinely
  non-retryable error (a real 400). Backend suite: 55 tests (up from 52).
- [x] **10.12 Share card selection cap (fixes intermittent capture
  failures)** — the flexible-layout ShareCard has no max height; with a
  photo plus most/all of a 5-6-section module selected, the off-screen
  view got tall enough that react-native-view-shot's capture sometimes
  silently failed or came back missing content ("insights" dropped from
  the shared image) rather than throwing a catchable error — product
  report, 2026-08-15. `MAX_SELECTABLE_SECTIONS` (5, exported from
  ShareOptionsModal.tsx) caps both manual selection (already-unchecked
  boxes past the cap go disabled, not hidden — a vanished option reads as
  a bug, greyed-and-inert reads as "at the limit") and the *default*
  selection in RevealScreen.tsx, which needed fixing too: "every section
  starts selected" (2026-08-05) meant a user who never opened the builder
  could still hit the same too-tall capture with a 6-section module.
  `AnimatedCheckbox` gained a `disabled` prop. New tests cover the cap
  directly (celebrity starts unchecked+disabled, becomes selectable once
  something else is dropped) — the existing "excludes an unchecked
  section" test had to switch from celebrity (6th, now excluded from the
  default 5) to spirit-animal (5th, still defaults on).
- [x] **10.13 Fixed rarity badge/title collision** — `CardHeader`'s badge
  was absolutely positioned over a `paddingRight: 96` guess meant to clear
  it, but the badge itself allows up to 170px (aura names vary in length,
  percent is 1-2 digits) — any badge wider than the guessed padding
  overlapped the title. Replaced with real flexbox: title group `flex: 1`
  (truncates via `numberOfLines={2}` under pressure), badge `flexShrink:
  0` in a plain `justifyContent: 'space-between'` row — no fixed-width
  guess for either side to get wrong.
- [x] **10.14 "Don't look too plain" pass — declined the Tarot-deck
  theming, kept the interaction ambition** — a follow-up request asked
  for a full "Mystical Tarot Deck" reskin (Oracle Quote, Save to
  Grimoire, occult back-of-card pattern, Roman-numeral card headers,
  sacred geometry). Flagged and declined outright, not softened or
  reinterpreted: CLAUDE.md's Entertainment Framing explicitly bans
  "medieval, Ottoman, or ancient fortune-telling tropes" and calls for
  "a clever friend, not a fortune teller" — an app that reads faces
  presenting itself as tarot/oracle is exactly that line, not an
  adjacent gray area, and it's a locked, product-wide rule, not a
  per-screen style choice. Rebuilt the same interaction ambition in the
  app's actual register instead:
  - `ReadingGlassCard` (local wrapper around `GlassCard`, not a change to
    `GlassCard` itself — it's used across Settings/Paywall/Onboarding too
    and this framing is reveal-screen-specific): viewfinder-style gold
    scan corners on every card, reading as "AI actively scanning this"
    rather than an ornate picture frame.
  - `HighlightCard`'s reveal upgraded from a fade to a real 3D card flip
    (two-phase `rotateY`, content swapped at the exact edge-on midpoint —
    a single continuous 0-180deg spin with a mid-flight swap was tried
    first and rejected, the back content rendered mirrored past 90deg
    since it was still riding the rotation that started facing the wrong
    way). `Haptics.impactAsync` bumped from Light to Medium on flip,
    matching the weight of an actual flip vs. a simple tap.
  - `FaceShapeIcon` gained 4 pulsing gold landmark nodes (forehead/two
    cheekbones/chin, generic positions not per-shape-tuned) — the same
    visual language real on-device face-landmark detection UIs use
    (MediaPipe/ARKit mesh points), not "sacred geometry": the mechanic
    (pulsing anchor points) was fine, only the name for it wasn't.
  - Declined for now, not silently dropped: the "expanded narrative"
    request (Oracle Quote/Anatomic Origin/Living Scenario/Shadow Trait as
    4 new AI-generated sections per card) would be a 3rd full backend
    schema/prompt expansion in one session on top of 9.8's catchphrase
    card and 9.11's strengths/growth card — flagged as a real option for
    a focused follow-up rather than bundled into an already-large visual
    pass.
  - `tsc --noEmit` clean, full suite still 30/30 suites, 180/180 tests
    (the flip/scan-corner changes didn't need test updates — existing
    assertions check `accessibilityState.expanded` and text presence, not
    animation mechanics).
- [x] **10.15 Fixed HighlightCard flip not rendering on-device** — 10.14's
  flip used core RN `Animated` with a `perspective` transform under
  `useNativeDriver: true`; on-device only the `ScanCorners` decoration
  showed up (confirming the bundle was current), the flip itself never
  visibly rotated — a known unreliable combination in core Animated on
  some RN/platform builds. Rebuilt on `react-native-reanimated`
  (`useSharedValue`/`useAnimatedStyle`/`withTiming`/`interpolate`,
  aliased `ReAnimated`/`reInterpolate` to avoid colliding with the
  file's existing core-`Animated` import used by `MetricBar`'s fill
  bar), preserving the same two-phase 0→90deg / -90deg→0deg rotation
  with the content swap driven by `runOnJS(setShowBack)` at the
  `withTiming` completion callback, landing exactly at the edge-on
  midpoint as before. `tsc --noEmit` clean, full suite 30/30 suites,
  180/180 tests.
- [x] **10.16 Longer LLM reading output** — feedback that reading copy
  wasn't substantial enough. No output-token cap existed to raise and no
  new fields/cards were added — see PROJECT_SPEC.md §4 (2026-08-15) for
  the full breakdown. Raised sentence-count guidance in
  `readingSchema.ts`'s prose `description` fields (facial structure and
  spirit animal 2-3→4-5 sentences, celebrity match 3-4→6-8 sentences, the
  shared checklist-item description used by Harmony/Career's richest
  cards 2-3→4-5 sentences), and added an anti-padding line to
  `systemPrompt.ts`'s shared `STRUCTURE_GUIDANCE` so the model fills that
  length with new concrete detail rather than restating itself. Left
  the badge-card hook summaries and all pill/badge fields untouched —
  intentionally short by design, not the part that read as thin.
  Confirmed no frontend truncation would clip the longer text (none of
  the affected `Text` elements in `ReadingCards.tsx` set
  `numberOfLines`, unlike `cardTitle`/`metricLabel` which do) — no
  frontend change needed. `tsc --noEmit` clean on both frontend and
  backend, backend suite 8/8 suites, 55/55 tests, frontend suite
  unaffected (30/30, 180/180).
- [x] **10.17 Mitigated frequent 502s from Render free-tier cold
  starts** — "way too many 502 errors" traced to PROJECT_SPEC.md §3's
  already-flagged risk: the free-tier container spins down after 15 min
  idle and takes ~30-60s to cold-start, during which Render's proxy
  returns 502. Two code-side mitigations, both non-billing (the actual
  fix — the paid Starter tier — stays a flagged cost decision for the
  product owner, not applied here):
  - `backend/src/routes/health.ts`'s `GET /health` (rate-limit exempt,
    same as `/legal/*`) exists purely as a pre-warm target, not real
    uptime monitoring.
  - `frontend/src/api/reading.ts`'s new `warmUpBackend()` fires a
    fire-and-forget ping at it from `CaptureScreen`'s mount — the
    earliest point in the flow with real user time ahead of it
    (framing/retaking three shots) to absorb the cold start before
    Submit. No-ops in mock-API mode; swallows every failure, since it's
    purely a head start and `analyzeReading()`'s own checks are what
    surface a real problem.
  - `analyzeReading()` also now retries specifically on a 502 response
    (up to 3 attempts, 3s/6s backoff) — every other failure (4xx,
    non-502 5xx, network error) still fails on the first attempt, since
    retrying those wouldn't help.
  - `CaptureScreen.test.tsx` mocks `../api/reading`'s `warmUpBackend`
    (new dependency the test didn't have before) and asserts it fires
    once on mount. `reading.test.ts` gained fake-timer-driven tests for
    both the retry-then-succeed and exhaust-retries-then-throw 502
    paths, plus coverage for `warmUpBackend` in both real and mock API
    modes. `tsc --noEmit` clean on both sides; backend 9/9 suites,
    57/57 tests; frontend 30/30 suites, 186/186 tests.
- [x] **10.18 Found and fixed the real cause of the 502s — Gemini quota
  exhaustion, then a missing call timeout** — 10.17's mitigation was
  real but incomplete: it treated every 502 as a Render cold start,
  when the actual backend was itself the one returning 502 (see
  `routes/reading.ts`'s `ReadingServiceError` → 502 mapping). Live
  diagnosis (direct SDK calls to Gemini using the real key, bypassing
  this app entirely) found two distinct, compounding causes:
  - `gemini-flash-latest`, the auto-updating alias PROJECT_SPEC.md §4
    deliberately chose, had rolled forward to `gemini-3.7-flash` on
    Google's own schedule — exactly the risk flagged when that alias
    was picked. That model's free tier allows only 20 requests/day on
    this key/project, already exhausted. Fixed for now by rotating
    `GEMINI_API_KEY` (locally and in Render's dashboard — Render env
    vars are a separate secret from `.env`, `render.yaml`'s `sync:
    false`) to a key with available quota; billing on the Google Cloud
    project is still the real long-term fix, flagged to the product
    owner as a cost decision.
  - After rotating the key, a second failure surfaced: a request that
    hung 90+ seconds with zero bytes back. Root cause — nothing in the
    whole chain (`@google/genai` client, this service's retry loop,
    Fastify) ever set a timeout, so a stalled Gemini connection just
    hung forever. Fixed in `readingService.ts`: added
    `config.httpOptions.timeout` (`TIMEOUT_MS_PER_ATTEMPT`, 25s) per
    attempt, and switched the retry check from `isRetryableApiError`
    (an allowlist of known-good `ApiError` statuses — 429/500/503) to
    `isRetryableError` (a denylist of known-bad ones —
    400/401/403/404), since a timeout/abort doesn't necessarily throw a
    clean `ApiError` and was silently falling through the old allowlist
    as non-retryable.
  - `readingService.test.ts` gained a test asserting a raw non-`ApiError`
    failure (a timeout/abort shape) still gets retried and succeeds on
    a later attempt; the existing 503-retry and 400-no-retry tests still
    pass unchanged under the new denylist logic. `tsc --noEmit` clean,
    backend suite 9/9 suites, 58/58 tests.
- [x] **10.19 "Deep Master Card" Oracle/Arcana redesign — full reveal
  screen rebuild across all 3 modules** — a detailed, explicit redesign
  brief asked for a "ritualistic" tap-to-reveal mechanic, full-height
  deep-lore multi-section cards, and Oracle/Arcana/Shadow-Arcana
  terminology. Flagged before starting (same conflict as 10.14's Tarot
  Deck decline, now escalated with a second concrete problem: the
  brief's example metrics — "94% correlation... across geometric facial
  datasets", "1 in 420 Scans" — are fabricated statistics presented as
  real data, not just a tone question). Product owner explicitly
  overrode both: "ship it as literally specified." Updated CLAUDE.md's
  Entertainment Framing section itself to record the override precisely
  (Oracle/Arcana vocabulary authorized; real historical/religious
  framing and fabricated-statistic claims still off-limits; safety
  rules — no clinical language, no negative claims — never overridden).
  Two follow-up mid-turn corrections from the product owner shaped the
  final design: (1) system prompts can be edited freely for longer,
  richer content — no separate authorization needed per field; (2) the
  pre-existing `RarityBadge` aura concept (a palette color name picked
  by hash, e.g. "Velvet Aura") was called out as meaningless filler once
  seen next to real trait content — direct root cause for this
  redesign's METRIC_GUIDANCE requiring every flavor stat to carry a real
  generated explanation, and for polarity meter sides having to be
  genuine trait pairs, never a color/gem name. Also took the initiative
  (per explicit product direction: "be generative... make their results
  richer too") to bring the same treatment to Relationship Harmony and
  Career Match, adapted to what actually fits a pair/career context
  rather than forcing character-analysis-specific concepts (Spirit
  Animal, Sacred Anatomy) onto them.
  - **Backend** (`readingSchema.ts`, `systemPrompt.ts`): new shared
    building blocks — `MasterCardNarrative` (hero_hook/
    anatomical_decoding/living_scenario/actionable_insight, identical
    across every card in every module), `PolarityMeter`, `AuraProfile`,
    `RarityIndex`, `MythicTale` (a distinct fantastical-fable register
    on each module's Shadow Arcana card, separate from the grounded
    living_scenario — added mid-session at product request, protagonist
    must still mirror the reading's real archetype). Character Analysis
    → 5 cards (Oracle Match, Sacred Anatomy, Animal Totem, Trait
    Symphony, Shadow Arcana); Relationship Harmony and Career Match each
    consolidated to 4. `checklistCard` refactored to share a
    `checklistItemsArraySchema` helper (needed since `guidance_checklist`/
    `role_recommendations` now sit as bare array properties, not
    wrapped in their own titled sub-object). Removed the now-fully-
    unused `badgeCard()` helper and `BadgeCard`/`MetadataBadge`
    interfaces. Live-verified against the real Gemini API: three-
    expression's 5-card schema (the most complex) and career-match's
    4-card schema both returned complete, valid structured output
    (career-match's response also correctly exercised the existing
    no-face-detected safety path); relationship-harmony hit Gemini's
    known capacity flakiness during verification, not a schema issue —
    it shares the identical building blocks as the two that succeeded.
  - **Frontend**: new `TapToRevealCard` (ornate obsidian/gold-filigree
    frame — reusing only existing locked `Theme.colors.*` tokens, no new
    hex values — veiled card-back with a pulsing Reanimated glow and a
    "Tap to Unveil Your Oracle" prompt, then the same proven two-phase
    Reanimated 3D flip from 10.15's `HighlightCard` fix, medium haptic +
    a new `playRevealChime` reusing the existing prompt-chime asset).
    New `MasterCard` (the generic narrative renderer, identical across
    all 3 modules — this is also where the explicit "fix header
    overlap" ask got solved structurally rather than patched: headers
    are a plain two-child flex row, icon + `numberOfLines`-capped title,
    and no stat is ever crammed into the header row anymore since every
    per-card metric now renders in its own `statsSection` block below
    the hero_hook). New `MasterCardStats.tsx` (small focused pieces:
    `NameChip`, `AuraStat`, `ResonanceStat`, `RarityStat`,
    `GoldenRatioStat` + `FaceShapeIcon` reuse, `StructuralDominanceStat`,
    `SynergyScoreDial`, `IndustryPillsRow`, `MutedPillsRow`,
    `AdviceNote`, and `ChecklistRows` — an accordion, the explicit
    "interactive accordions/expansion pins" ask). New
    `PolarityMeterBar.tsx` (dual-sided animated bar). `ReadingCards.tsx`
    trimmed to just `PhotoPageCard` — every other renderer it held
    (badge/checklist/pills/highlight/score cards, `ScanCorners`/
    `ReadingGlassCard`) was fully superseded, deleted rather than kept
    alongside the new system. `RarityBadge.tsx` deleted outright — its
    entire premise (a hash-picked palette name) is the specific thing
    this redesign's metric-honesty rule exists to prevent recurring.
    `api/types.ts`, `api/mockReading.ts` rewritten to mirror the new
    backend shapes exactly. `readingBadgeCard()`/`readingShareableSections()`
    adapted (ResultsScreen's history rows and the ShareCard/
    ShareOptionsModal builder needed no other changes — both already
    consumed readings only through these two generic helpers).
    `RevealScreen.tsx`'s `readingCards()` fully rewritten to compose
    `TapToRevealCard`+`MasterCard`+stats for all 13 card variants across
    3 modules; `GestureCardDeck`/`StoryProgressBar`/swipe-gesture/share-
    flow infrastructure untouched (page count changed — 5 cards for
    character-analysis, 4 for the other two — but the pager mechanism
    itself already handled a variable page count correctly).
  - New i18n keys (`reveal.tapToUnveil`, `reveal.whatItSays`,
    `reveal.livingScenario`) across all 10 locales; removed now-fully-
    unused keys (`reveal.strengths`/`growthEdges`/`tapToReveal`/
    `bestChemistry`/`vibesToAvoid` — only ever consumed by the deleted
    `ReadingCards.tsx` renderers).
  - `RevealScreen.test.tsx` rewritten for the new testIDs and the
    veiled-until-tapped behavior (every content assertion now presses
    a card's own `-reveal` testID first — `GestureCardDeck` mounts every
    page simultaneously, confirmed by reading its source, so this works
    without needing to swipe to a page first). `types.test.ts`,
    `ResultsScreen.test.tsx`, `useAppStore.test.ts`, `reading.test.ts`
    fixtures updated to the new shapes. `tsc --noEmit` clean on both
    frontend and backend; backend suite 9/9 suites, 58/58 tests;
    frontend suite 30/30 suites, 188/188 tests.
- [x] **10.20 Share builder polish — palette slider, story+photo text
  drop fix** — post-redesign feedback after seeing 10.19 live.
  - Palette picker felt crowded (9 swatches wrapped into 3 stacked rows
    inside an already content-heavy builder sheet). Converted
    `ShareOptionsModal`'s palette row from a wrapped `View` to a
    horizontal `ScrollView` — a single swipeable row instead of 3,
    same swatches/testIDs/interaction, just laid out differently.
  - **Real bug, not cosmetic**: selecting Story format together with
    Include Photo silently dropped the share card's text. Root cause —
    `ShareCard`'s `'story'` layout gives the card a *fixed* 9:16 height,
    but `body` (photo + hero text + badges) sized itself off natural
    content rather than being flex-bounded to that fixed canvas. A
    full-square photo (aspectRatio 1 at the card's own width) alone ate
    more than half the fixed height, pushing the hero text past the
    card's actual laid-out bounds — `react-native-view-shot`'s
    `captureRef` snapshots exactly that frame, so the text was silently
    cropped out of the captured image even though it was still mounted
    in the tree (nothing errored, nothing warned). Fixed by bounding the
    flex chain in story mode (`body` gets `flex: 1`, so `heroSection`'s
    pre-existing `flex: 1` finally has real space to claim) and capping
    the photo to a fixed 150px height instead of a full aspect-ratio
    square specifically in story mode, so the fixed canvas has
    guaranteed room left for the rest. Flexible layout untouched (no
    fixed ceiling to overflow past there by construction).
  - `ShareCard.test.tsx` gained 3 tests: hero text and badges still
    render with a photo in story layout; the photo gets the capped
    150px-height style (not aspectRatio) specifically in story layout;
    flexible layout's photo stays a full square, unaffected by the cap.
    `tsc --noEmit` clean, frontend suite 30/30 suites, 191/191 tests.
- [x] **10.21 Hardened the story+photo fix — hard caps, not estimates**
  — user reported 10.20's fix still failed on some readings. Root cause
  of the gap: the flex-bounding fix was correct but only *estimated*
  that a 150px photo would leave enough of the fixed 9:16 canvas for
  the hero text — a long hero_hook plus wrapped badges could still
  exceed the actual space left, and nothing capped the text length or
  hard-clipped the frame, so it could still silently overflow past
  `captureRef`'s captured bounds in heavier content. Per explicit
  direction ("if necessary don't allow the user to overfill the card"),
  replaced the estimate with hard guarantees in `ShareCard.tsx`:
  - Badges drop from 3 to 1 (`STORY_BADGE_LIMIT_WITH_PHOTO`) specifically
    when a photo is also present — frees up guaranteed room for the
    hero text, which is more valuable content than a couple of tiny
    badge chips repeating card titles.
  - `heroBody` gets a hard `numberOfLines` cap (3 with a photo, 5
    without) — worst case is now a truncated sentence with an ellipsis,
    never vanished text.
  - `cardStory` gained `overflow: 'hidden'` as a defense-in-depth
    backstop — belt and suspenders so any still-untested content
    combination clips visibly at the frame's edge at worst, rather than
    silently disappearing from the capture the way the original bug did.
  - `ShareCard.test.tsx`: updated the photo+story regression test for
    the new 1-badge cap, added a test confirming the badge count drops
    specifically because of the photo, and a test confirming
    `numberOfLines` differs correctly with vs. without a photo. `tsc
    --noEmit` clean, frontend suite 30/30 suites, 193/193 tests.
- [x] **10.22 Folded the mythic tale into the shareable text, with a
  length quota** — the Shadow Arcana card's fable already rendered on
  the reveal screen (10.19) but was never included in what actually
  gets shared — product feedback: "add this little fable, story part
  to the results". `readingShareableSections()` (`api/types.ts`) now
  folds the tale title + an excerpt into each module's shadow/arcana
  section body. Deliberately an excerpt of the first paragraph only
  (capped at 160 chars, matching the rough size of another section's
  hero_hook), not the full three paragraphs — flagged and fixed in the
  same pass ("make sure everything still fits... create a quota if
  needed"): flexible layout renders every selected section's full body
  with zero truncation, so a single section ballooning 2-3x longer than
  its neighbors reopens exactly the capture-height risk
  `MAX_SELECTABLE_SECTIONS` (10.12) exists to prevent — that cap bounds
  section *count*, not one section's length, so it needed a companion
  length cap now that a section can carry meaningfully more content.
  `types.test.ts` gained tests for both: the tale appearing in the
  share body, and a synthetic long fable getting truncated with an
  ellipsis rather than included in full.
  `RevealScreen.test.tsx`'s mythic-tale fixture title happened to
  contain "Wolf" (collided with the spirit-animal fixture value once
  the tale started appearing in the off-screen ShareCard too) — first
  rename attempt ("...Crimson Ember") collided with a *different*
  fixture value (the oracle aura's name) for the same reason; settled
  on "The Hollow Reckoning", checked against every other string value
  in the fixture first. `tsc --noEmit` clean, frontend suite 30/30
  suites, 195/195 tests.
- [x] **10.23 Dual Gemini key failover ("minimize reading fails as much
  as you can with those two keys")** — after linking billing on the
  original key, a second key was obtained (initially framed as "one key
  per module" to spread quota). Implemented, then reconsidered per
  explicit direction: a static module-to-key assignment doesn't help an
  individual request when its one assigned key is the one having a bad
  moment (quota blip, transient 503), so redesigned as a failover pair
  instead — every request now retries across *both* clients.
  - `readingService.ts`: `generateReading`/`generateContentWithRetry`
    take an ordered `ReadingModelClient[]` instead of a single client;
    retries cycle through the list (`clients[(attempt - 1) %
    clients.length]`), and `MAX_GENERATION_ATTEMPTS` bumped 3 → 4 so
    two clients each get an even two tries.
  - `geminiClient.ts`'s `everyModule()` helper now wraps a client list
    (not a single client) into a per-module map, used both by
    `server.ts` (single-key fallback) and every test's `buildApp` call.
  - `server.ts`: each module tries its own key first, the other key
    second — character analysis (the app's main flow, highest traffic)
    prefers its own key so it isn't competing with the other two
    modules by default, while still falling back to the shared key
    under failure.
  - `app.ts`/`routes/reading.ts`: `buildApp`/`registerReadingRoutes`
    now take `Record<ReadingModuleId, ReadingModelClient[]>`; the route
    selects the client list for the request's module (defaulting to
    `'three-expression'`, matching `generateReading`'s own default)
    before calling `generateReading`.
  - New env var `GEMINI_API_KEY_SECONDARY` (optional — unset falls back
    to the primary client alone for every module, so every deploy
    before this one keeps working unchanged). Added to `.env.example`
    and the local `.env`; **still needs adding to Render's dashboard
    env vars for production** — not something doable from here.
  - `readingService.test.ts` gained 2 tests for the new behavior
    (falls over to the second client when the first errors; cycles
    through both clients evenly across all 4 attempts) plus a fix to
    the existing exhausted-retries test's now-4 expected call count.
    7 other test files updated their `buildApp(everyModule(...))` call
    sites for the new array-wrapped signature. `tsc --noEmit` clean,
    backend suite 9/9 suites, 60/60 tests.
- [x] **10.24 Fixed "it takes too long" — halved worst-case wait for the
  dual-key setup** — 10.23's first version retried each of the 2 keys
  twice (4 total attempts), which roughly doubled worst-case wait to
  100+ seconds; live-verified against a real Gemini high-demand event
  where a single un-timed-out direct call took 104 seconds to fail.
  `maxAttemptsFor(clientCount)` (`readingService.ts`) now caps at
  exactly one attempt per client when more than one is available (2
  keys → 2 attempts, ~50s worst case instead of ~100s) — trying each
  key once already captures the failover benefit; a second try on the
  *same* key during a sustained outage rarely changes the outcome and
  mostly just adds wait. Single-client deploys (no secondary key) keep
  the original 3-attempt cushion, since same-key retry is the only
  resilience available there. `TIMEOUT_MS_PER_ATTEMPT` (25s) left
  unchanged — real successful generations have taken up to the
  high-teens/low-20s seconds even in healthy conditions post the
  longer-output work (10.16/10.19), so shortening it further risks
  killing legitimately-slow-but-successful calls, trading failures for
  speed rather than fixing the actual overshoot (attempt count).
  `readingService.test.ts`: fixed the single-client retry-exhaustion
  test's now-3 expected call count, and rewrote the two-client
  cycling test to assert one call each (not two) — both now correctly
  describe the behavior instead of the bug that prompted the fix.
  `tsc --noEmit` clean, backend suite 9/9 suites, 60/60 tests.
- [x] **10.25 Retry a raw network failure in analyzeReading, not just a
  502** — real device report, decoded from a garbled native error
  message: "the network connection is lost", which is iOS's
  `NSURLErrorNetworkConnectionLost` surfacing through Expo's native
  bridge as an ExpoModulesCore Promise rejection, wrapped by our own
  "Could not reach the Face Reader server" message. Root cause:
  `analyzeReading()` (`api/reading.ts`) only ever retried a clean HTTP
  502 *response* — a raw `fetch()` rejection (the network layer itself
  failing, not a bad response) skipped retry entirely and threw
  immediately. That gap became meaningfully more exposed once a single
  reading could take up to ~50s worst case (10.24's dual-key failover)
  — long enough for a phone lock/background or a brief network handoff
  to plausibly drop the connection mid-request, which is exactly the
  kind of transient condition worth one more try, not a hard failure.
  Now retries on the same 3-attempt/3s-6s-backoff schedule as a 502.
  `reading.test.ts`: renamed the "502 cold-start retry" describe block
  to cover both cases, added retry-then-succeed and exhaust-then-throw
  tests for a raw network failure mirroring the existing 502 ones, and
  removed the old immediate-throw test it superseded. `tsc --noEmit`
  clean, frontend suite 30/30 suites, 196/196 tests.
