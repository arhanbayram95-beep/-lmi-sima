import { render, screen } from '@testing-library/react-native';
import React from 'react';
import AppLogo from './AppLogo';

describe('AppLogo', () => {
  it('renders the FaceAI wordmark', () => {
    render(<AppLogo />);
    expect(screen.getByText('FaceAI')).toBeTruthy();
  });
});
