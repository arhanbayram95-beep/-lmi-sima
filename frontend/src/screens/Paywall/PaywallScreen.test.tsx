import { fireEvent, render, screen } from '@testing-library/react-native';
import { PaywallScreen } from './PaywallScreen';
import { createMockNavigation, createMockRoute } from '../../test-utils/mockNavigation';

describe('PaywallScreen', () => {
  it('resets to MainHub when a CTA is pressed', async () => {
    const navigation = createMockNavigation();
    await render(<PaywallScreen navigation={navigation as any} route={createMockRoute('Paywall') as any} />);

    await fireEvent.press(screen.getByText('Not Now'));

    expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'MainHub' }] });
  });

  it('shows both pricing tiers with their badges', async () => {
    await render(<PaywallScreen navigation={createMockNavigation() as any} route={createMockRoute('Paywall') as any} />);

    expect(screen.getByText('MOST POPULAR')).toBeTruthy();
    expect(screen.getByText('SAVE 60%')).toBeTruthy();
  });
});
