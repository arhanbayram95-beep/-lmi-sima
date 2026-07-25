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

## 2. Core User Flow & The Triple Capture Mechanics

### 2.1 Onboarding
* Age gate (+18 self-attestation) inside a clean, on-brand welcome flow — think
  "cosmic onboarding carousel" rather than a "Guardian Oath crypt."
* Explicit, revocable consent checkbox for image processing, with a warm,
  plain-language privacy statement: *"Your photos are analyzed instantly and never
  stored. This is for entertainment only."*

### 2.2 The Three-Expression Capture (Sequential Camera UI)
Same underlying mechanic, restyled with lighter, universally legible copy:
1. **Calm (Neutral):** Baseline capture under a soft glowing face-guide overlay.
2. **Bright (Smiling):** Friendly chime prompt, e.g. "Show us your glow ✨"
3. **Deep (Serious/Stern):** e.g. "Now give us your mysterious side 🌙"

*Validation:* On-device face detection rejects non-face frames before any API call
(privacy + cost control).

### 2.3 Reading Modules (added 2026-07-24)
The Analyze hub offers three reading modules, all sharing the identical
Calm/Bright/Deep capture mechanic above — only the AI system prompt and
resulting reading content differ per module (see §4 for how this is wired):
* **3-Expression Face Reading** — the original general character/vibe reading.
* **Relationship Harmony Analyzer** — reads the user's own connection/chemistry
  style. Never a compatibility match against a specific partner — the app only
  ever captures one person's photos, so nothing should imply an actual
  two-person comparison.
* **Career Match** ("What Job Suits You") — a fun career-archetype vibe read.
  Never framed as a real psychometric or vocational assessment.

---

## 3. Architecture & Data Flow

```text
[React Native App]
   │  (1) Captures 3 images locally (Zustand cache, in-memory only)
   │  (2) Plays audio & haptic confirmation cues
   V
[Secure Backend Bridge]
   │  (3) Validates active entitlement via RevenueCat SDK
   │  (4) Wraps images into a single payload with the system prompt
   V
[Claude Sonnet 5 — Vision, Messages API]
   │  (5) Returns structured JSON via tool-use schema (see §4)
   V
[React Native UI]
   │  (6) Purges images from memory immediately after response
   │  (7) Renders the Reading Screen + shareable story-format card
```

---

## 4. AI Integration Notes (current: Google Gemini)

* **Provider decision (2026-07-24):** switched to Google Gemini for active
  development/testing, using a `GEMINI_API_KEY` the product owner is running
  personally. Anthropic Claude remains a candidate — the choice between them is
  still a pricing decision, not an architecture one — so keep the AI-calling
  code isolated in `backend/src/services/` (client + service + schema) so a
  future switch back stays a contained change, not a rewrite.
* **Model:** `gemini-2.5-flash` via `@google/genai`'s `ai.models.generateContent`
  — supports multiple images in one user turn (ordered sequence), which is
  exactly the 3-expression use case. `gemini-2.0-flash` returned a `429`
  (zero free-tier quota) on the current key; `gemini-2.5-flash` works on the
  free tier as of this decision — re-check quota/pricing before assuming this
  holds at production volume.
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
