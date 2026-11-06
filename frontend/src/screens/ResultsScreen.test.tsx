import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import ResultsScreen from './ResultsScreen';
import { MOCK_READING_RESULTS } from '../api/mockReading';
import { useAppStore } from '../state/useAppStore';



const HERO_READING = MOCK_READING_RESULTS.hero;

const NEMESIS_READING = MOCK_READING_RESULTS.nemesis;

const HISTORY = [
  { id: 'reading-2', reading: NEMESIS_READING, completedAt: 1_700_000_100_000 },
  { id: 'reading-1', reading: HERO_READING, completedAt: 1_700_000_000_000 },
];

describe('ResultsScreen', () => {
  beforeEach(() => {
    useAppStore.setState({ screen: 'results', history: [], reading: null });
  });

  it('shows an empty state when there are no readings yet', () => {
    render(<ResultsScreen />);
    expect(screen.getByText('No Characters Yet')).toBeTruthy();
  });

  it('routes Create a Character through the Create hub', () => {
    render(<ResultsScreen />);
    fireEvent.press(screen.getByText('Create a Character'));
    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('lists a row per logged reading instead of the empty state', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    expect(screen.queryByText('No Characters Yet')).toBeNull();
    expect(screen.getByTestId('history-entry-reading-1')).toBeTruthy();
    expect(screen.getByTestId('history-entry-reading-2')).toBeTruthy();
  });

  // Each module's row reads from its own badge card via readingBadgeCard —
  // a module whose branch is missed there renders a blank row, not an error.
  it('summarises each row with that module’s own badge card', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    expect(screen.getByText('Wren Ashdown, the Unhurried Storm')).toBeTruthy();
    expect(screen.getByText('Baron Velvetgloom, the Unhurried Storm')).toBeTruthy();
  });

  it('reopens the tapped reading on the reveal screen', () => {
    useAppStore.setState({ history: HISTORY });
    render(<ResultsScreen />);

    fireEvent.press(screen.getByTestId('history-entry-reading-1'));

    expect(useAppStore.getState().reading).toEqual(HERO_READING);
    expect(useAppStore.getState().screen).toBe('reveal');
  });
});
