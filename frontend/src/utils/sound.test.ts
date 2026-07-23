const mockCreateAsync = jest.fn();

jest.mock('expo-av', () => ({
  Audio: {
    Sound: { createAsync: (...args: unknown[]) => mockCreateAsync(...args) },
  },
}));

import { playCaptureChime, playPromptChime, startAmbientShimmerLoop } from './sound';

describe('sound utilities', () => {
  beforeEach(() => {
    mockCreateAsync.mockReset();
  });

  it('plays and auto-unloads a one-shot capture chime', async () => {
    const setOnPlaybackStatusUpdate = jest.fn();
    const playAsync = jest.fn().mockResolvedValue(undefined);
    const unloadAsync = jest.fn().mockResolvedValue(undefined);
    mockCreateAsync.mockResolvedValue({ sound: { setOnPlaybackStatusUpdate, playAsync, unloadAsync } });

    await playCaptureChime();

    expect(playAsync).toHaveBeenCalledTimes(1);
    const [onStatus] = setOnPlaybackStatusUpdate.mock.calls[0];
    onStatus({ isLoaded: true, didJustFinish: true });
    expect(unloadAsync).toHaveBeenCalledTimes(1);
  });

  it('does not throw when playback fails to load', async () => {
    mockCreateAsync.mockRejectedValue(new Error('no audio device'));
    await expect(playPromptChime()).resolves.toBeUndefined();
  });

  it('starts a looping ambient shimmer and stops it on request', async () => {
    const playAsync = jest.fn().mockResolvedValue(undefined);
    const stopAsync = jest.fn().mockResolvedValue(undefined);
    const unloadAsync = jest.fn().mockResolvedValue(undefined);
    mockCreateAsync.mockResolvedValue({ sound: { playAsync, stopAsync, unloadAsync } });

    const handle = await startAmbientShimmerLoop();
    expect(mockCreateAsync).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ isLooping: true }));
    expect(playAsync).toHaveBeenCalledTimes(1);

    await handle.stop();
    expect(stopAsync).toHaveBeenCalledTimes(1);
    expect(unloadAsync).toHaveBeenCalledTimes(1);
  });

  it('returns a no-op handle when the ambient loop fails to start', async () => {
    mockCreateAsync.mockRejectedValue(new Error('no audio device'));
    const handle = await startAmbientShimmerLoop();
    await expect(handle.stop()).resolves.toBeUndefined();
  });
});
