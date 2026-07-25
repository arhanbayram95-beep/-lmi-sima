import { render, screen } from '@testing-library/react-native';
import React from 'react';
import AppLogo from './AppLogo';

describe('AppLogo', () => {
  it('renders the Face Reader wordmark', () => {
    render(<AppLogo />);
    expect(screen.getByText('Face Reader')).toBeTruthy();
  });
});
