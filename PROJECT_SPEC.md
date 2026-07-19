# Product Specification & Architecture Document (PRD)
## Project Name: Ilm-i Sima *(working title — see §5 Naming Notes)*
**Tech Blueprint:** React Native + TypeScript (Frontend) | Claude Sonnet 5 (AI Core)
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

## 4. AI Integration Notes (corrected for current Anthropic API)

* **Model:** `claude-sonnet-5` via the Messages API — supports multiple images in
  one user turn (ordered sequence), which is exactly the 3-expression use case.
* **Structured output:** there is no `response_format: json_object` parameter on
  the Anthropic API (that's an OpenAI-specific option). Use **tool use** with a
  strict JSON schema instead — define a single tool (e.g. `submit_reading`) with
  the target schema, and force it via `tool_choice`. This is more reliable than
  prompting for raw JSON and parsing it.
* **System prompt persona:** modernized "warm cosmic guide" voice rather than
  "16th-century court philosopher" — friendlier and more legible to a US/EU
  audience raised on Co-Star-style copy (short, punchy, a little cheeky).

---

## 5. Naming Notes

"Ilm-i Sima" is a strong, evocative working title but leans heavily
Ottoman/Turkish, which may undertranslate for US/EU App Store search and
first-impression branding. Once ASO research is done, consider names that read
instantly as "fun face/personality reading app" to an English-speaking audience —
short, a little mystical, easy to say and share (e.g. single evocative words or
light compound names, similar in spirit to Co-Star, Nebula, Faladdin, Sanctuary).
Flag this as a pre-launch decision point, not a blocker for build-out.

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
