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

const mockPlayCaptureChime = jest.fn().mockResolvedValue(undefined);
const mockPlayPromptChime = jest.fn().mockResolvedValue(undefined);

jest.mock('../utils/sound', () => ({
  playCaptureChime: () => mockPlayCaptureChime(),
  playPromptChime: () => mockPlayPromptChime(),
}));

describe('CaptureScreen', () => {
  beforeEach(() => {
    mockTakePictureAsync.mockClear();
    mockRequestPermission.mockClear();
    mockPlayCaptureChime.mockClear();
    mockPlayPromptChime.mockClear();
    mockPermissionState = { granted: true };
    useAppStore.setState({ screen: 'capture', images: [], selectedModule: 'three-expression' });
  });

  it('prompts for camera access when permission is not granted', () => {
    mockPermissionState = { granted: false };
    render(<CaptureScreen />);
    fireEvent.press(screen.getByText('Allow Camera Access'));
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('offers a way out when camera permission is denied, instead of a dead end', () => {
    mockPermissionState = { granted: false };
    useAppStore.getState().goToScreen('analyze');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    fireEvent.press(screen.getByTestId('capture-close-button'));

    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('lets the user cancel mid-capture, discarding whatever was already taken', async () => {
    useAppStore.getState().goToScreen('analyze');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['mock-base64']));

    fireEvent.press(screen.getByTestId('capture-cancel-button'));

    expect(useAppStore.getState().screen).toBe('analyze');
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('captures all three expressions in order and stores them, then moves to analysis', async () => {
    render(<CaptureScreen />);

    expect(screen.getByText('Rest')).toBeTruthy();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['mock-base64']));

    expect(screen.getByText('Grin')).toBeTruthy();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['mock-base64', 'mock-base64']));

    expect(screen.getByText('Stern')).toBeTruthy();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toHaveLength(3));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(mockTakePictureAsync).toHaveBeenCalledTimes(3);
    expect(mockPlayCaptureChime).toHaveBeenCalledTimes(3);
    // Prompt chime greets Grin and Stern, not the opening Rest step.
    expect(mockPlayPromptChime).toHaveBeenCalledTimes(2);
  });

  it('captures 2 photos for Relationship Harmony — 1 per person, front then back camera', async () => {
    useAppStore.setState({ selectedModule: 'relationship-harmony' });
    render(<CaptureScreen />);

    expect(screen.getByText('Person One')).toBeTruthy();
    expect(screen.getByTestId('camera-preview').props.facing).toBe('front');
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['mock-base64']));

    expect(screen.getByText('Person Two')).toBeTruthy();
    expect(screen.getByTestId('camera-preview').props.facing).toBe('back');
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(useAppStore.getState().images).toHaveLength(2);
    expect(mockTakePictureAsync).toHaveBeenCalledTimes(2);
  });

  it('captures a single photo for Career Match', async () => {
    useAppStore.setState({ selectedModule: 'career-match' });
    render(<CaptureScreen />);

    expect(screen.getByText('Your Photo')).toBeTruthy();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(useAppStore.getState().images).toEqual(['mock-base64']);
    expect(mockTakePictureAsync).toHaveBeenCalledTimes(1);
  });
});
