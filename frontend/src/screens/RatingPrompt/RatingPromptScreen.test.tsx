import { fireEvent, render, screen } from '@testing-library/react-native';
import { RatingPromptScreen } from './RatingPromptScreen';
import { createMockNavigation, createMockRoute } from '../../test-utils/mockNavigation';

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  requestReview: jest.fn(() => Promise.resolve()),
}));

describe('RatingPromptScreen', () => {
  it('shows in-app feedback input instead of routing away for a low rating', async () => {
    const navigation = createMockNavigation();
    await render(<RatingPromptScreen navigation={navigation as any} route={createMockRoute('RatingPrompt') as any} />);

    await fireEvent.press(screen.getByTestId('star-2'));

    expect(screen.getByPlaceholderText('Your feedback…')).toBeTruthy();
    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});
