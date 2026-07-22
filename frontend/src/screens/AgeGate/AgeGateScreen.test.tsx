import { fireEvent, render, screen } from '@testing-library/react-native';
import { AgeGateScreen } from './AgeGateScreen';
import { createMockNavigation, createMockRoute } from '../../test-utils/mockNavigation';

describe('AgeGateScreen', () => {
  it('keeps Continue disabled until age and consent are both affirmed', async () => {
    const navigation = createMockNavigation();
    await render(<AgeGateScreen navigation={navigation as any} route={createMockRoute('AgeGate') as any} />);

    await fireEvent.press(screen.getByText('Continue'));
    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  it('navigates to RatingPrompt once age and consent are affirmed', async () => {
    const navigation = createMockNavigation();
    await render(<AgeGateScreen navigation={navigation as any} route={createMockRoute('AgeGate') as any} />);

    await fireEvent.press(screen.getByText("I'm 18 or older"));
    await fireEvent.press(screen.getByTestId('consent-checkbox'));
    await fireEvent.press(screen.getByText('Continue'));

    expect(navigation.navigate).toHaveBeenCalledWith('RatingPrompt');
  });

  it('shows the dead-end screen when under 18 is selected', async () => {
    const navigation = createMockNavigation();
    await render(<AgeGateScreen navigation={navigation as any} route={createMockRoute('AgeGate') as any} />);

    await fireEvent.press(screen.getByText("I'm under 18"));

    expect(screen.getByText('Age Restricted')).toBeTruthy();
  });
});
