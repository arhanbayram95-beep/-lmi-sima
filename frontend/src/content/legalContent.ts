// Original drafts tailored to FaceAI's actual architecture (see PROJECT_SPEC.md
// and CLAUDE.md), using the structure of comparable AI photo-analysis apps as a
// reference point only. These are a starting point for the team, not a
// substitute for legal review per PROJECT_SPEC.md §6 before public launch.

export interface LegalSection {
  heading: string;
  body: string;
}

export const LEGAL_LAST_UPDATED = 'July 23, 2026';
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
      'Photos you capture (Calm, Bright, Deep) for the purpose of generating your reading. Subscription and purchase information, handled by our payments provider, RevenueCat. If you contact support, the content of your message and basic diagnostic details (anonymous device ID, app version, platform, OS version, selected language) that you choose to send with it. We do not collect precise location data, and we do not run advertising or analytics tracking SDKs in the app.',
  },
  {
    heading: 'How Your Photos Are Used',
    body:
      'Your three photos are sent securely to our backend, which forwards them to Anthropic\'s Claude API to generate your reading. Photos are held in memory only for the duration of that request and are discarded immediately afterward — they are never written to disk, stored in a database, or kept between sessions. We do not use your photos for facial recognition, to build a biometric profile of you, for advertising, or for tracking you across apps or devices.',
  },
  {
    heading: 'Third-Party Services',
    body:
      'We rely on a small number of third-party providers to operate FaceAI: Anthropic (Claude API) to generate your reading from your photos, and RevenueCat to manage subscriptions and purchases. These providers process data under their own privacy policies and only to the extent necessary to provide their service to us. We do not sell your personal data to anyone.',
  },
  {
    heading: 'Data Retention',
    body:
      'We do not retain your photos after your reading is generated. Subscription and billing records are retained by RevenueCat per their standard retention practices. Support correspondence is kept only as long as needed to resolve your request.',
  },
  {
    heading: 'Your Rights',
    body:
      'If you are located in the EU/UK, you generally have the right to access, correct, delete, restrict, or port your personal data, and to object to certain processing. If you are a California resident, you have similar rights under the CCPA, including the right to know what we collect and to request deletion; we do not sell personal information. To exercise any of these rights, contact us using the details below.',
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
      'The app relies on third-party services, including Anthropic (for AI analysis) and RevenueCat (for subscription billing), as well as the App Store or Google Play for distribution and payment processing. Your use of those platforms is also subject to their own terms.',
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
