import { render, screen } from '@testing-library/react-native';
import { AnalyzeScreen } from './AnalyzeScreen';

describe('AnalyzeScreen', () => {
  it('renders the hero and feature grid', async () => {
    await render(<AnalyzeScreen />);
    expect(screen.getByText('3-Expression Face Reading')).toBeTruthy();
    expect(screen.getByText('Vibe & Temperament')).toBeTruthy();
    expect(screen.getByText('Daily Vibe Log')).toBeTruthy();
  });
});
