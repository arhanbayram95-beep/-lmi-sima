import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { GlassCard } from './GlassCard';

describe('GlassCard', () => {
  it('renders its children', async () => {
    await render(
      <GlassCard>
        <Text>card content</Text>
      </GlassCard>
    );
    expect(screen.getByText('card content')).toBeTruthy();
  });
});
