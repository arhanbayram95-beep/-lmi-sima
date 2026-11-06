# Store Listing Copy — Draft

**Purpose:** ready-to-paste copy for App Store Connect / Google Play Console, written to Apple/Google field-length limits and consistent with `CLAUDE.md`'s locked "Entertainment Framing" rules (fictional character creator; never a reading of the real person; no trademarks; entertainment-only, 18+). Not final — review before submitting, especially anything marked **[NEEDS YOU]**.

---

## 1. App Store (iOS) — App Store Connect

**Pivot note (2026-11-06):** the previous "Face Reader: AI Physiognomy" listing was rejected under Guideline 4.3(b) (fortune telling is a saturated category). Everything below is rewritten for Questborn (PROJECT_SPEC.md §0). Do not reuse any of the old copy, keywords, or screenshots. Never use "D&D", "Dungeons & Dragons", or any other trademark in the name, subtitle, keywords, or screenshots (guideline 2.3.7, and it invites an IP complaint).

**App Name** (≤30 chars) — check availability in App Store Connect first:
```
Questborn: AI Hero Creator
```
(26 chars)

**Subtitle** (≤30 chars):
```
Your Selfie as an RPG Hero
```
(26 chars)

**Promotional Text** (≤170 chars):
```
Strike a pose and get a full fantasy character sheet: class, stats, abilities, backstory, and your first quest. Bring a friend to form a party, or summon your nemesis.
```
(167 chars)

**Description** (≤4000 chars, currently 2089):
```
Strike a pose. Meet your hero.

Questborn turns your selfies into an original fantasy RPG character, complete with a full character sheet, a backstory, and a quest to start. It's a character creator for tabletop fans, writers, and anyone who's ever wondered what kind of adventurer they'd be.

HOW IT WORKS
Strike three poses (Calm, Battle Cry, and your best Brooding look), and our AI game master uses them as costume and mood reference to forge a brand-new character. Your expression, outfit and vibe inspire the design. Everything it creates is invented fiction.

THREE WAYS TO PLAY
• Forge a Hero: a complete character sheet with class, lineage, alignment, six ability scores, hit points and armor class, signature abilities, starting gear, an animal companion, roleplay notes, a backstory, and the opening scene of your first quest.
• Assemble a Party: you and a friend become a two-hero adventuring party, with a team-up combo move and a shared first adventure.
• Summon Your Nemesis: one photo becomes your gloriously over-the-top villain twin, with an evil scheme, a lair, and a very silly weakness.

PAINT YOUR PORTRAIT
Tap "Paint My Portrait" to see yourself painted as your character: a storybook-style illustration in your hero's costume, with their companion at your side.

BUILT FOR THE TABLE
Every character is playable: real ability scores and modifiers, abilities you can drop into a campaign, and roleplay hooks for trait, ideal, bond, and quirk. Use them as player characters, NPCs, or story inspiration.

BUILT TO SHARE
Every character comes with a shareable card. Pick the sections and the color before you post.

PRIVACY FIRST
Your photos are only used as visual inspiration for your character and, if you ask, your painted portrait. They're processed in memory, never saved to our servers, never used for identification, and never used to train AI models. Full details in our Privacy Policy.

Questborn creates fictional characters for entertainment. Must be 18 or older to use. Questborn is an independent app and is not affiliated with any tabletop game publisher.
```

**Keywords** (≤100 chars, currently 100):
```
rpg character,hero maker,fantasy,tabletop,character sheet,ai avatar,dungeon,npc,quest,selfie,villain
```

**Support URL**:
```
https://sites.google.com/view/face-app-main/home/support
```
(Consider moving the Google Sites pages to a Questborn-named site. The old "face-app" path is visible to reviewers, and the pages' text must be updated either way; see section 3.)

**Privacy Policy URL**:
```
https://sites.google.com/view/face-app-main/home/privacy
```

**Category**: Entertainment (primary) · Games › Role Playing is a poor fit (there is no game loop); keep Entertainment.

**Age Rating** (App Information → Age Ratings), category by category. Everything not listed is "None":
- Cartoon or Fantasy Violence: **Infrequent/Mild** (battle cries, villains, showdown stories).
- Mature or Suggestive Themes: **None** (the oracle/mystic content that justified "Infrequent" before is gone).
- Medical or Treatment Information / Health or Wellness Topics: **None**.
- Age Assurance: **Present** (the onboarding 18+ self-certification).
- Use **Override to Higher Age Rating → 18+** to match the in-app age gate and Terms.

**Copyright**:
```
2026 Arhan Bayram
```

**App Review notes** (paste into App Review Information → Notes):
```
Questborn is a fictional character creator. Photos are used only as costume/pose reference for an invented tabletop-RPG character (stats, abilities, backstory). The app makes no claims about the user's personality, future, or traits, and does not perform face reading, fortune telling, or facial recognition. Photos are processed in memory and never stored by us; see the face-data answers in our reply in App Store Connect. A demo account is not needed. Subscriptions are required for character generation; sandbox purchases work in the review environment.
```

---

## 2. Google Play — Play Console

**App name** (≤30 chars): `Questborn: AI Hero Creator`

**Short description** (≤80 chars):
```
Turn your selfie into an original fantasy RPG hero, with stats and a backstory.
```
(79 chars)

**Full description**: same as the iOS Description above.

**Support email**: `fevzi.bayram@boun.edu.tr`

**Category**: Entertainment

**Content rating**: run the IARC questionnaire. Mild fantasy violence in text only; no gambling, no user-generated public content, no data sold.

---

## 3. Open items before either listing can actually be submitted

- [ ] **Update the live Google Sites privacy policy and terms pages** with the new text in `backend/src/legal-static/privacy.txt` and `terms.txt` (dated November 6, 2026). App Review compares the 2.1 face-data answers against the live page, so this must happen before replying.
- [ ] **Reply to the Guideline 2.1 face-data questions** in App Store Connect. A draft is in the session scratchpad (`apple-2.1-face-data-reply.md`), and it quotes the new policy sections.
- [ ] **Check that the name "Questborn" is available** in App Store Connect and do a basic trademark search before submitting.
- [ ] **New screenshots for both stores**; none of the old ones can be reused. Shot list: Create hub (three modes) → onboarding with the 18+ and consent checkboxes visible → capture mid-flow ("Battle Cry" step) → identity page (name, class line, HP/AC/Level) → ability scores page → backstory or quest page → paywall. Use "Choose from Library" with stock photos in the iOS Simulator (`xcrun simctl io booted screenshot <name>.png`).
- [ ] Replace the generated d20 icon with designer art if wanted (the current one is a clean SVG render on the locked palette, fine to ship).
- [ ] Support URL/page — update the wording on `sites.google.com/view/face-app-main/home/support`, ideally on a Questborn-named site.
- [x] Copyright holder name for App Store Connect — `2026 Arhan Bayram`
- [x] Confirmed `fevzi.bayram@boun.edu.tr` as the public support contact
- [ ] App preview video (optional, both stores)
