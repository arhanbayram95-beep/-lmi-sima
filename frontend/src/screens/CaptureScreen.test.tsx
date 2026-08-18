import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { useAppStore } from '../state/useAppStore';
import CaptureScreen from './CaptureScreen';

// Bytes chosen arbitrarily; base64-js encodes them deterministically to 'AQID'.
const mockFileData = new Uint8Array([1, 2, 3]).buffer;
const mockDispose = jest.fn();
const mockCapturePhoto = jest.fn().mockResolvedValue({
  getFileDataAsync: jest.fn().mockResolvedValue(mockFileData),
  dispose: mockDispose,
});
const mockRequestPermission = jest.fn();
let mockHasPermission = true;

jest.mock('react-native-vision-camera', () => ({
  useCameraPermission: () => ({
    hasPermission: mockHasPermission,
    requestPermission: mockRequestPermission,
  }),
  usePhotoOutput: () => ({ capturePhoto: mockCapturePhoto }),
}));

// Captures the live `onFacesDetected` callback so tests can simulate the
// on-device detector firing, deterministically, right before a shutter
// press — rather than relying on render/effect timing.
let latestOnFacesDetected: ((faces: unknown[]) => void) | undefined;

jest.mock('react-native-vision-camera-face-detector', () => {
  const { View } = require('react-native');
  return {
    Camera: (props: any) => {
      latestOnFacesDetected = props.onFacesDetected;
      return <View testID="camera-preview" {...props} />;
    },
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

const mockWarmUpBackend = jest.fn();

jest.mock('../api/reading', () => ({
  warmUpBackend: () => mockWarmUpBackend(),
}));

const mockLaunchImageLibraryAsync = jest.fn();

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: (...args: unknown[]) => mockLaunchImageLibraryAsync(...args),
}));

function detectFace() {
  act(() => {
    latestOnFacesDetected?.([{}]);
  });
}

function detectNoFace() {
  act(() => {
    latestOnFacesDetected?.([]);
  });
}

// Every step starts on the source-choice screen (PhotoSourceModal, shown
// before any <Camera> mounts) — tests that exercise the live camera path
// choose "Take Photo" first to reveal it, same as a real user would.
function chooseCameraSource() {
  fireEvent.press(screen.getByTestId('photo-source-camera'));
}

describe('CaptureScreen', () => {
  beforeEach(() => {
    mockCapturePhoto.mockClear();
    mockDispose.mockClear();
    mockRequestPermission.mockClear();
    mockPlayCaptureChime.mockClear();
    mockPlayPromptChime.mockClear();
    mockWarmUpBackend.mockClear();
    mockLaunchImageLibraryAsync.mockReset();
    mockHasPermission = true;
    latestOnFacesDetected = undefined;
    useAppStore.setState({ screen: 'capture', images: [], selectedModule: 'three-expression' });
  });

  it('pre-warms the backend on mount, to absorb a Render cold start during framing', () => {
    render(<CaptureScreen />);
    expect(mockWarmUpBackend).toHaveBeenCalledTimes(1);
  });

  it('prompts for camera access when permission is not granted', () => {
    mockHasPermission = false;
    render(<CaptureScreen />);
    fireEvent.press(screen.getByText('Allow Camera Access'));
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('offers a way out when camera permission is denied, instead of a dead end', () => {
    mockHasPermission = false;
    useAppStore.getState().goToScreen('analyze');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    fireEvent.press(screen.getByTestId('capture-close-button'));

    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('shows the source-choice screen before the camera opens, not a live camera immediately', () => {
    render(<CaptureScreen />);

    expect(screen.getByTestId('photo-source-modal')).toBeTruthy();
    expect(screen.queryByTestId('camera-preview')).toBeNull();
    expect(screen.queryByTestId('shutter-button')).toBeNull();
  });

  it('choosing "Take Photo" reveals the live camera for the current step', () => {
    render(<CaptureScreen />);
    chooseCameraSource();

    expect(screen.getByTestId('camera-preview')).toBeTruthy();
    expect(screen.getByTestId('shutter-button')).toBeTruthy();
    expect(mockLaunchImageLibraryAsync).not.toHaveBeenCalled();
  });

  it('asks for the photo source again at the start of every step, not just the first', async () => {
    render(<CaptureScreen />);

    chooseCameraSource();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    expect(screen.getByTestId('photo-source-modal')).toBeTruthy();
    expect(screen.queryByTestId('shutter-button')).toBeNull();
  });

  it('canceling the source-choice screen aborts the capture, same as the close button', () => {
    useAppStore.getState().goToScreen('analyze');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    fireEvent.press(screen.getByTestId('photo-source-cancel'));

    expect(useAppStore.getState().screen).toBe('analyze');
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('lets the user cancel mid-capture, discarding whatever was already taken', async () => {
    useAppStore.getState().goToScreen('analyze');
    useAppStore.getState().goToScreen('capture');

    render(<CaptureScreen />);
    chooseCameraSource();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    fireEvent.press(screen.getByTestId('capture-cancel-button'));

    expect(useAppStore.getState().screen).toBe('analyze');
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('captures all three expressions in order and stores them, then moves to analysis', async () => {
    render(<CaptureScreen />);

    expect(screen.getByText('Rest')).toBeTruthy();
    chooseCameraSource();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    expect(screen.getByText('Grin')).toBeTruthy();
    chooseCameraSource();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID', 'AQID']));

    expect(screen.getByText('Stern')).toBeTruthy();
    chooseCameraSource();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toHaveLength(3));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(mockCapturePhoto).toHaveBeenCalledTimes(3);
    expect(mockDispose).toHaveBeenCalledTimes(3);
    expect(mockPlayCaptureChime).toHaveBeenCalledTimes(3);
    // Prompt chime greets Grin and Stern, not the opening Rest step.
    expect(mockPlayPromptChime).toHaveBeenCalledTimes(2);
  });

  it('captures 2 photos for Relationship Harmony — 1 per person, front then back camera', async () => {
    useAppStore.setState({ selectedModule: 'relationship-harmony' });
    render(<CaptureScreen />);

    expect(screen.getByText('Person One')).toBeTruthy();
    chooseCameraSource();
    expect(screen.getByTestId('camera-preview').props.device).toBe('front');
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    expect(screen.getByText('Person Two')).toBeTruthy();
    chooseCameraSource();
    expect(screen.getByTestId('camera-preview').props.device).toBe('back');
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(useAppStore.getState().images).toHaveLength(2);
    expect(mockCapturePhoto).toHaveBeenCalledTimes(2);
  });

  it('captures a single photo for Career Match', async () => {
    useAppStore.setState({ selectedModule: 'career-match' });
    render(<CaptureScreen />);

    expect(screen.getByText('Your Photo')).toBeTruthy();
    chooseCameraSource();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
    expect(useAppStore.getState().images).toEqual(['AQID']);
    expect(mockCapturePhoto).toHaveBeenCalledTimes(1);
  });

  it('routes to the no-face-detected screen instead of capturing when no face is in frame', async () => {
    render(<CaptureScreen />);

    chooseCameraSource();
    detectNoFace();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('noFaceDetected'));
    expect(mockCapturePhoto).not.toHaveBeenCalled();
    expect(mockPlayCaptureChime).not.toHaveBeenCalled();
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('discards already-captured photos in the sequence if a later step has no face', async () => {
    render(<CaptureScreen />);

    chooseCameraSource();
    detectFace();
    fireEvent.press(screen.getByTestId('shutter-button'));
    await waitFor(() => expect(useAppStore.getState().images).toEqual(['AQID']));

    chooseCameraSource();
    detectNoFace();
    fireEvent.press(screen.getByTestId('shutter-button'));

    await waitFor(() => expect(useAppStore.getState().screen).toBe('noFaceDetected'));
    expect(useAppStore.getState().images).toEqual([]);
  });

  describe('choosing a photo from the library', () => {
    it('adds a picked photo and advances the step, same as a camera capture', async () => {
      mockLaunchImageLibraryAsync.mockResolvedValue({
        canceled: false,
        assets: [{ base64: 'PICKED_BASE64' }],
      });
      useAppStore.setState({ selectedModule: 'career-match' });
      render(<CaptureScreen />);

      fireEvent.press(screen.getByTestId('photo-source-library'));

      await waitFor(() => expect(useAppStore.getState().screen).toBe('analyzing'));
      expect(useAppStore.getState().images).toEqual(['PICKED_BASE64']);
      expect(mockLaunchImageLibraryAsync).toHaveBeenCalledWith(
        expect.objectContaining({ base64: true, quality: 0.6 })
      );
    });

    it('never mounts the live camera while the library picker is in flight', async () => {
      let resolvePick: (value: unknown) => void = () => {};
      mockLaunchImageLibraryAsync.mockReturnValue(
        new Promise((resolve) => {
          resolvePick = resolve;
        })
      );
      render(<CaptureScreen />);

      fireEvent.press(screen.getByTestId('photo-source-library'));
      expect(screen.queryByTestId('camera-preview')).toBeNull();

      await act(async () => {
        resolvePick({ canceled: true, assets: null });
      });
      expect(screen.queryByTestId('camera-preview')).toBeNull();
    });

    it('does nothing when the library picker is canceled', async () => {
      mockLaunchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: null });
      render(<CaptureScreen />);

      fireEvent.press(screen.getByTestId('photo-source-library'));

      await waitFor(() => expect(mockLaunchImageLibraryAsync).toHaveBeenCalledTimes(1));
      expect(useAppStore.getState().images).toEqual([]);
      expect(useAppStore.getState().screen).toBe('capture');
    });

    it('shows the capture error alert if the picked asset has no photo data', async () => {
      jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      mockLaunchImageLibraryAsync.mockResolvedValue({
        canceled: false,
        assets: [{ base64: null }],
      });
      render(<CaptureScreen />);

      fireEvent.press(screen.getByTestId('photo-source-library'));

      await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Capture Failed', expect.any(String)));
      expect(useAppStore.getState().images).toEqual([]);
      (Alert.alert as jest.Mock).mockRestore();
    });
  });
});
