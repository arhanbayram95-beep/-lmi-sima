import { fireEvent, render, screen } from '@testing-library/react-native';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="Continue" onPress={onPress} />);
    await fireEvent.press(screen.getByText('Continue'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<PrimaryButton label="Continue" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByText('Continue'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
