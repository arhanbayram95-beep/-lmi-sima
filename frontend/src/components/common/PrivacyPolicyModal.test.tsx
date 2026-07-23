import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal';

describe('PrivacyPolicyModal', () => {
  it('is hidden when not visible', () => {
    render(<PrivacyPolicyModal visible={false} onClose={jest.fn()} />);
    expect(screen.queryByTestId('privacy-policy-modal')).toBeNull();
  });

  it('calls onClose when the Close button is pressed', () => {
    const onClose = jest.fn();
    render(<PrivacyPolicyModal visible onClose={onClose} />);
    fireEvent.press(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
