# Product Specification & Architecture Document (PRD)
## Project Name: Face Reader - AI Physiognomy Tool *(internally `Ilm-i Sima` — see §5 Naming Notes)*
**Tech Blueprint:** React Native + TypeScript (Frontend) | Google Gemini (AI Core — see §4; provider still under evaluation against Anthropic Claude on pricing)
**Target Market:** US & EU (primary), positioned in the mainstream "modern mystic" app category (Co-Star / Nebula / Sanctuary / Faladdin peer set)

---

## 1. Visual & Interactive Concept (HCI & Aesthetics)

The core value of this app lies in its *experience delivery*. It should feel like a
polished, premium "cosmic fortune-teller in your pocket" — the visual language of
the Faladdin / Co-Star / Nebula generation of mystic apps, not a museum exhibit.
Ottoman/medieval iconography is retired in favor of a **universal, modern mystic**
aesthetic that reads instantly as "fun astrology-adjacent app" to a US or EU user.

* **Visual Identity:** Deep cosmic gradients (midnight indigo → violet → magenta),
  soft glowing celestial motifs (moons, stars, constellations, subtle nebula textures),
  glassmorphic cards with gentle blur and glow, holographic/iridescent accent foils
  instead of gold leaf. Rounded, friendly geometry — no gothic/spiky ornamentation.
* **Gamified Viewports:** Buttons and cards feel like glowing tarot cards or soft
  "energy orbs" rather than parchment blocks or runes. Transitions use gentle
  particle shimmer, soft cross-fades, and light-trail swipes — think "starlight,"
  not "smoke and iron."
* **Audio Feedback Ecosystem:**
  * Capture confirmation: a light, satisfying camera-shutter chime layered with a
    soft cosmic "twinkle" — no heavy mechanical/iron sounds.
  * Processing screen: a gentle ambient shimmer/pad loop (think meditation-app
    background audio), not parchment rustling.
* **Satirical/Entertainment Transparency:** The visual design should still make it
  unmistakable that this is an entertainment product — bold "for fun" iconography
  (sparkles, wink emoji-adjacent motifs, playful copy) rather than clinical framing.
  This matters *more*, not less, in the US/EU mainstream mystic-app category: these
  apps have large audiences who sometimes take results very literally (see App
  Store reviews for comparable apps). Disclaimers stay non-negotiable — they're
  just delivered in a light, on-brand voice instead of a heavy medieval one.

**Reveal screen "deep master card" redesign (2026-08-15):** a full rebuild of
the results screen across all three modules, explicitly authorized as an
override of CLAUDE.md's then-standing "no oracle" tone rule — see CLAUDE.md's
Entertainment Framing section for the exact authorized scope and what's
still off-limits (real historical/religious traditions, fabricated-statistic
framing). Each module now returns 4-5 consolidated master cards (down from
5-6 smaller badge/pill cards) sharing one narrative shape across every
module — `hero_hook` (headline), `anatomical_decoding` (concrete bullets),
`living_scenario` (a grounded 3-paragraph vignette), `actionable_insight` (a
growth-edge callout) — see `backend/src/services/readingSchema.ts`'s
`MasterCardNarrative`. Every flavor metric (aura, resonance, rarity index,
dual-sided polarity meters) now requires a real generated explanation
grounding it, direct fix for product feedback that the pre-redesign
palette-name aura badge read as meaningless filler next to real trait
content — polarity meter sides must be genuine trait pairs, never a color/
gem name standing in for one. Each module's Shadow Arcana card also carries
a `mythic_tale`: a short fantastical fable, deliberately a different
register from `living_scenario`, whose protagonist(s) still have to mirror
the person's real archetype rather than being generic fantasy filler.

Frontend: `TapToRevealCard` (veiled card-back + Reanimated 3D flip ritual,
haptic + chime on tap) wraps `MasterCard` (the generic narrative renderer,
identical across all three modules) plus a per-card `statsSection` built
from small focused pieces in `MasterCardStats.tsx` (aura, resonance,
rarity, polarity meters via `PolarityMeterBar.tsx`, structural dominance,
synergy score dial, accordion checklists). Card headers are a plain two-
child flex row (icon + `numberOfLines`-capped title, nothing absolutely
positioned) — the "fix header overlap" ask is solved structurally here,
not patched, since no stat is ever crammed into the header row anymore.
The pre-redesign `ReadingCards.tsx` card renderers (badge/checklist/pills/
highlight/score cards) and `RarityBadge.tsx` (the palette-name aura) were
deleted as fully superseded, not deprecated in place.

---

## 2. Core User Flow & Capture Mechanics

### 2.1 Onboarding
* Age gate (+18 self-attestation) inside a clean, on-brand welcome flow — think
  "cosmic onboarding carousel" rather than a "Guardian Oath crypt."
* Explicit, revocable consent checkbox for image processing, with a warm,
  plain-language privacy statement: *"Your photos are analyzed instantly and never
  stored. This is for entertainment only."*

### 2.2 Character Analysis: The Three-Expression Capture (Sequential Camera UI)
Same underlying mechanic, restyled with lighter, universally legible copy:
1. **Rest (Neutral):** Baseline capture under a soft glowing face-guide overlay, e.g. "Let your face completely relax 😌"
2. **Grin (Smiling):** Friendly chime prompt, e.g. "Now flash us your biggest grin 😄"
3. **Stern (Frowning):** e.g. "Now give us your best frown 😤"

*Validation:* On-device face detection rejects non-face frames before any API call
(privacy + cost control).

### 2.3 Reading Modules (added 2026-07-24, photo counts revised 2026-07-25)
The Analyze hub offers three reading modules, sharing the same capture
mechanics above but with different photo counts and subjects per module —
the AI system prompt and resulting reading content differ per module (see §4
for how this is wired):
* **Character Analysis** (originally "3-Expression Face Reading") — 3 photos
  of the user (Rest, Grin, Stern). The original general character/vibe
  reading.
* **Relationship Harmony Analyzer** — **2 photos, one of the user and one of
  another person** (product decision 2026-07-25 — originally spec'd as
  reading only the user's own photos). **Reversed 2026-07-28:** the two
  photos are now read *together* and scored as a pair (Chemistry & Synergy
  Score), replacing the 2026-07-25 rule that each photo be read
  independently with never a compatibility score. Product owner's explicit
  call, made after the biometric-comparison exposure was raised. The second
  person's photo requires their permission — see §6 and the Terms &
  Conditions' Acceptable Use clause.
  * **Open item:** the Privacy Policy's Biometric Data section
    (`frontend/src/content/legalContent.ts`) still states the second photo
    "is never matched, scored, or compared against the other photo," and
    leans on that to argue these photos fall outside BIPA / GDPR Art. 9.
    Shipping pair scoring makes that sentence false and weakens the
    argument. Needs legal sign-off and a rewrite before release.
  * Guardrails carried in the prompt instead: no verdict or advice about a
    real relationship, no character judgement of either person (the second
    person never asked for a reading), no guessing names/genders/ages or
    what the two people are to each other, and scores stay in the warm band.
* **Career Match** ("What Job Suits You") — **1 photo** of the user. A fun
  career-archetype vibe read, never framed as a real psychometric or
  vocational assessment.

---

## 3. Architecture & Data Flow

```text
[React Native App]
   │  (1) Captures 1-3 images locally, per module (Zustand cache, in-memory
   │      only) — see §2.3 for which module captures how many, of whom
   │  (2) Plays audio & haptic confirmation cues
   V
[Secure Backend Bridge]
   │  (3) Validates active entitlement via RevenueCat SDK
   │  (4) Wraps images into a single payload with the module's system prompt
   V
[Google Gemini — Vision, generateContent API (see §4)]
   │  (5) Returns structured JSON via config.responseSchema
   V
[React Native UI]
   │  (6) Purges images from memory immediately after response
   │  (7) Renders the Reading Screen + shareable story-format card
```

**Rate limiting (added 2026-07-29):** `requireActiveEntitlement` is still a
permissive stub pending RevenueCat (see IMPLEMENTATION_PLAN.md 5.1) — with no
paywall gate and no per-device identifier sent by the client, an unthrottled
`/api/v1/reading/analyze` is an open door to unlimited paid Gemini calls.
New dependency: `@fastify/rate-limit` (`^11.1.0`), registered globally in
`backend/src/app.ts` via `backend/src/middleware/rateLimit.ts` — 20 requests
per 10 minutes, keyed by IP (the only signal available pre-RevenueCat).
Revisit the key/limit once real accounts or device IDs exist.

**CORS (added 2026-07-30):** discovered live while sharing a dev build over
an ngrok tunnel — the backend had no CORS handling at all, so a cross-origin
preflight `OPTIONS /api/v1/reading/analyze` 404'd (Fastify's default for an
unregistered route/method), which surfaced in the app as "Could not reach
the Face Reader server." New dependency: `@fastify/cors`, registered in
`backend/src/app.ts` via `backend/src/middleware/cors.ts`, reflecting any
origin (`origin: true`) — safe here since nothing in this API is
cookie/session-authenticated, there's no cross-site credential to leak.

**Hosted legal pages (added 2026-07-29):** `GET /legal/privacy` and
`GET /legal/terms` (`backend/src/routes/legal.ts`) serve the same Privacy
Policy / Terms & Conditions content as the in-app modals, as real public HTML
— App Store Connect and Play Console both require a public URL for the
privacy policy in store listing metadata, not just in-app text. No shared
package between frontend/backend, so this is a deliberate second copy of
`frontend/src/content/legalContent.ts`'s section data (same tradeoff already
made for `readingSchema.ts`/`api/types.ts`) — a copy change has to land in
both places. Exempt from rate limiting (`config: { rateLimit: false }`) since
they're static compliance pages, not the paid AI endpoint. The frontend's
`LEGAL_URLS` (`frontend/src/api/config.ts`) points at these routes off the
same `API_BASE_URL` as the API itself, and each in-app legal modal now has an
"Open in browser" (external-link icon) link to the hosted version.

**Expo SDK 54 → 57 upgrade, `expo-av` → `expo-audio` (2026-07-29):** driven by
`react-native-vision-camera` v5 (IMPLEMENTATION_PLAN.md 6.1's groundwork) —
v5's worklets runtime (`react-native-worklets`, by Software Mansion) requires
React Native 0.83–0.86; the project was on Expo SDK 54 / RN 0.81.5. SDK 57
pins RN 0.86 and React 19.2.3. Cascading changes this forced, in case any of
these surprise a future reader:
  - `expo-av` is deprecated with no SDK-57-compatible release, so
    `frontend/src/utils/sound.ts` (capture/prompt chimes, ambient shimmer
    loop) moved to `expo-audio`'s imperative `createAudioPlayer` API. Public
    function signatures unchanged (still `Promise`-returning), so no caller
    changes needed beyond the module internals.
  - `app.json`'s top-level `newArchEnabled`, `splash`, and
    `android.edgeToEdgeEnabled` are no longer valid SDK 57 config fields (New
    Architecture and edge-to-edge are now unconditional defaults; splash
    screen config moved to the `expo-splash-screen` config plugin).
  - TypeScript 6.0 (pulled in transitively) changed its default `types` from
    "every `@types/*` package" to `[]` — `frontend/tsconfig.json` now sets
    `"types": ["jest", "node"]` explicitly, or every test file loses
    `describe`/`it`/`expect`.
  - React Native 0.86 removed `StyleSheet.absoluteFillObject` (kept only
    `absoluteFill`, same plain-object shape) — two spread-usages in
    `CaptureScreen.tsx`/`SettingsScreen.tsx` updated.
  - Vision-camera groundwork itself (added 2026-07-29, wired 2026-07-30):
    `react-native-vision-camera@5.2.0`, `react-native-nitro-modules`,
    `react-native-nitro-image`, `react-native-worklets`,
    `react-native-vision-camera-worklets`,
    `react-native-vision-camera-face-detector` — no `babel.config.js` needed
    since `babel-preset-expo` auto-detects and wires
    `react-native-worklets/plugin` when the package is present.
    `react-native-nitro-image` is flagged by `expo-doctor` as untested on New
    Architecture (mandatory in SDK 57); nothing surfaced in testing so far,
    but worth watching on a real device.
  - **CaptureScreen rewrite (2026-07-30, IMPLEMENTATION_PLAN.md 6.1):**
    `expo-camera` removed entirely (its Expo config plugin entry in
    `app.json` too — replaced with a manual `ios.infoPlist.NSCameraUsageDescription`,
    since none of the vision-camera packages ship a config plugin;
    `android.permission.CAMERA` was already a static `app.json` entry, not
    plugin-generated, so it needed no change). `CaptureScreen` now renders
    `react-native-vision-camera-face-detector`'s `<Camera>` (front/back via
    its `device`/`cameraFacing` props, same as the old `facing` prop) with a
    `usePhotoOutput({ containerFormat: 'jpeg', quality: 0.6 })` merged into
    `outputs`. `onFacesDetected` tracks whether a face is currently in frame;
    the shutter button checks that flag *before* calling
    `photoOutput.capturePhoto()` — no face means an immediate
    `goToScreen('noFaceDetected')` (clearing any already-captured photos in
    the sequence, same discard treatment as cancelling), never reaching
    `capturePhoto` or the backend, per §2.2. Capture goes through
    `photo.getFileDataAsync()` (in-memory `ArrayBuffer`) → `base64-js`'
    `fromByteArray()`, deliberately avoiding `capturePhotoToFile`/
    `saveToTemporaryFileAsync` — those write to disk, which the Privacy
    Architecture (process-and-discard, images in memory only) rules out.
    `photo.dispose()` runs immediately after encoding. Added `base64-js` as
    an explicit dependency (was only ever transitive via `react-native`
    itself) since application code now imports it directly.
  - **Pre-existing lockfile drift fixed in passing (2026-07-30):** the SDK
    57 upgrade had left `package.json` pinning `react-native@0.86.2` exactly
    while `package-lock.json`/`node_modules` were still on `0.86.0` — any
    fresh `npm install` failed with an ERESOLVE peer conflict regardless of
    this task. Separately, `devDependencies.react-test-renderer` floated on
    `^19.1.0`, which resolves to `19.2.8` and demands `react@^19.2.8` —
    conflicting with the exact `react@19.2.3` pin (`react-test-renderer` must
    always match `react`'s exact version). Pinned `react-test-renderer` to
    `19.2.3` and did a full clean reinstall; both `tsc --noEmit` and the Jest
    suite are green against the reconciled tree.
"Open in browser ↗" link to the hosted version.

**New dependency (2026-08-04):** `expo-clipboard`, added for RevealScreen's
"Copy Text" share option (see IMPLEMENTATION_PLAN.md 8.6) — a first-party
Expo SDK module, same category as `expo-haptics`/`expo-crypto` already in
use, no config plugin or `app.json` changes needed.

**New dependency (2026-08-05):** `react-native-safe-area-context`
(`~5.7.0`, installed via `npx expo install`), Expo's standard package for
system-bar insets. Added after on-device testing (Galaxy A06, Android 14)
found RevealScreen's Share/Done buttons partly unreachable — Android's
edge-to-edge rendering (default since RN 0.76 / this app's current RN
0.86.2) draws app content behind the 3-button navigation bar unless a
screen explicitly insets around it, and this app had no safe-area handling
at all (`AnalyzeScreen.tsx`'s header comment even calls this out for the
top inset). `App.tsx` now wraps the tree in `SafeAreaProvider`;
`useSafeAreaInsets().bottom` is added to the bottom padding of every
fixed-to-the-bottom primary action: `BottomNavBar`, RevealScreen's
Share/Done footer, OnboardingScreen's Next/Get Started footer, and
PaywallScreen's Subscribe footer. Jest needs the package's own mock
reimplemented by hand in `frontend/test/mocks/react-native-safe-area-context.js`
(mapped in `jest.config.js`) — the upstream `jest/mock.tsx` internally calls
`jest.requireActual('react-native-safe-area-context')` to reach the real
context objects, which resolves back through the same `moduleNameMapper`
entry instead of the real package, so it was simpler to mock the whole
package with a fixed zero-inset object than fight that self-reference.

**New dependency (2026-08-05):** `expo-sharing` (`~57.0.8`, `npx expo
install`, config plugin auto-registered in `app.json`). Fixes a real
on-device bug: RevealScreen's Story Card share used React Native's
built-in `Share.share({ url: uri })` to send the captured PNG — `url` is
an **iOS-only** field on that API, silently dropped on Android, so the
native share sheet still opened (nothing tells it the intent is empty)
but carried neither a message nor an attachment, and the receiving app
(WhatsApp, etc.) rejected it as an empty message. `expo-sharing`'s
`shareAsync(uri, { mimeType, dialogTitle })` is the correct cross-platform
way to actually attach a local file (`FileProvider` under the hood on
Android). React Native's `Share.share({ message })` is unaffected by this
and stays in use for the text-only "Quick Message" option.

**Backend hosting (2026-08-05):** deployed to Render's free tier via the
`render.yaml` blueprint at the repo root (Docker service pointed at
`backend/`, `GEMINI_API_KEY`/`REVENUECAT_API_KEY` set as dashboard
secrets — see `render.yaml`'s `sync: false` entries). Live at
`https://face-reader-backend-h0qb.onrender.com`. Chosen over Railway/
Fly.io/Cloud Run/DigitalOcean for being the only option that's both
genuinely free (no card) and Docker-native; the free tier spins the
service down after 15 min idle (~30-60s cold start on the next request)
— revisit the paid Starter tier ($7/mo, no migration needed) if that
becomes a real user complaint. `frontend/.env`'s
`EXPO_PUBLIC_API_BASE_URL` points here now instead of a LAN IP, and
`android.usesCleartextTraffic` was removed from `app.json` since this is
real HTTPS.

**Cold-start 502 mitigation (2026-08-15):** became a real complaint
("way too many 502 errors") — mitigated in code without changing the
Render plan: `GET /health` (`backend/src/routes/health.ts`, rate-limit
exempt) exists purely as a pre-warm target, and `frontend/src/api/
reading.ts`'s `warmUpBackend()` fire-and-forget-pings it from
`CaptureScreen`'s mount, the earliest point in the flow with real user
time ahead of it (framing/retaking shots) to absorb the ~30-60s cold
start before the user ever hits Submit. `analyzeReading()` itself now
also retries specifically on a 502 response (up to 3 attempts, 3s/6s
backoff) — anything else (4xx, non-502 5xx, network failure) still fails
immediately, retrying wouldn't help those. This reduces but does not
eliminate the underlying issue: a cold start after a long idle gap can
still exceed the pre-warm's head start plus the retry budget. The actual
fix is still the paid Starter tier noted above — flagged to the product
owner as a cost decision, not applied here.

**Correction — the real "502" cause wasn't Render at all (2026-08-15,
same day):** the mitigation above stands (it's still a real, if smaller,
contributor), but live diagnosis of a continuing "cannot get past 502"
report found the actual cause was the backend's own 502 response —
`routes/reading.ts` maps any `ReadingServiceError` to HTTP 502, and
`readingService.ts` throws that specifically when the Gemini call itself
fails. Confirmed via a direct SDK call bypassing this app entirely, using
the same `GEMINI_API_KEY`: `gemini-flash-latest` (the auto-updating alias
§4 deliberately chose) had rolled forward to `gemini-3.7-flash` on
Google's own schedule, and that model's free tier on this key/project
allows only 20 requests/day — already exhausted. See §4's retry/timeout
notes for the follow-up fix once the key was rotated to one with
available quota. Long-term fix is still enabling billing on the Google
Cloud project behind the key (removes the daily cap entirely) — a cost
decision for the product owner, not applied here.

---

## 4. AI Integration Notes (current: Google Gemini)

* **Provider decision (2026-07-24):** switched to Google Gemini for active
  development/testing, using a `GEMINI_API_KEY` the product owner is running
  personally. Anthropic Claude remains a candidate — the choice between them is
  still a pricing decision, not an architecture one — so keep the AI-calling
  code isolated in `backend/src/services/` (client + service + schema) so a
  future switch back stays a contained change, not a rewrite.
* **Model:** `gemini-flash-latest` via `@google/genai`'s `ai.models.generateContent`
  — supports multiple images in one user turn (ordered sequence), which is
  exactly the 3-expression use case. `gemini-2.0-flash` returned a `429`
  (zero free-tier quota) on the original key; `gemini-2.5-flash` worked on
  that key's free tier as of the original 2026-07-24 decision, but as of
  **2026-07-28**, on a newly-created key, it 404s with "no longer available
  to new users" — confirmed via a live call, and `ai.models.list()` against
  that same key still lists `gemini-2.5-flash` as existing, so this is an
  account-eligibility restriction, not a global removal. Switched to
  `gemini-flash-latest` (Google's auto-updating alias for the current
  recommended flash model) instead of pinning another dated version, so a
  future deprecation doesn't require another manual code change — re-check
  quota/pricing/behavior-stability before assuming this holds at production
  volume, an alias can change behavior out from under you on Google's
  schedule, not just yours.
* **Structured output:** Gemini has no Anthropic-style forced tool-use. Instead,
  set `config.responseMimeType: 'application/json'` and `config.responseSchema`
  (an OpenAPI-subset schema using the `Type` enum: `Type.OBJECT`, `Type.STRING`,
  `Type.ARRAY`, etc. — see `backend/src/services/readingSchema.ts`) on the
  `generateContent` call. This is Gemini's native structured-output mechanism,
  not a workaround.
* **Images:** passed as `{ inlineData: { mimeType: 'image/jpeg', data } }` parts
  alongside a `{ text }` part, all within one `{ role: 'user', parts: [...] }`
  content entry — analogous to Anthropic's image-blocks-before-text pattern.
* **System prompt persona:** modernized "warm cosmic guide" voice rather than
  "16th-century court philosopher" — friendlier and more legible to a US/EU
  audience raised on Co-Star-style copy (short, punchy, a little cheeky). Passed
  via `config.systemInstruction` (Gemini's equivalent of Anthropic's `system`
  param) — unchanged in content from the Claude-era draft.
* **Per-module prompts (added 2026-07-24):** `backend/src/services/systemPrompt.ts`
  exports `READING_SYSTEM_PROMPTS`, a map keyed by `ReadingModuleId` (see §2.3)
  — one prompt per reading module, sharing a single `SAFETY_RULES` block so the
  entertainment-only/no-clinical-language/non-face/minor-fallback rules can't
  drift out of sync across modules. `generateReading` selects the prompt from
  the request's optional `module` field (defaults to `three-expression`).
* **Per-module response schemas (added 2026-07-28):** each module now returns
  its own card stack rather than the original shared
  `{ headline, insights[], narrative }` shape —
  `READING_SCHEMAS[moduleId]` in `backend/src/services/readingSchema.ts` is
  passed as `config.responseSchema`, and the payload carries a `module`
  discriminator (`character_analysis` / `relationship_harmony` /
  `career_path`) that the frontend switches on to pick a renderer. Every
  card stack is: a badge-tag card, a 0-100 overall score with exactly four
  named sub-scores, then pill arrays and/or a recommendation checklist.
  Metric `icon` values are enum-constrained to the set the app can actually
  render. Scores are a presentation device, not a measurement — the
  "stay in the 68-97 band, never punitive" rule lives in the prompts.
* **Longer per-field content (2026-08-15):** product feedback that reading
  copy read as too thin. No new fields or cards — same schema shape, same
  `MAX_GENERATION_ATTEMPTS`/no output-token cap on the `generateContent`
  call, so nothing else needed to change to let this land. Raised the
  sentence-count guidance in each prose field's `description` in
  `readingSchema.ts`: `facial_structure_card.description` and
  `spirit_animal_card.description` 2-3 → 4-5 sentences,
  `celebrity_match_card.match_description` (already the richest card)
  3-4 → 6-8 sentences, and the shared `checklistCard` item `description`
  (used by both Relationship Harmony's guidance card and Career Match's
  recommendations card) 2-3 → 4-5 sentences. `systemPrompt.ts`'s shared
  `STRUCTURE_GUIDANCE` gained an explicit anti-padding line — hitting a
  higher sentence count with restated or generic filler isn't the goal,
  each sentence needs to carry a new concrete observation. Left the
  archetype/catchphrase badge-card summaries and all pill/badge fields
  alone on purpose — those are intentionally short hooks and UI chrome
  (STRUCTURE_GUIDANCE's "build, not a flat list" framing), not the part
  that read as thin.
* **Gemini call timeout + retry-policy fix (2026-08-15):** root-caused a
  "cannot get past 502" report to two compounding issues, confirmed via
  direct SDK calls bypassing this app (see §3's cold-start correction
  note for the first — a `gemini-flash-latest` alias rollover to
  `gemini-3.7-flash` hit that model's 20/day free-tier quota on this
  key; fixed by rotating to a key with available quota, billing still
  the long-term fix). The second, found afterward: a production request
  hung for 90+ seconds with zero bytes back, because nothing in the
  whole call chain — the `@google/genai` client, this service's own
  retry loop, Fastify itself — ever set a timeout, so a stalled
  connection to Gemini just hung indefinitely instead of failing and
  retrying. Fixed in `readingService.ts`: `config.httpOptions.timeout`
  (`TIMEOUT_MS_PER_ATTEMPT`, 25s) now bounds each `generateContent`
  attempt. Since a timeout/abort doesn't necessarily throw a clean
  `ApiError` the way a structured 429/503 does, retryability switched
  from an allowlist of known-good `ApiError` statuses to a denylist of
  known-bad ones (`400`/`401`/`403`/`404` — real request/auth/model
  problems that retrying can't fix); everything else, including a raw
  non-`ApiError` failure, is now retried instead of silently treated as
  fatal just because its shape wasn't anticipated.
* **Dual-key failover (2026-08-18):** a second Gemini API key
  (`GEMINI_API_KEY_SECONDARY`, optional) now backs every module as a
  failover pair rather than one key alone — direct product ask,
  "minimize reading fails as much as you can with those two keys".
  `generateReading` (`readingService.ts`) takes an ordered list of
  clients instead of one; `generateContentWithRetry` cycles through
  every client in the list across its attempts rather than hammering
  the same client repeatedly (attempt count itself later tuned down —
  see the "it takes too long" correction below). `server.ts` puts each module's
  own key first and the other key second — character analysis (the
  app's main flow, highest traffic) prefers its own key so it isn't
  competing with the other two modules' traffic by default, while
  still falling back to the shared key under failure, and vice versa.
  An earlier version of this split assigned one key per module
  statically with no cross-key fallback — rejected once actually
  building it out, since that doesn't help an individual request when
  its one assigned key is the one having a bad moment, which is
  exactly the case worth optimizing for. Unset `GEMINI_API_KEY_SECONDARY`
  falls back to the primary client alone for every module (via
  `geminiClient.ts`'s `everyModule()` helper), so a single-key deploy
  keeps working unchanged — every environment before this one.
* **"It takes too long" correction (2026-08-18, later same day):** the
  first version of the dual-key failover retried each key twice (4
  total attempts), which doubled worst-case wait to 100+ seconds —
  live-verified against a real Gemini high-demand event where a single
  un-timed-out direct call took 104s to fail. `maxAttemptsFor` now caps
  at exactly one attempt per client when more than one is available
  (~50s worst case), falling back to the original 3-attempt cushion for
  a single-client deploy. Trying each key once already gets the
  failover benefit; a second try on the same key during a sustained
  outage rarely changes the outcome and mostly just adds wait.
* **Model-switch fallback (2026-08-18, later still):** direct product
  ask, "after first fail tell it to switch models" — the 503 storms are
  specific to `gemini-flash-latest` (currently `gemini-3.7-flash`), so
  a different model is a separate capacity pool. `modelFor(attempt)`
  gives only the first attempt the primary model; every retry after
  that uses `gemini-flash-lite-latest` instead of trying the primary
  again. Checked what actually works on this key before picking one —
  `gemini-2.5-flash` still 404s despite being listed by
  `models.list()`, `gemini-3.6-flash` worked but took 30s, `gemini-pro-
  latest` worked but took 80.5s; flash-lite was both fastest (~1.1s
  trivial, ~12s for a full real reading with the actual schema+prompt)
  and genuinely viable. Combines with the client-cycling dimension
  within the same tightened attempt budget above, not stacked as a
  third dimension of added wait time. Accepted tradeoff: Flash-Lite is
  a smaller/cheaper model and may read as slightly less rich — fine for
  a fallback that only fires after the primary already failed once.

---

## 5. Naming Notes

**Decision (2026-07-24):** the public-facing name is **"Face Reader - AI
Physiognomy Tool"** — "Face Reader" as the short form used in-app (logo
wordmark, tab bar, compact UI), the full string as the formal/App Store name.
"Ilm-i Sima" remains the internal/working codename only (repo name, internal
docs) and is not user-facing.

Flagged explicitly when this was decided, not silently applied: "physiognomy"
is a specific historical pseudo-scientific term (character-from-face-features)
with a documented association with 19th/20th-century scientific racism, and
naming the app after it sits in tension with this doc's own Entertainment
Framing rules elsewhere (no clinical/scientific-validity claims, entertainment
only) and with `CLAUDE.md`'s non-negotiable Entertainment Framing section.
Product owner confirmed proceeding with the name as specified, accepting that
tradeoff — noting it here for the record, not as an open question.

---

## 6. Market & Compliance Notes (US/EU monetization)

* **Subscription UX:** both US and EU regulators have moved toward requiring that
  canceling a subscription be as easy as starting one. Build a native,
  frictionless cancel flow into the RevenueCat paywall from day one rather than
  retrofitting it later.
* **Entertainment disclaimers:** several EU member states have specific rules
  around advertising fortune-telling/divination services as factual claims — keep
  every disclaimer intact when localizing copy, don't let it get "lost in
  translation" for a lighter tone.
* Recommend a short legal review of paywall copy and disclaimers per target
  market before launch — this is a one-time cost worth paying early.

**RevenueCat groundwork (added 2026-07-30):** no RevenueCat account exists
yet (confirmed with the product owner), so this is dependency/integration
code only, not a live billing path. `react-native-purchases@10.5.0` is
installed; `frontend/src/utils/purchases.ts` wraps `configure`,
`getOfferings`, `purchasePackage`, and `restorePurchases`, deriving
`isProActive` from `CustomerInfo.entitlements.active['aura_pro_access']` —
that identifier must exactly match whatever entitlement gets created in the
RevenueCat dashboard once a real project exists; nothing on the app side
needs to change besides the string if it's named differently there.
`PaywallScreen.tsx` calls the real SDK only when
`EXPO_PUBLIC_REVENUECAT_API_KEY` is set; every environment today has it
unset, so the screen still falls back to its original local-only stub
(`setProActive(true)` on tap, no real purchase). `jest.config.js`'s
`transformIgnorePatterns` was extended for `@revenuecat/*` sub-packages
that ship untranspiled syntax.
  - **Naming clarification, not a divergence:** CLAUDE.md's locked env var
    list names it `REVENUECAT_API_KEY`; the actual variable is
    `EXPO_PUBLIC_REVENUECAT_API_KEY` — Expo only bundles client-side env
    vars carrying that prefix (same pattern already used for
    `EXPO_PUBLIC_API_BASE_URL`), so an unprefixed name would silently never
    reach the app.
  - **Still blocked on:** a real RevenueCat account/project (with the
    `aura_pro_access` entitlement and weekly/monthly offering packages
    configured), and App Store Connect / Play Console developer accounts
    with real in-app products — RevenueCat sits on top of those, it doesn't
    replace them. The backend's `requireActiveEntitlement` stays a
    permissive stub — server-side entitlement verification needs a
    RevenueCat *secret* key and webhook setup, a separate, security-
    sensitive piece of work out of scope for this groundwork pass.

**Reveal screen gamified redesign (2026-08-15):** `react-native-reanimated`
(4.5.1), `react-native-gesture-handler` (~2.32.0), and `react-native-svg`
(15.15.4) added — product ask for real gesture-driven swipe physics and
shape-tag iconography on the reveal screen, none of which `Animated`/
`PanResponder` (core RN, everything else in this app so far) do well.
`babel-preset-expo` already auto-detects and wires `react-native-worklets/
plugin` when the package is resolvable (confirmed by reading
`babel-preset-expo`'s own source — same mechanism already powering
vision-camera's worklets, see the SDK 57 entry above) — no `babel.config.js`
needed, and one was deliberately *not* added after briefly adding one and
finding it would double-apply the plugin on top of the auto-detection
(worklet functions get special serialization; applying that transform twice
risks broken runtime behavior, not just redundant work) while also losing
whatever dev/prod/platform context Metro's zero-config invocation passes to
the preset that a bare `module.exports = { presets: [...] }` wouldn't
reconstruct correctly. `react-native-gesture-handler` needs `import
'react-native-gesture-handler'` as the first line of `index.ts` and a
`GestureHandlerRootView` wrapping `App.tsx`'s root — both added.
`jest.config.js`'s `transformIgnorePatterns` extended for `react-native-
reanimated`/`react-native-worklets`/`react-native-gesture-handler`
(`react-native-svg` was already present in the allowlist from before it was
an actual dependency). Audio for the new transition-sound toggle uses
`expo-audio` (`frontend/src/utils/sound.ts`'s existing pattern) — **not**
`expo-av`, which stays deprecated with no SDK-57-compatible release per the
entry above; this came up because the original ask named `expo-av`
specifically.

**New dependency (2026-08-18):** `expo-image-picker` (`~57.0.11`, `npx expo
install`), for CaptureScreen's new "Choose from Library" option (product
ask: "add select from the library option for photos"). `frontend/src/
components/common/PhotoSourceModal.tsx` is a small custom-styled sheet
(same `optionRow`/backdrop pattern as `ShareOptionsModal.tsx`) offering
"Take Photo" (closes the sheet, live camera underneath is unchanged) or
"Choose from Library" (`ImagePicker.launchImageLibraryAsync({ mediaTypes:
'images', base64: true, quality: 0.6 })`, matching the camera capture
path's existing `quality: 0.6`). `base64: true` returns the asset's data
directly on `asset.base64`, so a library pick feeds `addImage()` the same
way a camera capture does — no extra file-read step, no on-disk
intermediate (Privacy Architecture, §2.2, still holds: picked images never
touch disk any more than captured ones do). A picked photo skips the live
on-device face-detection gate (`hasFaceRef` in CaptureScreen is inherently
tied to the live camera frame stream, not applicable to a static already-
selected image) — falls back to the backend's existing no-face-detected
handling instead, consistent with "validate at the boundary, trust it past
that point." `app.json` gained an `expo-image-picker` plugin entry setting
only `photosPermission` (a custom `NSPhotoLibraryUsageDescription` string
matching the existing camera description's privacy phrasing) and
`microphonePermission: false` (this app never picks video, so the
plugin's default `NSMicrophoneUsageDescription`/`RECORD_AUDIO` request is
unnecessary scope — a stray unused permission is also a common App Store
review flag); `cameraPermission` was deliberately left unset, since
`@expo/config-plugins`' `applyPermissions` falls back to whatever's
already in `infoPlist` when the plugin option is undefined, which
preserves the existing custom `NSCameraUsageDescription` copy already set
directly in `ios.infoPlist` rather than overwriting it with the plugin's
generic default text.

**Fixed a real on-device crash — `react-native-vision-camera` 5.2.0 →
5.2.2 (2026-08-18):** on-device report ("after second photo, app
crashes" / full crash to Home Screen, live camera only, no library
picker involved). User supplied the raw `.ips` crash log (readable
without a Mac via Settings → Privacy & Security → Analytics &
Improvements → Analytics Data) rather than a description — diagnosed
directly from it instead of guessing:
```
EXC_CRASH / SIGABRT
__pthread_kill → pthread_kill → abort → __assert_rtn
-[AVCaptureOutput attachToFigCaptureSession:]_block_invoke.cold.1
-[AVCaptureOutput attachToFigCaptureSession:]_block_invoke
-[AVCaptureSession _makeConfigurationLive:]
-[AVCaptureSession _handleConfigurationCommittedNotificationWithPayload:]
```
on thread `capture.output.FigCaptureSessionSyncQueue`, with a second
thread named `com.margelo.camera.session` simultaneously inside
`closure #1 in HybridCameraSession.start()` → `-[AVCaptureSession
startRunning]` → `_buildAndRunGraph:`. Confirmed via
`mrousavy/react-native-vision-camera` issue #3773 ("Race-condition
crash in HybridCameraSession.start()") — an exact stack-trace match,
line for line — as an upstream, already-diagnosed race: `start()`
calls `session.startRunning()` immediately after `commitConfiguration()`
returns, without waiting for CoreMedia's async "configuration
committed" notification to actually finish; when that notification
later fires on `FigCaptureSessionSyncQueue` and tries to attach
outputs, it finds them already attached by the racing `startRunning()`
call and hits an internal AVFoundation assertion — an uncatchable
native abort, not a JS-catchable exception, so no try/catch anywhere
in this app's code could ever have prevented or surfaced it. Fixed
upstream by PR #4134, merged the same day (2026-08-05) as the 5.2.2
release that first contains it — bumped via `npx expo install
react-native-vision-camera@5.2.2`. `tsc --noEmit` and the full frontend
suite (30/30 suites, 204/204 tests) stayed green across the bump; this
needs a new native build (native dependency, not a JS-only change) to
actually take effect on-device — an EAS `development`-profile build
was queued right after this fix landed.

**Backend: reject non-JPEG photo payloads before spending a Gemini call
on them (2026-08-18):** prompted by a direct security ask ("File check
what user uploads, dont create a security breach") after the "Choose
from Library" feature shipped — the route layer's JSON schema
(`analyzeBodySchema`, `routes/reading.ts`) only ever guaranteed each
`photos` entry was *a string* within a length range, never that it
actually decoded to a real photo. A client that skipped the app
entirely (or a rewritten/malicious frontend) could submit arbitrary
base64 garbage and have `generateReading` spend a paid Gemini call
forwarding attacker-controlled bytes into the model's vision input,
before anything checked what the "photo" actually was.
- New `backend/src/services/imageValidation.ts` — a pure function,
  `assertLooksLikeJpeg(base64Photo: string): void`, throwing a new
  `InvalidImageError` when the decoded bytes don't start with the JPEG
  SOI + marker prefix (`0xFF 0xD8 0xFF`). `Buffer.from(str, 'base64')`
  never throws on malformed input in Node (it decodes leniently and
  drops what it can't parse), so a garbage/non-base64 string just
  surfaces as bytes that fail the magic-byte check — no separate
  "is this valid base64" step needed.
- JPEG-only is deliberate, not a gap: both capture paths this app
  actually has always produce JPEG. The live camera does
  (`usePhotoOutput`'s `containerFormat: 'jpeg'`), and so does the
  library picker — confirmed from `expo-image-picker`'s own type docs:
  "When the `base64` option is truthy, it is a Base64-encoded string
  of the selected image's JPEG data" (it transcodes to JPEG
  internally regardless of the source file's format, as long as
  `quality` isn't exactly `1.0` with `allowsEditing` off — which this
  app's picker call, `quality: 0.6`, never sets). No need to sniff
  PNG/WebP/HEIC.
- `readingService.ts`'s `generateReading()` calls
  `photos.forEach(assertLooksLikeJpeg)` *before* the
  `generateContentWithRetry` try/catch, not inside it — an
  `InvalidImageError` has to propagate as itself so the route layer
  can map it to a 400, not get caught and rewrapped as the generic
  "Failed to reach the Gemini API" `ReadingServiceError` (502). Placing
  it before the try block also means a garbage payload never spends
  the paid call at all, not just that the error is labeled correctly.
- `routes/reading.ts` catches `InvalidImageError` first (400 — a
  client/input problem) ahead of the existing `ReadingServiceError`
  catch (502 — an upstream/Gemini problem).
- New `backend/tests/unit/imageValidation.test.ts` (accepts a real
  JPEG prefix; rejects a PNG, plain text, non-base64 garbage, an empty
  string, and a payload truncated shorter than the magic bytes
  themselves). Every existing backend test fixture that used a
  placeholder string like `'base64-calm'` for a photo — across
  `readingService.test.ts`, `reading.route.test.ts`,
  `rateLimit.test.ts`, and `entitlement.test.ts` — had to switch to a
  real JPEG-magic-byte-prefixed base64 string to keep reaching the
  (mocked) Gemini call at all; tests that reject *before* image
  validation ever runs (missing `photos`, wrong array length, a
  single oversized field, a photo-count mismatch) were unaffected,
  since JSON-schema and photo-count checks both already run earlier in
  the pipeline. `tsc --noEmit` clean, full backend suite green.

**Correction — the vision-camera 5.2.2 bump did not fully fix the crash
(2026-08-19):** a second on-device .ips crash log, same day, from the
build that included both the 5.2.2 bump *and* 10.29's per-step
source-choice restructure — user report: "Still crashes after first
capture both at character analysis and relationship." The new log's
crashing thread is byte-for-byte identical to the first one: `EXC_CRASH`/
`SIGABRT` via `__assert_rtn` inside `-[AVCaptureOutput
attachToFigCaptureSession:]_block_invoke`, on
`capture.output.FigCaptureSessionSyncQueue`, racing `closure #1 in
HybridCameraSession.start()` → `-[AVCaptureSession startRunning]` on
`com.margelo.camera.session`. Two things this settles:
- 5.2.2 (PR #4134) did not fully close this race, or closed a related
  but distinct sub-case (its own description talks about
  `AVCapturePreviewLayer` removal during `updateOutputs(..)`, not the
  attach-side race in #3773 specifically).
- 10.29's restructure made the crash *more* likely to hit, not less:
  asking for the photo source fresh at the start of every step meant
  `<Camera>` fully unmounted and remounted once per step, adding a new,
  frequent trigger for exactly the same native session-start race —
  layered on top of a trigger that was already there before 10.29 ever
  existed (the very first crash log, from a build where `<Camera>`
  never unmounted at all, already happened from two plain
  `capturePhoto()` calls in a row).

**Fixed: stopped tearing the camera session down between steps
(2026-08-19):** `CaptureScreen.tsx`'s source choice is now a
session-wide decision, asked once before the first step's camera would
ever open, not per step — new `sourceMode: 'unset' | 'camera' |
'library'` state replaces 10.29's `cameraReady` boolean.
- `'camera'`: `<Camera>` mounts exactly once and stays mounted/running
  continuously for every remaining step (matching the original,
  pre-10.28 shape that was stable enough to get a user through a full
  reading) — `device`/`cameraFacing` still update in place for
  Relationship Harmony's front→back switch, but the component itself
  never unmounts.
- `'library'`: a `useEffect` keyed on `stepIndex` auto-repeats
  `ImagePicker.launchImageLibraryAsync` for every remaining step once
  the first pick succeeds, so a multi-photo module never needs the
  source-choice screen shown again — and never touches the camera at
  all, on any step, eliminating the crash risk entirely for that path.
- A canceled or failed pick (first one or an auto-repeated later one)
  falls back to `sourceMode: 'unset'`, re-showing `PhotoSourceModal`
  rather than leaving the user on a screen with nothing to press.
- Also added a 500ms settle delay after every successful capture,
  before `advanceStep()` runs or the shutter re-enables (`handleCapture`)
  — the *first* crash log already showed this race happening from two
  `capturePhoto()` calls in a row with no unmount involved at all, so
  reducing session churn alone might not be sufficient; this gives any
  pending native session reconfiguration from the capture itself more
  time to settle before anything touches the session again. Explicitly
  **not** independently confirmed on-device — no native debugging
  tools are available in this environment, so this is a best-effort
  mitigation on top of the sourceMode restructure, not a claimed fix on
  its own. On-device retest is the only way to confirm either change
  actually resolves it.
- `CaptureScreen.test.tsx` rewritten again: `chooseCameraSource()` is
  now called once per test instead of once per step; new tests cover
  the camera staying mounted (not re-asking) across a step transition,
  and the library picker auto-repeating across steps without ever
  mounting `<Camera>`. Every test that waits on a capture completing
  now waits on the *next step's title text* (via `findByText`) rather
  than on `images` updating — the 500ms delay means images update
  before the step actually advances, so waiting on `images` alone
  raced ahead of the shutter being re-enabled and produced false
  failures ("Unable to find an element with text: Grin" — the
  assertion checked before the delayed `advanceStep()` had run) until
  corrected. `tsc --noEmit` clean, frontend suite 30/30 suites,
  205/205 tests.

**Real RevenueCat public key wired in (2026-08-19):** a real RevenueCat
project now exists with an `appl_...` public key (the In-App Purchase
Key + App Store Server Notifications setup between App Store Connect
and RevenueCat is done). Replaced the `test_...` Test Store key with
the real one in `frontend/.env` and all three `eas.json` build profiles
(`development`/`preview` already had the Test Store key; `production`
was missing the variable entirely until now — a real production build
would have shipped with no RevenueCat key at all). The backend secret
key (`REVENUECAT_API_KEY` in `backend/.env`) is unchanged — RevenueCat
secret keys are per-project, not per-store, so it didn't need to
change when the project's store integration went from Test Store to
real App Store products.
- **Still not flipped to enforcement:** `requireActiveEntitlement`
  stays in monitor-mode (see its own comment in `entitlement.ts`) —
  confirmed the real weekly/monthly subscription *products* exist in
  App Store Connect and are attached to a RevenueCat Offering before
  flipping the two `console.warn`/`return` branches to real `403`s,
  since flipping early with no purchasable product would lock every
  user out with no way back in.
- **Still needed:** confirm `REVENUECAT_API_KEY` (the secret key) is
  actually set in Render's dashboard, not just locally in
  `backend/.env` — no Render dashboard access from this environment to
  verify directly.

**Entitlement gate flipped from monitor-mode to enforcement (2026-08-24):**
direct product ask ("Create the gate for usage") once real RevenueCat
products/offering were confirmed attached. Product decision (explicit
choice among options presented): a **hard gate, no free tier** — every
`/api/v1/reading/analyze` call requires an active `aura_pro_access`
entitlement, not a limited free allowance. This is a deliberate reversal
of the earlier "lock deep-dive interpretations... behind a subscription"
idea from the 5.1 groundwork entry above — the Oracle/Arcana redesign
(2026-08-15) made every card a full "deep master card" uniformly, so
there's no longer a natural shallow/deep split within a single reading
left to gate partially; gating the whole reading is what's actually
implementable against the current card architecture.
- `backend/src/middleware/entitlement.ts`: the two `console.warn`/`return`
  branches (missing app-user-id header, no active entitlement) now
  `reply.status(403)` instead. A RevenueCat lookup failure also now
  rejects (403) rather than warning-and-allowing — deliberately fails
  **closed**, not open: this endpoint's only purpose is protecting a paid
  Gemini call from being spent for free, and failing open on a lookup
  error would make "trigger a lookup failure" the obvious bypass. The one
  remaining no-op path is `revenueCatClient` itself being `undefined`
  (`REVENUECAT_API_KEY` unset) — stays a total pass-through so local
  dev/CI never needs a live RevenueCat account, unchanged from before.
  Every 403 body carries a stable `{ code: 'ENTITLEMENT_REQUIRED' }` — a
  machine-readable field the frontend keys off, not the human-readable
  `error` message string.
- `frontend/src/api/reading.ts`: `ReadingApiErrorCode` gained
  `'ENTITLEMENT_REQUIRED'`; the `!response.ok` branch now special-cases a
  403 by parsing the body for that code before falling back to the
  generic `ReadingApiError`.
- `frontend/src/screens/AnalyzingScreen.tsx`: `abandonReading` widened to
  accept `'paywall'`; catches `ENTITLEMENT_REQUIRED` the same way it
  already caught `NO_FACE_DETECTED`, purging the captured photos
  (process-and-discard still applies to an abandoned-for-payment attempt,
  same as any other abandoned one) and routing to the paywall instead of
  showing a generic error screen. PaywallScreen's existing headline/
  subtitle copy ("Unlock Full Face Insights" / "Experience unlimited face
  readings...") already reads as a reasonable explanation for why the
  user landed there — no separate toast/message added on top.
- Backend `entitlement.test.ts` rewritten for enforcement semantics (403 +
  `ENTITLEMENT_REQUIRED` instead of "always 200, sometimes warns");
  `reading.route.test.ts`/`rateLimit.test.ts` unaffected (neither passes a
  `revenueCatClient`, so the gate stays a no-op there, matching local
  dev/CI). New frontend tests for the 403-parsing branch in
  `reading.test.ts` and the paywall-routing branch in
  `AnalyzingScreen.test.tsx`.
