import { FastifyInstance } from 'fastify';

// Mirrors frontend/src/content/legalContent.ts — App Store Connect and Play
// Console both require a real public URL for the privacy policy in store
// listing metadata, not just in-app modal text (see QA_FINDINGS.md,
// 2026-07-29). No shared package between frontend/backend (same tradeoff as
// readingSchema.ts/api/types.ts), so this is a deliberate second copy: any
// change to the legal copy has to land in both places.
interface LegalSection {
  heading: string;
  body: string;
}

const LEGAL_LAST_UPDATED = 'November 6, 2026';
const LEGAL_CONTACT_EMAIL = 'fevzi.bayram@boun.edu.tr';

const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    heading: 'Overview',
    body:
      'This Privacy Policy applies to the Questborn – AI Hero Creator app ("Application"), offered on an "AS IS" basis. Questborn turns photos you take in the app into original, fictional tabletop-RPG characters for entertainment. This policy explains what we collect, how it is used, and the choices you have. Questborn is intended for users aged 18 and over.',
  },
  {
    heading: 'Information Collection and Use',
    body:
      'The Application collects limited information when you use it: the photos you choose to submit for character creation (see Face Data below); subscription and purchase information, handled by our payments provider, RevenueCat; and, if you contact support, the content of your message plus basic diagnostic details (anonymous device ID, app version, platform, OS version, selected language) that you choose to send with it. We do not collect precise location data, and we do not run advertising or analytics tracking SDKs in the app.',
  },
  {
    heading: 'Face Data (User Photos)',
    body:
      "To create a character, you take or choose one or more ordinary photos: three of yourself for a Hero, one of yourself and one of a friend for a Party, or one of yourself for a Nemesis. These photos are used for one purpose only: as visual inspiration for an AI-generated fictional character (its look, costume, pose and story). They are not used to identify anyone, to verify identity, to analyze or describe your real personality, or for advertising, analytics, profiling, or model training. While the camera is open, the app runs on-device face detection only to check that a face is in frame before taking a photo; this check happens entirely on your device, and nothing from it is stored or transmitted. Questborn does not use Face ID, the TrueDepth camera, ARKit, or any depth or face-mesh data, does not perform facial recognition, and does not create or store a faceprint, face template, face geometry, or other biometric identifier. By submitting a photo in the app, you consent to its use for creating your character. We never sell, lease, trade, or otherwise profit from these photos or any information derived from them.",
  },
  {
    heading: 'Third Party Access',
    body:
      "Only the minimum data each provider needs to do its job is shared, and only with the following third-party services, each of which has its own privacy policy governing how it handles data: Google's Gemini API (see Face Data & Third-Party Access below) and RevenueCat (subscription and purchase events only; RevenueCat never receives your photos). We may also disclose information as required by law, such as to comply with a subpoena or similar legal process; when we believe in good faith that disclosure is necessary to protect our rights or your safety, investigate fraud, or respond to a government request; or with trusted service providers who work on our behalf, have no independent use of the information, and are bound to the same rules set out in this policy. We do not sell your personal data to anyone.",
  },
  {
    heading: 'Face Data & Third-Party Access',
    body:
      "Photos you submit are sent over an encrypted connection (HTTPS/TLS) to our backend server, which forwards them to our AI provider (currently Google's Gemini API, paid tier) solely to generate your character, along with a short instruction prompt. No name, account, email, or device identifier is sent with them. Under Google's Gemini API terms for paid services, Google does not use this content to train or improve its models; Google may retain it for a limited period (currently up to 55 days) solely to detect and prevent abuse of its service, after which it is deleted. Face data is not shared with any other third party, and never for advertising, marketing, or any other secondary use.",
  },
  {
    heading: 'Opt-Out Rights',
    body:
      'You can stop all collection of information by the Application at any time by uninstalling it, using the standard uninstall process for your device or app marketplace.',
  },
  {
    heading: 'Data Retention Policy',
    body:
      "On your device, photos are held in the app's memory only. They are never saved to your photo library, files, or any database, and are cleared when you leave the results screen. On our servers, photos exist only in memory for the duration of a single request, typically a few seconds, and are never written to disk or a database. At our AI provider, photos may be retained for up to 55 days solely for abuse monitoring, as described above. The generated character text is kept only in the app's memory on your device and is cleared when the app is closed; we do not store your characters on our servers. Subscription and billing records are retained by RevenueCat per their standard retention practices. Support correspondence is kept only as long as needed to resolve your request — contact us at the email below if you'd like it deleted sooner.",
  },
  {
    heading: 'Your Rights',
    body:
      "If you are located in the EU/UK/EEA, you generally have the right to access, correct, delete, restrict, or port your personal data, to object to certain processing, and to lodge a complaint with your local data protection supervisory authority. If you are a California resident, you have rights under the CCPA/CPRA, including the right to know what categories of personal information we collect, the right to request deletion, and — because photos of your face could be considered sensitive personal information — the right to limit our use of it to what's needed to create the character you asked for, which is already the only use we make of it. We do not sell or \"share\" (as CCPA defines that term, including for cross-context advertising) personal information. To exercise any of these rights, contact us using the details below.",
  },
  {
    heading: 'Children',
    body:
      'The Application does not knowingly solicit data from or market to anyone under the age of 18. Questborn requires users to self-certify that they are 18 or older during onboarding. If we become aware that we have inadvertently processed data from someone under 18, we will delete it promptly — if you are a parent or guardian and believe your child has provided us with information, please contact us at the email below.',
  },
  {
    heading: 'Security',
    body:
      'We provide physical, electronic, and procedural safeguards to protect the information we process. Photos are transmitted using industry-standard encryption (HTTPS/TLS) over secure channels. Because we do not persist your photos after processing, there is no long-term photo storage to secure.',
  },
  {
    heading: 'International Data Transfers',
    body:
      'Depending on where you are located, using Questborn may involve transferring your data to servers or service providers located in other countries, including the United States. We take reasonable steps to ensure such transfers comply with applicable data protection law.',
  },
  {
    heading: 'Changes',
    body:
      'This Privacy Policy may be updated from time to time for any reason. We will notify you of changes by updating this page with the new policy and the "last updated" date above, and, where required, by providing additional notice. Continued use of the Application after a change is deemed acceptance of that change.',
  },
  {
    heading: 'Your Consent',
    body: 'By using the Application, you consent to the processing of your information as set out in this Privacy Policy, now and as amended by us.',
  },
  {
    heading: 'Contact Us',
    body: `If you have any questions regarding privacy while using the Application, please contact us at ${LEGAL_CONTACT_EMAIL}.`,
  },
];

const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Acceptance of Terms',
    body:
      'These Terms & Conditions apply to the Questborn – AI Hero Creator app ("Application"), offered on an "AS IS" basis. By downloading, accessing, or using Questborn, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the app.',
  },
  {
    heading: 'Entertainment Purpose Only',
    body:
      'Questborn creates original, fictional tabletop-RPG characters inspired by your photos, for entertainment and creative play. Characters, stats, and stories are fiction: they are not a description, assessment, or prediction of you or anyone else, and nothing in the app should be relied upon as professional advice of any kind.',
  },
  {
    heading: 'Eligibility',
    body: 'Questborn is intended for users who are at least 18 years old. By using the app, you confirm that you meet this age requirement.',
  },
  {
    heading: 'Description of Service',
    body:
      'Questborn offers three creation modes: Hero (three poses become one character with an opening quest), Party (your photo and a friend\'s become a two-hero adventuring party), and Nemesis (one photo becomes a theatrical villain). Each result is generated by an AI model and can be shared as an image card.',
  },
  {
    heading: 'Subscriptions & Free Trial',
    body:
      "Full access to Questborn is offered through auto-renewing weekly or monthly subscriptions, managed through your App Store or Google Play account via RevenueCat. Payment is charged to your Apple ID or Google Play account at confirmation of purchase. Your subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period; your account will be charged for renewal within 24 hours prior to the end of the current period, at the cost of the plan you selected. Where offered, a free trial converts automatically into a paid subscription at the end of the trial period unless cancelled beforehand, and any unused portion of a free trial is forfeited when you purchase a subscription. You can view, manage, or cancel your subscription at any time from your device's account settings — cancellation is designed to be as simple as signing up.",
  },
  {
    heading: 'Acceptable Use',
    body:
      'You agree to use Questborn only with photos of yourself or of others who have given you permission, and not to use the app for any unlawful purpose, to harass or mock others, or to attempt to reverse-engineer, disrupt, or misuse the service.',
  },
  {
    heading: 'Intellectual Property',
    body:
      'Questborn, its branding, design, and underlying software are owned by us or our licensors and are protected by applicable intellectual property law. You retain ownership of your own photos, and you may freely use and share the characters you create for personal, non-commercial purposes. Questborn is an independent product and is not affiliated with, endorsed by, or sponsored by any tabletop game publisher.',
  },
  {
    heading: 'Third-Party Services',
    body:
      "Questborn relies on third-party services, including Google's Gemini API for character generation and RevenueCat for subscriptions. Your use of those features is also subject to those providers' own terms and privacy policies.",
  },
  {
    heading: 'Disclaimer of Warranties',
    body:
      'Questborn is provided "as is" and "as available," without warranties of any kind, express or implied, including as to accuracy, reliability, or fitness for a particular purpose. Characters are generated by an AI model and are fiction made for fun.',
  },
  {
    heading: 'Limitation of Liability',
    body:
      'To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of Questborn, including reliance on any content generated by the app.',
  },
  {
    heading: 'Termination',
    body:
      'We may suspend or terminate access to Questborn for any user who violates these terms. You may stop using the app and cancel your subscription at any time.',
  },
  {
    heading: 'Changes to the App or These Terms',
    body:
      'We may update Questborn or these terms from time to time. Continued use of the app after changes take effect constitutes acceptance of the updated terms.',
  },
  {
    heading: 'Contact Us',
    body: `If you have any questions about these Terms, please contact us at ${LEGAL_CONTACT_EMAIL}.`,
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderLegalPage(title: string, sections: LegalSection[]): string {
  const sectionsHtml = sections
    .map(
      (section) => `
      <section>
        <h2>${escapeHtml(section.heading)}</h2>
        <p>${escapeHtml(section.body)}</p>
      </section>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} — Questborn</title>
<style>
  body {
    background: #1A050B;
    color: #F5F3FF;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 20px 64px;
    line-height: 1.6;
  }
  h1 { color: #EBC983; font-size: 28px; margin-bottom: 4px; }
  .last-updated { color: #6E6A8A; font-size: 13px; margin-bottom: 32px; }
  h2 { color: #EBC983; font-size: 18px; margin-top: 28px; margin-bottom: 8px; }
  p { color: #B3B0CD; font-size: 15px; margin: 0; }
  .disclaimer { margin-top: 40px; font-size: 12px; color: #6E6A8A; }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="last-updated">Last updated: ${escapeHtml(LEGAL_LAST_UPDATED)}</p>
  ${sectionsHtml}
  <p class="disclaimer">
    This document is a working draft pending final legal review per target market
    (see PROJECT_SPEC.md &sect;6) and may be updated before public launch.
  </p>
</body>
</html>`;
}

const PRIVACY_HTML = renderLegalPage('Privacy Policy', PRIVACY_POLICY_SECTIONS);
const TERMS_HTML = renderLegalPage('Terms & Conditions', TERMS_SECTIONS);

// Static compliance pages, not the paid AI endpoint — exempt from
// rate-limiting (config.rateLimit: false) so a user re-reading the policy
// or an App Store/Play Store review crawler never gets blocked from it.
export function registerLegalRoutes(app: FastifyInstance): void {
  app.get('/legal/privacy', { config: { rateLimit: false } }, async (_request, reply) => {
    reply.type('text/html; charset=utf-8').send(PRIVACY_HTML);
  });

  app.get('/legal/terms', { config: { rateLimit: false } }, async (_request, reply) => {
    reply.type('text/html; charset=utf-8').send(TERMS_HTML);
  });
}
