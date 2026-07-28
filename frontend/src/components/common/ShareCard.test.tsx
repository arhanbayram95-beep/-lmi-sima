import { render, screen } from '@testing-library/react-native';
import React from 'react';
import ShareCard from './ShareCard';
import { CareerPathResult } from '../../api/types';

const READING: CareerPathResult = {
  module: 'career_path',
  work_archetype_card: {
    title: 'Career Archetype',
    badge_tag: 'Strategic Innovator',
    summary: 'You read as someone people trust instantly.',
  },
  suitability_score_card: {
    title: 'Career Alignment Score',
    overall_score: 86,
    breakdown_metrics: [{ label: 'Strategy', score: 94, icon: 'compass' }],
  },
  domains_card: { title: 'Recommended Industries', top_industry_pills: ['Engineering & R&D'] },
  recommendations_card: {
    title: 'Ideal Role Matches',
    checklist_items: [{ headline: 'Systems Architect', description: 'Structured problem-solving.' }],
  },
};

describe('ShareCard', () => {
  it('renders the badge tag and its summary for capture', () => {
    render(<ShareCard reading={READING} />);
    expect(screen.getByText('Strategic Innovator')).toBeTruthy();
    expect(screen.getByText('You read as someone people trust instantly.')).toBeTruthy();
  });

  it('carries the overall score, whichever module produced the reading', () => {
    render(<ShareCard reading={READING} />);
    expect(screen.getByText('86')).toBeTruthy();
  });
});
