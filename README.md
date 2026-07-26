# Face Reader — AI Physiognomy Tool (Ilm-i Sima)

A React Native mobile app that gives users playful, AI-generated character and expression analysis from their own photos. Built for the US/EU entertainment-app market — think Co-Star/Nebula-style "vibe reading," not a clinical or diagnostic product. See `PROJECT_SPEC.md` for the full product spec and `DESIGN.md` for the visual system.

---

## Core Features

* **Three reading modules**, all sharing the same capture mechanic, each with its own AI system prompt:
  * **Character Analysis** — 3 photos (Calm, Bright, Deep expressions) of yourself.
  * **Relationship Harmony** — 2 photos (you, then another person).
  * **Career Match** — 1 photo of yourself.
* **Multimodal AI Vision** — Google Gemini (`gemini-2.5-flash`) generates the structured reading. Anthropic Claude remains a candidate under pricing evaluation (see `PROJECT_SPEC.md` §4); the AI-calling code is isolated in `backend/src/services/` so switching providers again stays a contained change.
* **Privacy-first (process-and-discard)** — captured photos live in memory only, on both the client and the server, and are purged immediately after the API response returns. No image ever touches disk or a database.
* **Story-ready share cards** — `react-native-view-shot` renders a 9:16 shareable card of your result.
* **10-language UI** — en/zh/hi/es/fr/ar/bn/pt/ru/ur, via a lightweight custom i18n dictionary (`frontend/src/i18n/`). Legal documents (Privacy Policy/Terms) stay English-only pending professional translation.
* **Monetization (RevenueCat)** — deferred for now; see "What's not wired up yet" below.

---

## Tech Stack

* **Frontend:** React Native + TypeScript, Expo SDK 54 (blank TS template). State via `Zustand`. Camera via `expo-camera`. Audio via `expo-av`. Share cards via `react-native-view-shot`.
* **Backend:** Node.js + TypeScript, **Fastify**. Thin gateway — holds the AI provider key, never exposes it to the frontend.
* **AI:** Google Gemini via `@google/genai`, structured JSON output via `responseSchema`/`responseMimeType` (not tool-use — that's Anthropic's mechanism, see `PROJECT_SPEC.md` §4 if you're reading this after a provider switch).

---

## Prerequisites

* Node.js 20+ and npm
* [Expo Go](https://expo.dev/go) installed on a physical phone (easiest way to run this — no Xcode/Android Studio setup required), **or** an iOS Simulator / Android Emulator
* A Google Gemini API key ([aistudio.google.com](https://aistudio.google.com/)) — free tier works for development; see the note on model choice below
* Your phone and your dev machine **on the same Wi-Fi network** (see the "Running on a physical device" section — this trips people up more than anything else in this repo)

---

## Quick Start

### 1. Backend setup

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

`REVENUECAT_API_KEY` can stay blank — RevenueCat isn't wired up yet (see below). Leaving it blank does not break anything else.

Then start it:

```bash
npm run dev
```

You should see `Face Reader backend listening on port 3000`. Leave this running in its own terminal.

> **Model note:** `gemini-2.0-flash` returned a `429` (zero free-tier quota) during development; `gemini-2.5-flash` (the current default, in `backend/src/services/readingService.ts`) worked fine on the free tier. If you hit quota errors, that's the first thing to check.

### 2. Frontend setup

In a **new terminal**:

```bash
cd frontend
npm install
```

The frontend needs to know where the backend is. Create `frontend/.env`:

```
EXPO_PUBLIC_API_BASE_URL=http://<your-machine's-LAN-IP>:3000
```

Find your LAN IP:
* **Windows (PowerShell):** `Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' -or $_.IPAddress -like '172.*' }`
* **macOS/Linux:** `ipconfig getifaddr en0` (or `hostname -I` on Linux)

Do **not** use `localhost` here unless you're running on a simulator on the same machine — a physical phone's `localhost` refers to the phone itself, not your dev machine.

Then start Expo:

```bash
npx expo start
```

Scan the QR code with Expo Go (or press `i`/`a` for a simulator/emulator).

### 3. Testing without a backend or API key at all

Don't want to set up a Gemini key yet? Run in mock mode instead — the full capture → analyze → reveal flow works end-to-end with no backend running:

```bash
EXPO_PUBLIC_USE_MOCK_API=true npx expo start
```

This returns canned, clearly-labeled placeholder readings (one per module, so you can see the content genuinely differs) instead of calling anything real.

---

## Running on a physical device (the part that actually causes problems)

This app is built to run in plain Expo Go — no custom dev client needed for anything currently wired up. The one thing that reliably trips people up is **network connectivity between your phone and your dev machine**, because two *separate* connections are involved:

1. **Metro (port 8081)** — delivers the app's JS bundle to Expo Go. This is what the QR code connects to.
2. **The backend (port 3000)** — a completely separate server. The app calls it automatically in the background once it's loaded; there's no manual "connect" step for this one. It's controlled entirely by `EXPO_PUBLIC_API_BASE_URL` in `frontend/.env`.

**Both your phone and your dev machine need to be on the same Wi-Fi network** for the default (LAN) setup to work. If your router isolates clients from each other (common on some home/office/guest networks), plain LAN mode will fail for *both* connections, and Expo's `--tunnel` flag handles #1 but not #2 — the backend has no equivalent built in. If you hit this:
* Easiest fix: use a phone hotspot instead of the shared Wi-Fi — connect your dev machine to your **phone's** hotspot, then use the machine's new IP (on the hotspot subnet) in `frontend/.env`.
* `frontend/.env` is read once, when Metro starts — if you change your machine's IP (new network, hotspot toggled, etc.), you must fully restart `npx expo start` (not just reload the app) to pick up the change, and force-quit + reopen Expo Go on the phone to guarantee it's not running a cached bundle with the old URL.
* If you're using a PowerShell terminal and previously ran `$env:EXPO_PUBLIC_API_BASE_URL = "..."` by hand in that same window, it will silently override `frontend/.env` for the rest of that terminal session. Open a fresh terminal if you're not sure.
* A quick sanity check: open `http://<your-ip>:3000/` directly in your phone's browser. A JSON `{"statusCode":404,...}` response means the phone *can* reach the backend (404 is expected — there's no route at `/`, just proof of connectivity). A timeout/connection error means it's a network problem, not an app bug.

---

## Testing

**Frontend** (Jest + React Native Testing Library):
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

* **RevenueCat / paywall purchases** — deferred alongside on-device face detection (below). `react-native-purchases` is a native module and would drop plain-Expo-Go support in favor of an EAS dev-client build, so it's intentionally not installed yet. The paywall UI exists and is fully navigable, it just doesn't process real payments.
* **On-device face detection** — `PROJECT_SPEC.md` §2.2 calls for rejecting non-face photos on-device before they're ever sent to the backend. Expo dropped its built-in face-detector module; real detection needs `react-native-vision-camera` + an ML Kit frame-processor plugin, which (like RevenueCat) requires an EAS dev-client build. See `IMPLEMENTATION_PLAN.md` Phase 6 for the plan.
* **App Store / Play Store listings** — don't exist yet. "Rate on App Store" (`frontend/src/utils/storeLinks.ts`) opens a correctly-formed store URL with a placeholder app ID — replace `IOS_APP_STORE_ID`/`ANDROID_PACKAGE_NAME` once the app is actually published.

Check `IMPLEMENTATION_PLAN.md` for the full, up-to-date phase-by-phase status.

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
