# Implementation Plan: Ilm-i Sima (Medieval Mystic Face Reader)
**Version:** 1.0.0 (MVP Sprint Plan)  
**Objective:** Build a high-fidelity, immersive, and stable mobile app with an autonomous backend bridge to Claude 3.5 Sonnet Vision API within a strict entertainment framing.

---

## Phase 1: Local Environment & Audio-Visual Asset Prep
- [ ] **1.1 Expo Initialization Verification**
  - Ensure the `/frontend` directory contains a compile-ready TypeScript blank template.
  - Test run via `npm run android` or `npm run ios`.
- [ ] **1.2 Asset Gathering (Medieval Mysticism)**
  - Source or generate 3 alchemical audio effect files (`.mp3` or `.wav` format via `expo-av` compatibility):
    - `shutter_click.mp3` (Heavy medieval iron trapdoor/shutter mechanism slam).
    - `mystic_chime.mp3` (Soft alchemical bell chime for expression cues).
    - `scroll_unfold.mp3` (Whispering parchment paper friction sound for loading/results).
  - Place assets under `frontend/assets/audio/` and custom alchemical SVG icons under `frontend/assets/icons/`.

---

## Phase 2: Frontend Navigation & The "Ritual" UX (HCI Focus)
- [ ] **2.1 Global State & Core Theming (`Zustand`)**
  - Install Zustand (`npm install zustand`) to manage global state:
    - User age certification status (+18 gate).
    - Base64 image cache array (max 3 images: Neutral, Happy, Stern).
    - Active paywall status derived from RevenueCat hooks.
  - Setup a master theme palette in `frontend/src/ui/theme.ts` matching the Google Stitch specification (Midnight velvet black, ancient gold foil accents, weathered parchment text).
- [ ] **2.2 Screen 1: The Guardian Oath (Onboarding Gate)**
  - Build a dark, scroll-like welcome screen with strict +18 age gate verification.
  - Add explicit checkboxes for biometric processing consent with a warm, satirical disclaimer.
- [ ] **2.3 Screen 2: The Ritual of Three Faces (Sequential Camera UI)**
  - Integrate `expo-camera` or `react-native-vision-camera`.
  - Design a continuous single-session capture flow with dynamic SVG viewport filters:
    - Step 1: **The Slate (Neutral)** -> Captures frame, triggers `shutter_click.mp3` + haptic buzz.
    - Step 2: **The Sun (Smiling)** -> Displays prompt "Gülümse ve Işığı Saç", triggers `mystic_chime.mp3` upon capture.
    - Step 3: **The Tempest (Frowning/Stern)** -> Displays prompt "Derin Düşüncelere Dal / Kaşlarını Çat", captures final state.
  - Implement on-device face bounding verification (reject non-face vectors locally to prevent API abuse).

---

## Phase 3: The Gateway Backend & Claude Vision Interlocking
- [ ] **3.1 Backend Skeleton Framework (`FastAPI` or `Node.js`)**
  - Initialize the server structure inside `/backend`.
  - Configure `.env` file mapping `ANTHROPIC_API_KEY` and `REVENUECAT_API_KEY`.
- [ ] **3.2 Payload Serialization (`backend/src/cyber_arena/protocol/`)**
  - Construct an endpoint `/api/v1/alchemy/analyze` accepting 3 base64 encoded strings inside a secure JSON wrapper.
  - Embed the **Strict System Prompt** (16th-century court philosopher persona, defensive wording template, safety-first constructive traits filter) into the Anthropic SDK instance.
  - Execute API routing logic using Claude 3.5 Sonnet with `response_format: { type: "json_object" }` ensuring it locks to our explicit target schema.
- [ ] **3.3 Privacy Shield Enforcement (`backend/src/cyber_arena/transport/`)**
  - Implement an aggressive memory cleaner function. The moment Claude returns the text JSON data, execute an operational delete command clearing the base64 arrays from active memory (Process-and-Discard architecture).

---

## Phase 4: High-Fidelity Loading & The Reveal Screen
- [ ] **4.1 Screen 3: Alchemical Transmutation (Loading Core)**
  - While backend polling is in flight (3-6 seconds), loop `scroll_unfold.mp3` gently.
  - Render an immersive scanning animation (e.g., golden particles traversing the faces or celestial maps processing alchemical runes).
- [ ] **4.2 Screen 4: The Revealed Scroll (Results Architecture)**
  - Unfold the parchment text UI displaying: `scroll_headline`, `expression_insights`, and `grand_narrative`.
  - Mount a heavy, stylized `footer_disclaimer` component at the base of every layout node.
- [ ] **4.3 The Viral Catalyst (Share Card Compilation)**
  - Integrate `react-native-view-shot` to screenshot the screen layout into a beautiful, vertical 9:16 story-ready graphic.
  - Allow instantaneous trigger to native share sheet systems.

---

## Phase 5: Sorcerer's Access (RevenueCat Monetization & Final Deploy)
- [ ] **5.1 RevenueCat Hook Integration**
  - Setup the Paywall component inside the frontend application.
  - Lock deep-dive interpretations and historical text logs behind a standard weekly/monthly subscription gate.
- [ ] **5.2 End-to-End Testing Matrix**
  - Run `backend/tests/unit` to verify JSON payload handling.
  - Run mock edge-case checks: what happens if a user uploads a photo of a dog or a minor? (Ensure the system falls back gracefully to a non-clinical alchemical error message without crashing).
- [ ] **5.3 Deployment Preparation**
  - Finalize the `Dockerfile` for backend server compilation.
  - Package frontend configuration matrices for Apple TestFlight distributions.