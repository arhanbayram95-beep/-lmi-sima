# QA Findings: UI/UX & Debugging Passes

Tracks issues found during manual UI/UX test + debugging passes over the app,
separate from `IMPLEMENTATION_PLAN.md`'s feature checklist. Same spirit: one
unchecked `[ ]` row per open issue, checked off `[x]` once fixed and verified
(typecheck + relevant test suite green). Log new passes as new dated sections
rather than editing old ones away, so this stays a record of what was found
and when, not just current state.

---

## Pass 1 — 2026-07-24 (mocked-API web build + code review)

Scope: full onboarding → paywall → analyze hub → capture-permission flow
driven live in a browser against `EXPO_PUBLIC_USE_MOCK_API=true`, plus a
source read of every screen in `frontend/src/screens/`. Backend verified via
`tsc --noEmit` + `npm test`; confirmed it correctly refuses to boot without
`ANTHROPIC_API_KEY` rather than failing silently.

- [x] **QA-1: Dead links on the paywall footer**
  `PaywallScreen.tsx`'s "Restore Purchases" and "Terms of Service" footer
  links were plain `<Text>` with no `onPress`, styled identically to the
  adjacent "Privacy Policy" which *did* work — reproduced live, confirmed
  inert in the DOM. Fixed: "Terms of Service" now opens the existing
  `TermsModal`; "Restore Purchases" shows an honest "no previous purchases
  found" alert (no RevenueCat integration yet — see Phase 5.1 in
  `IMPLEMENTATION_PLAN.md` — so it can't do a real lookup, but it must not
  look broken).

- [x] **QA-2: Camera-permission-denied screen was a navigational dead end**
  `CaptureScreen.tsx`'s permission-not-granted view had no back button, no
  bottom nav — only "Allow Camera Access." A user who denies/lacks camera
  access had no way back into the app short of a restart. Reproduced live
  (the test browser sandboxes real camera access, landing on this exact
  screen). Fixed: added a close button (`goBack()`, same pattern as
  `PaywallScreen`/`ReviewScreen`) to that view.

- [x] **QA-3: "Restore Purchases" unwired in Settings too**
  `SettingsScreen.tsx`'s Subscription section had a "Restore Purchases" row
  with no `onPress`, still rendered with a chevron implying it was
  actionable — no "coming soon" treatment like the Analyze hub uses for its
  unbuilt modules. Fixed: wired to the same honest "no previous purchases
  found" alert as QA-1.

- [x] **QA-4: Paywall oversold "Full Reading History"**
  The paywall's third feature bullet advertised "Full Reading History &
  High-Res Story Share Cards," but `ResultsScreen.tsx` always shows the
  empty state — no reading is ever persisted (by design, per the
  process-and-discard privacy architecture in `PROJECT_SPEC.md` §3). Real
  reading-history persistence is out of scope for a copy fix and would need
  its own product decision (where would history even live, given
  process-and-discard?), so the safer fix was correcting the claim rather
  than building the feature. Changed the bullet to "High-Res Story Share
  Cards" only, which is real and already shipped (Phase 4.3).

- [x] **QA-5: `IMPLEMENTATION_PLAN.md` 2.3 face-detection gap (informational, not a bug)**
  Confirmed `CaptureScreen.tsx` takes photos unconditionally with no local
  face-bounding check — 2.3's "reject non-face frames locally" is genuinely
  not implemented (the only face check is a soft mention in the backend's
  system prompt, which is a content fallback, not a capture-time guard).
  Product decision (2026-07-24): defer real on-device detection to the end
  of the plan (now Phase 6.1 in `IMPLEMENTATION_PLAN.md`) rather than block
  on it now. Built the placeholder destination in the meantime:
  `NoFaceDetectedScreen` + a `ReadingApiError('NO_FACE_DETECTED')` routing
  hook in `AnalyzingScreen`, so 6.1 has somewhere real to route into once
  it lands.

---

## Security Review — 2026-07-24 (Gemini backend integration)

Scope: the backend's switch from Anthropic to Google Gemini (`fada92b`) —
checked for hardcoded/logged/committed keys, client-side key exposure,
missing rate limiting, missing input validation, and error handling that
leaks internals, per standard practice for reviewing a new third-party AI
API integration.

- [x] **SEC-1: Confirmed no API key ever entered git history**
  Searched all branches/commits for the Google key prefix (`git log --all -p
  -S "AIza"`) and for `api_key.txt` specifically (`git log --all
  --full-history`) — zero hits either way. The key lives only in
  `backend/.env` (gitignored) and is loaded via `process.env.GEMINI_API_KEY`
  in `config/env.ts`; the frontend has zero references to it. No rotation
  needed. (The commit message for `fada92b` already notes a loose
  `api_key.txt` was gitignored before ever being committed — verified that
  claim rather than taking it on faith.)

- [x] **SEC-2: No response leaks the raw Gemini SDK error to the client**
  Traced every failure path in `readingService.ts` — each one wraps the
  underlying error in a `ReadingServiceError` with a static, hand-written
  message; the real `cause` is attached to the Error object for internal
  use only and is never serialized into the HTTP response. No fix needed,
  confirmed by reading, not just assuming.

- [x] **SEC-3: No per-field size cap on the analyze request body**
  `analyzeBodySchema` only had `minLength: 1` on `calm`/`bright`/`deep` —
  Fastify's global 1 MiB `bodyLimit` was the only backstop, which doesn't
  catch a single field stuffed with a disproportionate amount of that 1 MiB
  budget before a paid Gemini call gets made. Fixed: added `maxLength:
  1_000_000` per field in `backend/src/routes/reading.ts` — defense in
  depth, not a replacement for the global limit.

- [x] **SEC-4: No sanitized fallback for genuinely unexpected errors**
  Every *expected* failure was already sanitized (SEC-2), but nothing
  guarded the fallback path if something unanticipated ever threw outside
  those wrapped call sites — Fastify's default error handler would echo
  `error.message` straight back to the client. Fixed: added a
  `setErrorHandler` in `backend/src/app.ts` that passes Fastify's own
  (already-safe) validation errors through unchanged, logs anything else
  server-side via `console.error`, and returns a generic message to the
  client instead.

### Flagged for your judgment — not fixed
- **Gemini API key appears to be on the free tier, not paid.** Per the
  `fada92b` commit message, `gemini-2.0-flash` 429'd with "zero free-tier
  quota" and `gemini-2.5-flash` "works on the free tier." Google's own
  docs (`ai.google.dev/gemini-api/docs/logs-policy`) state the free tier
  is used to improve Google's products and may be seen by human
  reviewers, for users outside the EEA/UK/Switzerland — only the paid
  tier gets the "not used for training" guarantee. The updated Privacy
  Policy (`legalContent.ts`) now states the no-training guarantee as
  policy, which requires the production key to actually be on a
  billing-enabled project before launch, or that claim is false for
  non-EEA/UK/Swiss users. Your call on when to switch — probably fine to
  stay on free tier through active development, but this needs to change
  before any real user photos hit the endpoint.
- **No rate limiting on `/api/v1/reading/analyze`.** Combined with
  `requireActiveEntitlement` still being a permissive stub (by design,
  pending Phase 5.1's RevenueCat integration), anyone who can reach the
  server can currently call the paid Gemini endpoint unlimited times. A
  proper fix (`@fastify/rate-limit`) is a new dependency, which
  `CLAUDE.md` requires updating `PROJECT_SPEC.md` for first — your call
  on whether to add it now or track it as a pre-launch blocker alongside
  Phase 5.1/5.2.
- **AI provider is Gemini, not Claude, contrary to what `CLAUDE.md` used to
  lock.** You'd already updated `CLAUDE.md`/`PROJECT_SPEC.md` yourself in
  `fada92b` to describe this as an explicit, dated, "under evaluation, not
  final" decision — noting here only so it's visible in this file's record,
  not because it's unresolved.

### Minor / cosmetic (not tracked as checklist items — no action taken)
- Several `Animated`-driven components trigger React "not wrapped in
  act(...)" warnings under Jest — test hygiene, not a functional issue.
- Web console warnings: `expo-av` deprecated in favor of `expo-audio` /
  `expo-video`; `shadow*` style props deprecated in favor of `boxShadow`;
  `useNativeDriver` unsupported on web (expected — falls back to JS
  animation).
- `@types/jest@30.0.0` vs Expo's expected `29.5.14` — version-mismatch
  warning at dev-server startup, nothing currently broken by it.

---

## Module Activation — 2026-07-24 (Relationship Harmony & Career Match)

Scope: the Analyze hub's two "COMING SOON" module cards, which the product
owner believed were built-but-gated. They weren't — pure frontend teaser
cards with zero backend support. See Phase 7 in `IMPLEMENTATION_PLAN.md` and
§2.3/§4 in `PROJECT_SPEC.md` for the full build.

- [x] **MOD-1: Test-suite flakiness in `AnalyzingScreen.test.tsx`**
  Found during this session's earlier UI/UX pass and again here after adding
  a module-selection test to the same file: this screen runs two continuous
  `Animated.loop` calls that fall back to real JS timers under Jest (no
  native driver in the test environment), which reliably pushed the file
  past Jest's 5000ms default timeout on this dev machine even though the
  actual assertions resolved correctly given more time (12s observed vs 5s
  default). Fixed properly this time: `jest.setTimeout(20000)` for this
  file, rather than leaving it as a recurring false-red. Verified passing
  standalone and as part of the full suite after the fix.

- [x] **MOD-2: Live-verified all three modules against the real Gemini API**
  Product owner asked to confirm the real API (not mock mode) end to end.
  Booted `backend/src/server.ts` against the real `GEMINI_API_KEY` and
  posted a non-face test image (a UI screenshot, not a consented person's
  photo) to `/api/v1/reading/analyze` for all three `module` values.
  All three returned `200` with schema-valid JSON, and — genuinely useful
  signal — all three correctly triggered `SAFETY_RULES`' non-face fallback
  ("say so plainly and kindly... rather than fabricating an insight"),
  each in its own module's voice (e.g. career-match: "we need a clear shot
  of your calm gaze to find your inner strategist"; relationship-harmony:
  "unlock your unique relational vibe"). Also re-verified the SEC-3/SEC-4
  hardening against the live server, not just mocks: an invalid `module`
  value correctly 400s with Fastify's own safe validation message, and a
  malformed-image request 502s with the sanitized static message, no raw
  Gemini error leaking through either way. `gemini-2.5-flash` responded
  successfully on the current (free-tier) key — no `429`.
