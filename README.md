# Face Reader — AI Physiognomy Tool (Ilm-i Sima)

A React Native mobile app that gives users playful, AI-generated character and expression analysis from their own photos. Built for the US/EU entertainment-app market — think Co-Star/Nebula-style "vibe reading," not a clinical or diagnostic product. See `PROJECT_SPEC.md` for the full product spec and `DESIGN.md` for the visual system.

---

## Core Features

* **Three reading modules**, all sharing the same capture mechanic, each with its own AI system prompt:
  * **Character Analysis** — 3 photos (Calm, Bright, Deep expressions) of yourself.
  * **Relationship Harmony** — 2 photos (you, then another person).
  * **Career Match** — 1 photo of yourself.
* **Multimodal AI Vision** — Google Gemini (`gemini-flash-latest`, Google's auto-updating flash alias) generates the structured reading. Anthropic Claude remains a candidate under pricing evaluation (see `PROJECT_SPEC.md` §4); the AI-calling code is isolated in `backend/src/services/` so switching providers again stays a contained change.
* **Real on-device face detection** — `react-native-vision-camera` + `react-native-vision-camera-face-detector` (ML Kit) reject non-face frames locally, before `capturePhoto` or any network call, per `PROJECT_SPEC.md` §2.2. Verified end-to-end on a physical Android device (2026-08-04). This replaced `expo-camera`, which is why the app now needs an EAS dev-client build instead of plain Expo Go — see "Running on a physical device" below.
* **Privacy-first (process-and-discard)** — captured photos live in memory only, on both the client and the server, and are purged immediately after the API response returns. No image ever touches disk or a database.
* **Story-ready share cards** — a builder UI (`ShareOptionsModal`) lets the user pick which reading sections to include, with an opt-in toggle to embed their captured photo, then renders a `react-native-view-shot` card sized to the content. Plain-text "Quick Message" and "Copy Text" options are also available, and image sharing goes through `expo-sharing` (needed for a real cross-platform file attachment — React Native's built-in `Share.share({ url })` is iOS-only).
* **10-language UI** — en/zh/hi/es/fr/ar/bn/pt/ru/ur, via a lightweight custom i18n dictionary (`frontend/src/i18n/`). Legal documents (Privacy Policy/Terms) are hosted externally (see below) and stay English-only pending professional translation.
* **Monetization (RevenueCat)** — SDK fully wired and live-tested end-to-end against a real RevenueCat project (Test Store purchase dialog, weekly/monthly packages, entitlement check). Not yet live for real users — blocked on real App Store Connect / Google Play Console in-app products, which RevenueCat sits on top of rather than replaces. See `IMPLEMENTATION_PLAN.md` 5.1.

---

## Tech Stack

* **Frontend:** React Native + TypeScript, Expo SDK 57 (blank TS template). State via `Zustand`. Camera via `react-native-vision-camera` + `react-native-vision-camera-face-detector`. Purchases via `react-native-purchases` (RevenueCat). Audio via `expo-av`. Share cards via `react-native-view-shot` + `expo-sharing`.
* **Backend:** Node.js + TypeScript, **Fastify**. Thin gateway — holds the AI provider key, never exposes it to the frontend. Deployed to Render (see "Backend hosting" below).
* **AI:** Google Gemini via `@google/genai`, structured JSON output via `responseSchema`/`responseMimeType` (not tool-use — that's Anthropic's mechanism, see `PROJECT_SPEC.md` §4 if you're reading this after a provider switch).

---

## Prerequisites

* Node.js 20+ and npm
* An **EAS dev-client build** installed on a physical Android or iOS device — plain Expo Go can no longer run this app. `react-native-vision-camera` and `react-native-purchases` are native modules Expo Go doesn't ship, so the capture screen fails to load without a custom dev client. See "Running on a physical device" below for the build steps. (A free Expo/EAS account covers Android; a real iPhone additionally needs an Apple Developer Program membership, $99/yr, for device provisioning — no Mac required, EAS builds in the cloud.)
* A Google Gemini API key ([aistudio.google.com](https://aistudio.google.com/)) — free tier works for development; see the note on model choice below
* Your phone and your dev machine **on the same Wi-Fi network** while developing — Metro (the JS bundler) still needs LAN connectivity even though the backend no longer does (see "Backend hosting" below)

---

## Quick Start

**Fastest path** (using the already-live backend, no Gemini key needed): install frontend deps, point `frontend/.env` at the hosted backend, build/install an EAS dev client once (see "Running on a physical device" below), then `npx expo start --dev-client`. Skip straight to step 2 below and come back to step 1 only if you need to run/change the backend yourself.

### 1. Backend setup (optional — only if you're changing backend code)

The production backend is already live at `https://face-reader-backend-h0qb.onrender.com`; most frontend work never needs a local backend at all. To run one locally instead:

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in:

```
PORT=3000
GEMINI_API_KEY=your-key-here
REVENUECAT_API_KEY=
```

`REVENUECAT_API_KEY` isn't read by the backend at all (purchases are verified client-side by the RevenueCat SDK) — leave it blank.

Then start it:

```bash
npm run dev
```

You should see `Face Reader backend listening on port 3000`. Leave this running in its own terminal.

> **Model note:** `gemini-2.0-flash` returned a `429` (zero free-tier quota) during development, and `gemini-2.5-flash` started 404ing as "no longer available to new users" on newly-created keys (as of 2026-07-28). The current default, `gemini-flash-latest` (`backend/src/services/readingService.ts`), is Google's auto-updating flash alias and works on the free tier. If you hit quota/404 errors, that's the first thing to check.

### 2. Frontend setup

```bash
cd frontend
npm install
```

The frontend needs to know where the backend is. Create `frontend/.env`:

```
EXPO_PUBLIC_API_BASE_URL=https://face-reader-backend-h0qb.onrender.com
```

Or, if you ran a backend locally via the optional step 1 above:

```
EXPO_PUBLIC_API_BASE_URL=http://<your-machine's-LAN-IP>:3000
```

Find your LAN IP:
* **Windows (PowerShell):** `Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' -or $_.IPAddress -like '172.*' }`
* **macOS/Linux:** `ipconfig getifaddr en0` (or `hostname -I` on Linux)

Do **not** use `localhost` here unless you're running on a simulator on the same machine — a physical phone's `localhost` refers to the phone itself, not your dev machine.

RevenueCat is optional for local dev — without `EXPO_PUBLIC_REVENUECAT_API_KEY` set, `PaywallScreen` falls back to a local-only stub that doesn't process real purchases:

```
EXPO_PUBLIC_REVENUECAT_API_KEY=your-revenuecat-public-sdk-key
```

Then start Metro in dev-client mode (see the next section for building/installing the dev client first, if you haven't already):

```bash
npx expo start --dev-client
```

### 3. Testing without a backend or API key at all

Don't want to set up a Gemini key yet? Run in mock mode instead — the full capture → analyze → reveal flow works end-to-end with no backend running:

```bash
EXPO_PUBLIC_USE_MOCK_API=true npx expo start --dev-client
```

This returns canned, clearly-labeled placeholder readings (one per module, so you can see the content genuinely differs) instead of calling anything real. Note this only skips the *backend* call — the capture screen's camera still needs the dev client described below, mock mode doesn't change that.

---

## Running on a physical device

**Plain Expo Go no longer works for this app.** `CaptureScreen` uses `react-native-vision-camera` (real on-device face detection) and `PaywallScreen` uses `react-native-purchases` — both are native modules Expo Go doesn't include, so the app fails to load past those screens without a custom dev-client build.

### Building the dev client (one-time, or whenever a native dependency changes)

```bash
cd frontend
npx eas-cli login          # your Expo account (interactive — run this yourself, not through an agent)
npx eas-cli build --profile development --platform android
```

* **Android:** no paid account needed — EAS generates a keystore for you and outputs an installable `.apk`. Open the link/QR EAS prints on your phone to install it.
* **iOS on a real device:** needs an active Apple Developer Program membership ($99/yr) so EAS can provision it; `eas device:create` registers your iPhone's UDID via a link you open in Safari (no Mac needed — the build itself compiles on Apple's cloud).
* **iOS Simulator instead:** add `"ios": { "simulator": true }` to the `development` profile in `frontend/eas.json` (no Apple account needed) — only useful if you're on a Mac.

This is a real cloud build against your EAS account (consumes build minutes/credits) — trigger it yourself rather than having an agent run it non-interactively.

### Day-to-day development after the dev client is installed

You don't rebuild for every code change — only when a native dependency changes. For everything else:

```bash
npx expo start --dev-client
```

Open the custom dev-client app on your phone (it has your app's own icon, not Expo Go's) and connect to the printed LAN URL, same as Expo Go used to work.

**Both your phone and your dev machine need to be on the same Wi-Fi network** for Metro (the JS bundle server, port 8081) to work. This no longer applies to the backend connection if you're pointed at the Render-hosted URL (real HTTPS, reachable over the internet) — only Metro itself needs LAN. If your router isolates clients from each other (common on some home/office/guest networks):
* Easiest fix: use a phone hotspot instead of the shared Wi-Fi — connect your dev machine to your **phone's** hotspot, then use the machine's new IP for Metro (and `frontend/.env`, if pointing at a local backend).
* `frontend/.env` is read once, when Metro starts — if you change your machine's IP (new network, hotspot toggled, etc.), you must fully restart `npx expo start --dev-client` (not just reload the app) to pick up the change.
* If you're using a PowerShell terminal and previously ran `$env:EXPO_PUBLIC_API_BASE_URL = "..."` by hand in that same window, it will silently override `frontend/.env` for the rest of that terminal session. Open a fresh terminal if you're not sure.

---

## Backend hosting

Deployed to [Render](https://render.com)'s free tier via the `render.yaml` blueprint at the repo root (Docker service pointed at `backend/`, `GEMINI_API_KEY`/`REVENUECAT_API_KEY`* set as dashboard secrets). Live at `https://face-reader-backend-h0qb.onrender.com`.

The free tier spins the service down after 15 minutes idle (~30-60s cold start on the next request) — the paid Starter tier ($7/mo, no migration needed) is the fix if that becomes a real user complaint. See `PROJECT_SPEC.md` §3 for why Render was chosen over Railway/Fly.io/Cloud Run/DigitalOcean.

\* the backend doesn't actually read `REVENUECAT_API_KEY` (see the frontend setup note above) — it's set on Render only because `render.yaml` declares it; harmless either way.

---

## Testing

**Frontend** (Jest + React Native Testing Library — `expo-camera`, `react-native-vision-camera`, `expo-av`, and RevenueCat hooks are all mocked, no real device hardware needed):
```bash
cd frontend
npm test
```

**Backend** (Jest with Fastify's `.inject()` — no real Gemini API calls in the test suite, everything's mocked):
```bash
cd backend
npm test
npm run typecheck
```

Both should be fully green on a clean checkout.

---

## What's not wired up yet

* **RevenueCat real purchases** — the SDK integration is complete and live-tested against a real RevenueCat project (Test Store), but there's no real App Store Connect / Google Play Console product behind it yet — RevenueCat sits on top of those, it doesn't replace them. See `IMPLEMENTATION_PLAN.md` 5.1.
* **App Store / Play Store listings** — don't exist yet. "Rate on App Store" (`frontend/src/utils/storeLinks.ts`) and the share text's store link open a correctly-formed store URL with a placeholder app ID — replace `IOS_APP_STORE_ID` once the App Store Connect app record exists and has a real numeric Apple ID (`ANDROID_PACKAGE_NAME` is already the real, final package name). `app.json`'s `ios.bundleIdentifier`/`android.package` are finalized as of 2026-08-12: `com.arhanbayram.facereader` (see `IMPLEMENTATION_PLAN.md` 5.3).

Check `IMPLEMENTATION_PLAN.md` for the full, up-to-date phase-by-phase status.

---

## Legal pages

Privacy Policy and Terms are hosted externally (product owner's Google Sites pages, linked from Onboarding/Settings/Paywall via `frontend/src/utils/legalLinks.ts`) rather than in-app modals — required for the App Store Connect / Play Console privacy policy URL field. The backend also serves its own copies at `/legal/privacy` and `/legal/terms` (`backend/src/routes/legal.ts`). See `LEGAL_REVIEW_PACKET.md` for the full text plus every in-app consent/disclaimer string in one place, and its noted open items (placeholder Governing Law, etc.) — that review still needs a human, ideally counsel.

---

## Project Structure

```
frontend/
  src/
    api/          # The ONLY place that talks to the backend
    screens/       # One file per screen
    components/    # Presentational, no direct API calls
    state/         # Zustand store, one slice per domain
    i18n/          # Translation dictionary + hook
backend/
  src/
    routes/        # HTTP/Fastify layer only
    services/      # Business logic, prompt assembly, Gemini SDK calls
    middleware/     # Entitlement/consent checks
    config/        # Env loading
```

See `CLAUDE.md` for the full set of module-boundary and coding conventions this project follows.
