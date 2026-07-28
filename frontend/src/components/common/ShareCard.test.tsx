import { render, screen } from '@testing-library/react-native';
import React from 'react';
import ShareCard from './ShareCard';
import { CareerPathResult, RelationshipHarmonyResult } from '../../api/types';

const CAREER_READING: CareerPathResult = {
  module: 'career_path',
  work_archetype_card: {
    title: 'Career Archetype',
    badge_tag: 'Strategic Innovator',
    summary: 'You read as someone people trust instantly.',
  },
  domains_card: { title: 'Recommended Industries', top_industry_pills: ['Engineering & R&D'] },
  recommendations_card: {
    title: 'Ideal Role Matches',
    checklist_items: [{ headline: 'Systems Architect', description: 'Structured problem-solving.' }],
  },
};

const RELATIONSHIP_READING: RelationshipHarmonyResult = {
  module: 'relationship_harmony',
  vibe_card: {
    title: 'Relational Archetype',
    badge_tag: 'Grounded & Playful Harmonizer',
    summary: 'Two styles that meet in the middle.',
  },
  chemistry_score_card: {
    title: 'Chemistry & Synergy Score',
    overall_score: 86,
    breakdown_metrics: [{ label: 'Empathy', score: 94, icon: 'heart' }],
  },
  dynamics_card: { title: 'Relationship Dynamics', best_chemistry_pills: ['Grounded Calmness'], vibes_to_avoid_pills: [] },
  guidance_card: { title: 'Harmony Recommendations', checklist_items: [] },
};

describe('ShareCard', () => {
  it('renders the badge tag and its summary for capture', () => {
    render(<ShareCard reading={CAREER_READING} />);
    expect(screen.getByText('Strategic Innovator')).toBeTruthy();
    expect(screen.getByText('You read as someone people trust instantly.')).toBeTruthy();
  });

  it('omits the score line for a module that no longer carries a score card', () => {
    render(<ShareCard reading={CAREER_READING} />);
    expect(screen.queryByText('86')).toBeNull();
  });

  it('carries the overall score for relationship_harmony, the one module that kept a score card', () => {
    render(<ShareCard reading={RELATIONSHIP_READING} />);
    expect(screen.getByText('86')).toBeTruthy();
  });

  it('leads with the module highlight instead of the badge tag in the highlight variant', () => {
    render(<ShareCard reading={CAREER_READING} variant="highlight" />);
    expect(screen.getByText('Engineering & R&D')).toBeTruthy();
    expect(screen.getByText('TOP INDUSTRY')).toBeTruthy();
    // The badge tag still appears, just as the secondary line, not the headline.
    expect(screen.getByText('Strategic Innovator')).toBeTruthy();
  });
});
