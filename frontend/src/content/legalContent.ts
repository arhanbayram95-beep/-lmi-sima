// Original drafts tailored to FaceAI's actual architecture (see PROJECT_SPEC.md
// and CLAUDE.md), informed by researched GDPR Art.9 / CCPA-CPRA (2026 regs) /
// Illinois BIPA conventions for face-photo AI apps and by how comparable
// face-scanning / personality-quiz apps in this category structure their
// policies. These are a starting point for the team, not a substitute for
// real legal review per PROJECT_SPEC.md §6 before public launch — the
// biometric-data and third-party-AI framing below in particular should be
// checked by counsel against the jurisdictions FaceAI actually launches in.
//
// IMPORTANT — Gemini API tier flag (2026-07-24): the "no training on your
// data" claim in Third-Party Services and Biometric Data below is only true
// on Google's PAID Gemini API tier (ai.google.dev/gemini-api/docs/logs-policy);
// the free tier Google uses to develop/improve its products and allows human
// review, for users outside the EEA/UK/Switzerland (where paid-tier terms
// apply regardless of tier). Confirm the production key is on a
// billing-enabled project before shipping this policy — see QA_FINDINGS.md.

export interface LegalSection {
  heading: string;
  body: string;
}

export const LEGAL_LAST_UPDATED = 'July 24, 2026';
export const LEGAL_CONTACT_EMAIL = 'fevzi.bayram@boun.edu.tr';

export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    heading: 'Overview',
    body:
      'FaceAI ("we", "us") provides a playful, entertainment-only AI character and expression reading generated from three photos you take in the app. This policy explains what we collect, how your photos are used, and what choices you have. FaceAI is intended for users aged 18 and over.',
  },
  {
    heading: 'Information We Collect',
    body:
      'Photos you capture (Calm, Bright, Deep), collected directly from your device camera, for the sole purpose of generating your reading. Subscription and purchase information, handled by our payments provider, RevenueCat. If you contact support, the content of your message and basic diagnostic details (anonymous device ID, app version, platform, OS version, selected language) that you choose to send with it. We do not collect precise location data, and we do not run advertising or analytics tracking SDKs in the app.',
  },
  {
    heading: 'Biometric Data',
    body:
      "Your three photos show your face, so we want to be direct about this: FaceAI does not perform facial recognition, does not create or store a faceprint, face template, or other biometric identifier capable of uniquely identifying you, and does not compare your photos against any other photo, database, or person. Your photos are used only to generate descriptive, entertainment-style text about the vibe of each expression — nothing that identifies or verifies who you are. Because of this, we do not treat your photos as biometric identifiers under laws like Illinois's Biometric Information Privacy Act (BIPA) or as \"biometric data\" under Article 9 of the GDPR, both of which are specifically about identification, not descriptive analysis. If you're located somewhere that legally requires it, capturing your photos in the app is the informed, written consent to that processing (see 'How Your Photos Are Used' for purpose and 'Data Retention' for how long — the answer is: not at all, once your reading is generated). We never sell, lease, trade, or otherwise profit from your photos or any information derived from them.",
  },
  {
    heading: 'How Your Photos Are Used',
    body:
      "Your three photos are sent securely to our backend, which forwards them to a third-party AI provider (currently Google's Gemini API — see Third-Party Services) to generate your reading. Photos are held in memory only for the duration of that request and are discarded immediately afterward on our servers — they are never written to disk, stored in a database, or kept between sessions. We do not use your photos for facial recognition, to build a biometric profile of you, for advertising, or for tracking you across apps or devices.",
  },
  {
    heading: 'Third-Party Services',
    body:
      "We rely on a small number of third-party providers to operate FaceAI, and we only share what each one needs to do its specific job. Currently: Google (Gemini API) receives your three photos and a short instruction prompt, and returns the generated reading text — nothing else about you is sent. On Google's paid API tier, which FaceAI is intended to run on, Google does not use this content to train its models; a limited, short-lived log is kept solely to detect abuse of the API, per Google's own terms. RevenueCat receives subscription and purchase events to manage your subscription. These providers process data under their own privacy policies and only to the extent necessary to provide their service to us. The AI provider may change as we evaluate options (see PROJECT_SPEC.md §4) — we'll update this section, and the 'last updated' date below, whenever it does. We do not sell your personal data to anyone.",
  },
  {
    heading: 'Data Retention',
    body:
      'We do not retain your photos after your reading is generated — they exist only for the seconds it takes to process a single request, both on our own servers and, per our agreement with our AI provider, on theirs. The generated reading text itself lives only in your device\'s memory for your current app session; we do not store a history of past readings on our servers. Subscription and billing records are retained by RevenueCat per their standard retention practices. Support correspondence is kept only as long as needed to resolve your request.',
  },
  {
    heading: 'Your Rights',
    body:
      "If you are located in the EU/UK/EEA, you generally have the right to access, correct, delete, restrict, or port your personal data, to object to certain processing, and to lodge a complaint with your local data protection supervisory authority. If you are a California resident, you have rights under the CCPA/CPRA, including the right to know what categories of personal information we collect (see 'Information We Collect'), the right to request deletion, and — because photos of your face could be considered sensitive personal information — the right to limit our use of it to what's needed to provide the reading you asked for, which is already the only use we make of it. We do not sell or 'share' (as CCPA defines that term, including for cross-context advertising) personal information. To exercise any of these rights, contact us using the details below.",
  },
  {
    heading: "Children's Privacy",
    body:
      'FaceAI requires users to self-certify that they are 18 or older during onboarding and is not directed at anyone under that age. If we become aware that we have inadvertently processed data from someone under 18, we will delete it promptly.',
  },
  {
    heading: 'Security',
    body:
      'Photos are transmitted over encrypted connections (HTTPS/TLS). Because we do not persist your photos after processing, there is no long-term photo storage to secure — the strongest protection is that the data simply does not stick around.',
  },
  {
    heading: 'International Data Transfers',
    body:
      'Depending on where you are located, using FaceAI may involve transferring your data to servers or service providers located in other countries, including the United States. We take reasonable steps to ensure such transfers comply with applicable data protection law.',
  },
  {
    heading: 'Changes to This Policy',
    body:
      'We may update this policy from time to time. Material changes will be reflected by updating the "last updated" date below, and, where required, we will provide additional notice.',
  },
  {
    heading: 'Contact Us',
    body: `Questions about this policy or your data can be sent to ${LEGAL_CONTACT_EMAIL}.`,
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Acceptance of Terms',
    body:
      'By downloading, accessing, or using FaceAI, you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use the app.',
  },
  {
    heading: 'Entertainment Purpose Only',
    body:
      'FaceAI generates playful, AI-assisted "vibe" readings from your photos for entertainment purposes only. It is not a clinical, psychological, medical, or diagnostic tool, and nothing in the app should be relied upon as professional advice of any kind.',
  },
  {
    heading: 'Eligibility',
    body:
      'FaceAI is intended for users who are at least 18 years old. By using the app, you confirm that you meet this age requirement.',
  },
  {
    heading: 'Description of Service',
    body:
      'The app guides you through capturing three expressions (Calm, Bright, Deep), sends them to our backend for AI-generated analysis, and presents the resulting reading back to you, along with a shareable card. Results are generated by an AI model and may vary between sessions.',
  },
  {
    heading: 'Subscriptions & Free Trial',
    body:
      'Full access to FaceAI is offered through auto-renewing weekly or annual subscriptions, managed through your App Store or Google Play account via RevenueCat. Where offered, a free trial converts automatically into a paid subscription at the end of the trial period unless cancelled beforehand. You can view, manage, or cancel your subscription at any time from your device\'s account settings — cancellation is designed to be as simple as signing up.',
  },
  {
    heading: 'Acceptable Use',
    body:
      'You agree to use FaceAI only with photos of yourself (or of others who have given you permission), and not to use the app for any unlawful purpose, to harass others, or to attempt to reverse-engineer, disrupt, or misuse the service.',
  },
  {
    heading: 'Intellectual Property',
    body:
      'FaceAI, its branding, design, and underlying software are owned by us or our licensors and are protected by applicable intellectual property law. You retain ownership of your own photos; using the app does not transfer any rights in the app itself to you.',
  },
  {
    heading: 'Third-Party Services',
    body:
      "The app relies on third-party services, including our AI provider (currently Google's Gemini API — see our Privacy Policy for what's shared with them) and RevenueCat (for subscription billing), as well as the App Store or Google Play for distribution and payment processing. Your use of those platforms is also subject to their own terms.",
  },
  {
    heading: 'Disclaimer of Warranties',
    body:
      'FaceAI is provided "as is" and "as available," without warranties of any kind, express or implied, including as to accuracy, reliability, or fitness for a particular purpose. Readings are generated by an AI model and are inherently subjective and for fun — we make no claims about their accuracy.',
  },
  {
    heading: 'Limitation of Liability',
    body:
      'To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of FaceAI, including reliance on any reading generated by the app.',
  },
  {
    heading: 'Termination',
    body:
      'We may suspend or terminate access to FaceAI for any user who violates these terms. You may stop using the app and cancel your subscription at any time.',
  },
  {
    heading: 'Changes to the App or These Terms',
    body:
      'We may update FaceAI or these terms from time to time. Continued use of the app after changes take effect constitutes acceptance of the updated terms.',
  },
  {
    heading: 'Governing Law',
    body:
      'The governing law and venue for disputes will be specified here once finalized with legal counsel for the entity operating FaceAI.',
  },
  {
    heading: 'Contact Us',
    body: `Questions about these terms can be sent to ${LEGAL_CONTACT_EMAIL}.`,
  },
];
