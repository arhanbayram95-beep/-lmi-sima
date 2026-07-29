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
  - Vision-camera groundwork itself (added, not yet wired):
    `react-native-vision-camera@5.2.0`, `react-native-nitro-modules`,
    `react-native-nitro-image`, `react-native-worklets`,
    `react-native-vision-camera-worklets`,
    `react-native-vision-camera-face-detector` — dependencies only. None of
    these ship an Expo config plugin (camera permission is already covered
    by the existing `expo-camera` plugin entry's `NSCameraUsageDescription`/
    `android.permission.CAMERA`), and no `babel.config.js` was added since
    `babel-preset-expo` auto-detects and wires `react-native-worklets/plugin`
    when the package is present. `CaptureScreen` is still on `expo-camera`
    with zero frame-processor/face-detection logic — see
    IMPLEMENTATION_PLAN.md 6.1. `react-native-nitro-image` is flagged by
    `expo-doctor` as untested on New Architecture (mandatory in SDK 57);
    worth re-checking before actually wiring 6.1's detection logic.
"Open in browser ↗" link to the hosted version.

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
