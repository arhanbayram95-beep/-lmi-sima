import { render, screen } from '@testing-library/react-native';
import { ResultsScreen } from './ResultsScreen';

describe('ResultsScreen', () => {
  it('renders the empty state', async () => {
    await render(<ResultsScreen />);
    expect(screen.getByText('No readings yet')).toBeTruthy();
  });
});
