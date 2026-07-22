import { fireEvent, render, screen } from '@testing-library/react-native';
import { SettingsScreen } from './SettingsScreen';
import { createMockNavigation, createMockRoute } from '../../../test-utils/mockNavigation';

describe('SettingsScreen', () => {
  it('navigates to DataDiscard when that row is pressed', async () => {
    const navigation = createMockNavigation();
    await render(<SettingsScreen navigation={navigation as any} route={createMockRoute('SettingsHome') as any} />);

    await fireEvent.press(screen.getByText('Data Discard'));

    expect(navigation.navigate).toHaveBeenCalledWith('DataDiscard');
  });
});
