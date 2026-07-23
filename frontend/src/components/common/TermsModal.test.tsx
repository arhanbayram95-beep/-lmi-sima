import { render, screen } from '@testing-library/react-native';
import React from 'react';
import TermsModal from './TermsModal';

describe('TermsModal', () => {
  it('renders the free trial and subscription terms', () => {
    render(<TermsModal visible onClose={jest.fn()} />);
    expect(screen.getByTestId('terms-modal')).toBeTruthy();
    expect(screen.getByText('Subscriptions & Free Trial')).toBeTruthy();
  });
});
