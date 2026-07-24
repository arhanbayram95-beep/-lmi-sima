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

- [ ] **QA-5: `IMPLEMENTATION_PLAN.md` 2.3 face-detection gap (informational, not a bug)**
  Confirmed `CaptureScreen.tsx` takes photos unconditionally with no local
  face-bounding check — 2.3's "reject non-face frames locally" is genuinely
  not implemented (the only face check is a soft mention in the backend's
  system prompt, which is a content fallback, not a capture-time guard).
  `IMPLEMENTATION_PLAN.md` already correctly leaves 2.3 unchecked, so no
  plan edit was needed — left open here only as a pointer back to that row
  for whoever picks it up.

### Minor / cosmetic (not tracked as checklist items — no action taken)
- Several `Animated`-driven components trigger React "not wrapped in
  act(...)" warnings under Jest — test hygiene, not a functional issue.
- Web console warnings: `expo-av` deprecated in favor of `expo-audio` /
  `expo-video`; `shadow*` style props deprecated in favor of `boxShadow`;
  `useNativeDriver` unsupported on web (expected — falls back to JS
  animation).
- `@types/jest@30.0.0` vs Expo's expected `29.5.14` — version-mismatch
  warning at dev-server startup, nothing currently broken by it.
