import { fireEvent, render, screen } from '@testing-library/react-native';
import { OnboardingScreen } from './OnboardingScreen';
import { createMockNavigation, createMockRoute } from '../../test-utils/mockNavigation';

describe('OnboardingScreen', () => {
  it('routes to AgeGate when Skip Introduction is pressed', async () => {
    const navigation = createMockNavigation();
    await render(<OnboardingScreen navigation={navigation as any} route={createMockRoute('Onboarding') as any} />);
    await fireEvent.press(screen.getByText('Skip Introduction'));
    expect(navigation.navigate).toHaveBeenCalledWith('AgeGate');
  });
});
