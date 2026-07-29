import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';
import React from 'react';
import { LEGAL_URLS } from '../../api/config';
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

  it('opens the hosted policy externally, for the App Store/Play Console URL requirement', () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    render(<PrivacyPolicyModal visible onClose={jest.fn()} />);

    fireEvent.press(screen.getByTestId('privacy-policy-modal-open-external'));
    expect(openURL).toHaveBeenCalledWith(LEGAL_URLS.privacy);
  });
});
