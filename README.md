# FaceAI (Ilm-i Sima) — Modern AI Face & Character Analysis

A modern, high-quality, HCI-focused React Native mobile application that provides playful AI-generated character and expression insights from 3 captured facial expressions (Calm, Bright, Deep). Built for the US/EU entertainment mobile market.

---

## 🚀 Core Features

* **3-Expression Sequential Capture:** Guided camera flow taking snapshots across Calm, Bright, and Deep facial expressions.
* **Multimodal AI Vision:** .
* **Privacy-First Architecture (Process-and-Discard):** Images live in memory only during processing and are immediately purged upon response generation.
* **Aesthetic 9:16 Share Cards:** Generate story-ready export cards for social media sharing via `react-native-view-shot`.
* **Monetization (Aura Pro Access):** In-app weekly and monthly subscriptions managed via RevenueCat.

---

## 🛠️ Tech Stack

* **Frontend:** React Native (TypeScript) + Expo (Blank TS Template)
  * State Management: `Zustand`
  * Audio Feedback: `expo-av`
  * Share Cards: `react-native-view-shot`
  * UI Tokens: Dark Obsidian (`#1A050B`), Crimson Accent (`#9E2941`), Champagne Gold (`#EBC983`)
* **Backend:** Node.js + TypeScript using **Fastify**
  * Gateway API: Enforces strict JSON Schema validation and process-and-discard payload handling.
* **AI Engine:** Anthropic SDK (`claude-3-5-sonnet`) with structured tool-use output.
* **Monetization:** RevenueCat SDK.

---

## ⚙️ Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
