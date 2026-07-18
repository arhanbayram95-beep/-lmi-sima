# Product Specification & Architecture Document (PRD)
## Project Name: Ilm-i Sima (Medieval Mystic Face Reader)
**Tech Blueprint:** React Native + TypeScript (Frontend) | Claude 3.5 Sonnet (AI Core)

---

## 1. Visual & Interactive Concept (HCI & Aesthetics)
The core value of this app lies in its *experience delivery*. It must feel like interacting with a mystical medieval contraption rather than a standard flat utility app.

* **Gamified Viewports:** Buttons should mimic vintage parchment blocks or glowing runes. Transitions use fading smoke or sliding leather scroll vectors.
* **Audio Feedback Ecosystem:** 
  * Audio cues on capture confirmation (e.g., a heavy iron shutter click followed by a low mystical bell chime).
  * Shuffling card/parchment loop sounds during the analysis processing screen.
* **Satirical Transparency:** The visual design intentionally leans so heavily into medieval wizardry, star charts, and alchemical diagrams that no user or app store reviewer could mistake it for a real medical or psychiatric assessment tool.

---

## 2. Core User Flow & The Triple Capture Mechanics

### 2.1 The Onboarding Crypt
* Strict age gate (+18 check) presented inside a stylized "Guardian Oath" screen.
* Revocable explicit checkbox for image processing, backed by a warm, human-centric privacy statement: *"Your face is processed using temporary digital alchemy and instantly forgotten. We store no images."*

### 2.2 The Ritual of Three Faces (Sequential Camera UI)
The interface enforces three distinct snapshots to build dynamic context for Claude Vision:
1. **The Slate (Neutral):** Captures foundational biological features under a calm medieval framing overlay.
2. **The Sun (Smiling):** Triggers joyful line movement around eyes and lips. A friendly sound chime prompts the user.
3. **The Tempest (Frowning/Stern):** Triggers contraction points along the brow line.
*Validation:* A local on-device check rejects frames without a single identifiable face before hitting the API to conserve server load.

---

## 3. Architecture & Data Flow

```text
[React Native App] 
   │  (1) Captures 3 Base64 Images locally in Zustand cache
   │  (2) Executes Audio & Haptic confirmation cues
   V
[Secure Serverless Backend Bridge]
   │  (3) Validates active token via RevenueCat SDK
   │  (4) Wraps images into a single payload with the Mystic System Prompt
   V
[Claude 3.5 Sonnet Vision API]
   │  (5) Generates structured cultural text response matching JSON format
   V
[React Native UI] 
   │  (6) Purges local memory of images instantly
   │  (7) Unfolds the Narrative Scroll UI with Instagram-friendly Share Card
