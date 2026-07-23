import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useAppStore } from '../state/useAppStore';
import CaptureScreen from './CaptureScreen';

const mockTakePictureAsync = jest.fn().mockResolvedValue({ base64: 'mock-base64', uri: 'file://mock.jpg' });
const mockRequestPermission = jest.fn();
let mockPermissionState: { granted: boolean } | null = { granted: true };

jest.mock('expo-camera', () => {
  const { forwardRef, useImperativeHandle } = require('react');
  const { View } = require('react-native');
  return {
    CameraView: forwardRef((props: any, ref: any) => {
      useImperativeHandle(ref, () => ({ takePictureAsync: mockTakePictureAsync }));
      return <View testID="camera-preview" {...props} />;
    }),
    useCameraPermissions: () => [mockPermissionState, mockRequestPermission],
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
}));

describe('CaptureScreen', () => {
  beforeEach(() => {
    mockTakePictureAsync.mockClear();
    mockRequestPermission.mockClear();
    mockPermissionState = { granted: true };
    useAppStore.setState({ screen: 'capture', images: {} });
  });

  it('prompts for camera access when permission is not granted', () => {
    mockPermissionState = { granted: false };
    render(<CaptureScreen />);
    fireEvent.press(screen.getByText('Allow Camera Access'));
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('captures all three expressions in order and stores them, then moves to analysis', async () => {
    render(<CaptureScreen />);

    expect(screen.getByText('Calm')).toBeTruthy();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images.calm).toBe('mock-base64'));

    expect(screen.getByText('Bright')).toBeTruthy();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images.bright).toBe('mock-base64'));

    expect(screen.getByText('Deep')).toBeTruthy();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images.deep).toBe('mock-base64'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(mockTakePictureAsync).toHaveBeenCalledTimes(3);
  });
});
