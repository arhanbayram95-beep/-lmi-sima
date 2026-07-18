# Product Specification & Architecture Document (PRD)
## Project Name: Ilm-i Sima / Physiognomy Feedback App
**Version:** 1.0.0 (MVP)  
**Status:** Draft / Ready for AI Context  
**Framing & Positioning:** Strictly Entertainment / Cultural Novelty. Avoid clinical, psychological, or definitive diagnostic claims.

---

## 1. Executive Summary & Concept
An interactive mobile application where users upload three photographs of their face reflecting different emotional/expression states (Neutral, Smiling, Focused/Frowning). The app leverages a vision-capable Large Language Model (e.g., Claude 3.5 Sonnet) to analyze the facial dynamics through the historical lens of traditional *Ilm-i Sima* (Ottoman-era physiognomy). 

The output is delivered as a highly engaging, mystically-toned, and culturally-flavored narrative reading. The app implements a standard mobile subscription (freemium) model for unlocking deeper analysis, companion face compatibility, and historical logs.

---

## 2. Technical Stack & Architecture
* **Frontend:** React Native (TypeScript) with Expo (for high velocity development) or Bare Workflow.
* **State Management:** React Context or Zustand.
* **Camera Integration:** `react-native-vision-camera` or `expo-camera` supporting explicit multi-step capture overlays.
* **Backend Utilities:** Serverless Functions (Node.js/TypeScript or Python FastAPI) acting as a secure gateway to hide AI API Keys and validate monetization tokens.
* **AI Engine:** Claude API (Vision-capable model like `claude-3-5-sonnet`) passing three structured image base64 blocks within a single multi-modal payload.
* **In-App Purchases & Paywalls:** RevenueCat SDK tracking weekly/monthly subscription cycles.
* **Design/UI Prototype:** Built using Google Stitch layouts with a deep, dark mystical theme (midnight blues, gold accents, soft greys).

---

## 3. Core Feature List & User Flows

### 3.1 Onboarding & Legal Safeguards (Non-Negotiable)
* **Age Gate:** Enforce strict +18 certification before access.
* **Privacy Consent:** Explicit, revocable checkbox acknowledging biometric data processing.
* **Disclaimer Wall:** Persistent visibility stating: *"For entertainment and cultural exploration purposes only. Not a scientific or psychological assessment. No data is stored long-term."*

### 3.2 The Triple-Expression Camera Flow
The signature UX involves collecting three distinct states to build rich contextual input for the multi-modal prompt:
1. **Expression 1 (Neutral / Base):** For analyzing foundational features (forehead width, nose alignment, jaw baseline).
2. **Expression 2 (Smiling / Joyful):** For analyzing dynamic line changes (crow's feet, cheek elevation, lip curves).
3. **Expression 3 (Focused / Stern):** For analyzing tension points (brow furrow, micro-expression elasticity).

*Mechanism:* Guided viewfinder overlays instructing the user sequentially. Images are validated locally via lightweight face detection parameters before being sent to prevent API waste on non-face photos.

### 3.3 The Mystical Loading Sequence
* Triggered while the API call is in transit.
* Displays dynamic particle animations, historical Arabic/Ottoman text overlays parsing gracefully, or simulated cosmic maps to keep abandonment rates low during the 3-6 second LLM latency window.

### 3.4 Results & Social Integration (Share Cards)
* Renders structured data beautifully (e.g., Headline, Specific Trait breakups, and a cohesive narrative story).
* **Viral Engine:** A custom native visual snapshot converter (`react-native-view-shot`) compiling the results into a vertical 9:16 format perfectly styled for Instagram Stories or TikTok posts with the application's logo embedded.

---

## 4. Database & Privacy Constraints
* **Process-and-Discard Lifecycle:** Images are stored purely in memory/cache during the active session. Once the JSON payload returns from the AI API, the image data is systematically purged from server memory.
* **No Long-Term Biometric Storage:** The user's cloud profile only saves the historical text records (JSON data) if they explicitly opt into a historical log setting within a paid premium subscription tier.

---

## 5. Monetization Framework (Subscription Flow)
Managed natively via **RevenueCat**.
* **Free Tier:** 1 standard introductory reading per week (limited to a quick headline and single feature insight).
* **Premium Subscription (Weekly / Monthly):** 
  * Unlimited multi-expression deep reads.
  * Access to subsequent updates (e.g., Chinese Mian Xiang styles, dual-profile relationship compatibility).
  * High-fidelity custom share card styles.

---

## 6. Detailed AI Prompt Engineering Framework

### 6.1 The System Prompt Constraints
When configuring the Claude API system instruction block, apply the exact constraints below:
* **Role:** You are a master of classical cultural traditions, specializing in ancient *Ilm-i Sima* (physiognomy) and historical folklore narratives.
* **Tone:** Mystical, poetic, highly engaging, and empowering. Avoid deterministic or negative predictions. Never use clinical, psychiatric, medical, or diagnostic words (e.g., "depression", "narcissistic", "pathological").
* **Language:** Turkish (or localized matching target).
* **Methodology:** Use comparative historical analogies. Frame every interpretation defensively: *"Traditional manuscripts suggest that lines near the eyes during laughter reflect..."* or *"In historical Ottoman folklore, a broad forehead represents..."*
* **Safety Filter:** Instantly reject images of minors, explicit content, or obvious inanimate objects by returning an error block in the JSON instead of an analysis.

### 6.2 Target JSON Schema Output
The AI must strictly return a valid JSON structure matching the schema below:
```json
{
  "safety_status": "approved", 
  "headline": "Alnındaki Hikmet ve Tebessümün Gizemi",
  "traits": [
    {
      "feature": "Alın ve Kaş Yapısı (Nötr Hali)",
      "interpretation": "Geleneksel metinlerde geniş ve açık bir alın yapısı, kişinin bilgiye olan açlığını ve analitik düşünce kabiliyetini temsil eder."
    },
    {
      "feature": "Mimik Çizgileri (Gülüş Hali)",
      "interpretation": "Gülümseme anında beliren derin göz kenarı hatları, köklü bir sezgisel güce ve insan ilişkilerinde yüksek empatiye işaret eder."
    }
  ],
  "narrative": "Yüz hatlarındaki bu üç farklı duygu durumunun harmonisi, geçmiş dönemlerin bilge figürlerini andıran dengeli bir karakter örüntüsü fısıldıyor. Ciddiyet anındaki kararlılığın, tebessümle birleştiğinde çevrene güven veren bir enerjiye dönüşüyor...",
  "historical_quote": "'Çehre-i nas, kalbin aynasıdır' der eskiler; senin çehren ise dengeli bir zihnin yansıması.",
  "disclaimer_reminder": "Bu analiz tamamen kültürel anlatılara dayalı bir eğlence içeriğidir."
}
```

---

## 7. Open Architectural Tasks
- [ ] Implement local age gate caching utilizing `AsyncStorage`.
- [ ] Configure the RevenueCat payload webhooks to update premium user states inside the frontend layer.
- [ ] Define precise crop bounds in Google Stitch to avoid layout breakage when translating long Turkish text nodes into small mobile device frames.
