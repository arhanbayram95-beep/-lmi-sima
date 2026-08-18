import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MasterCardNarrative, MythicTale } from '../../api/types';
import { useTranslation } from '../../i18n/useTranslation';
import { Theme } from '../../ui/theme';

// Bolds roughly the first sentence of a paragraph — an editorial "lead-in"
// technique (the same idea as a magazine's bolded opening line) that gives
// a long block of AI-generated prose a scannable entry point instead of
// reading as one undifferentiated wall of text (product feedback: "a
// little too text dumping... use fonts bold n other tools to make less
// text more contentful"). Deliberately not full NLP/keyword
// highlighting — there's no reliable way to know which *words* matter in
// free-form generated text, but "the first sentence" is a structural
// property every paragraph already has. Capped at 70 chars so one
// unusually long opening sentence doesn't just bold the whole paragraph;
// falls back to a flat character cut if there's no sentence-ending
// punctuation within the cap, so a paragraph with no early "."/"!"/"?"
// still gets a bolded lead instead of none at all.
function splitLead(text: string): { lead: string; rest: string } {
  const match = text.match(/^(.{1,70}?[.!?])\s*([\s\S]*)$/);
  if (match) {
    return { lead: match[1], rest: match[2] };
  }
  const cutoff = Math.min(70, text.length);
  return { lead: text.slice(0, cutoff), rest: text.slice(cutoff) };
}

function LeadParagraph({ text, style }: { text: string; style: object }) {
  const { lead, rest } = splitLead(text);
  return (
    <Text style={style}>
      <Text style={styles.paragraphLead}>{lead}</Text>
      {rest ? ` ${rest}` : ''}
    </Text>
  );
}

// The generic content renderer for every deep master card, across all
// three reading modules — see MasterCardNarrative's own comment in
// api/types.ts for why the shape has to be identical everywhere. Renders
// inside TapToRevealCard once a card is unveiled.
//
// Header is a plain two-child flex row (icon fixed, title flex:1,
// numberOfLines caps runaway length) with nothing absolutely positioned
// over it — the explicit "fix header overlap" ask is solved structurally
// here, not patched: every per-card stat (aura, resonance, polarity
// meters, rarity index) now renders in its own statsSection block below
// the header/hero_hook, never crammed into the header row itself, so
// there is nothing left for a title to collide with.
export default function MasterCard({
  icon,
  title,
  narrative,
  statsSection,
  mythicTale,
  testID,
}: {
  icon: string;
  title: string;
  narrative: MasterCardNarrative;
  statsSection?: React.ReactNode;
  mythicTale?: MythicTale;
  testID?: string;
}) {
  const t = useTranslation();

  return (
    <View testID={testID}>
      <View style={styles.headerRow}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>

      <Text style={styles.heroHook}>{narrative.hero_hook}</Text>

      {statsSection}

      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionLabelBar} />
          <Text style={styles.sectionLabel}>{t('reveal.whatItSays')}</Text>
        </View>
        {narrative.anatomical_decoding.map((line, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletGlyph}>◆</Text>
            <Text style={styles.bulletText}>{line}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <View style={styles.sectionLabelBar} />
          <Text style={styles.sectionLabel}>{t('reveal.livingScenario')}</Text>
        </View>
        {narrative.living_scenario.map((paragraph, index) => (
          <LeadParagraph key={index} text={paragraph} style={styles.paragraph} />
        ))}
      </View>

      <View style={styles.insightCallout}>
        <Text style={styles.insightHeadline}>{narrative.actionable_insight.headline}</Text>
        <Text style={styles.insightDescription}>{narrative.actionable_insight.description}</Text>
      </View>

      {mythicTale && (
        // A visually distinct block (subtle tint + border), not just
        // another `section` — it's the card's 4th-7th consecutive
        // paragraph by this point, and giving it its own frame reads as a
        // deliberate "bonus story" rather than the wall of text just
        // continuing further.
        <View style={styles.mythicBlock}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionLabelBar} />
            <Text style={styles.mythicTitle}>{mythicTale.tale_title}</Text>
          </View>
          {mythicTale.paragraphs.map((paragraph, index) => (
            <LeadParagraph key={index} text={paragraph} style={styles.paragraph} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Theme.spacing.xs,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTitle: {
    ...Theme.typography.headlineMd,
    flex: 1,
    fontSize: 21,
    letterSpacing: -0.2,
    color: Theme.colors.accent.goldSecondary,
    textShadowColor: 'rgba(235, 201, 131, 0.4)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  heroHook: {
    ...Theme.typography.headlineLg,
    fontSize: 19,
    lineHeight: 26,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  section: {
    marginTop: Theme.spacing.md,
    gap: 8,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  // A short accent bar instead of a bare label — a small, cheap way to
  // give each section a real visual anchor instead of every block just
  // starting with a line of small grey caps that blurs together with the
  // rest of the page on a quick scroll.
  sectionLabelBar: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  sectionLabel: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletGlyph: {
    fontSize: 9,
    color: Theme.colors.accent.goldSecondary,
    marginTop: 6,
  },
  bulletText: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    flex: 1,
    color: Theme.colors.text.secondary,
  },
  paragraph: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    lineHeight: 22,
    color: Theme.colors.text.secondary,
  },
  // See splitLead/LeadParagraph — the opening sentence of a scenario or
  // fable paragraph, bolded and lifted toward full-white as a scannable
  // entry point into the rest of the (still-muted) paragraph.
  paragraphLead: {
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  insightCallout: {
    marginTop: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(158, 41, 65, 0.4)',
    backgroundColor: 'rgba(158, 41, 65, 0.12)',
    padding: Theme.spacing.sm,
    gap: 4,
  },
  insightHeadline: {
    ...Theme.typography.headlineMd,
    fontSize: 15,
    color: Theme.colors.accent.goldSecondary,
  },
  insightDescription: {
    ...Theme.typography.bodyMd,
    fontSize: 13,
    color: Theme.colors.text.secondary,
  },
  mythicBlock: {
    marginTop: Theme.spacing.md,
    gap: 8,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(235, 201, 131, 0.25)',
    backgroundColor: 'rgba(235, 201, 131, 0.05)',
    padding: Theme.spacing.sm,
  },
  mythicTitle: {
    ...Theme.typography.labelSm,
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.accent.goldSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
});
