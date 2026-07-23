import { Audio } from 'expo-av';

// Synthesized placeholder chimes (see frontend/assets/audio) — generated
// procedurally, not professionally produced. Swap the files for real sound
// design later; the playback wiring here does not need to change.
const CAPTURE_CHIME = require('../../assets/audio/capture_chime.wav');
const PROMPT_CHIME = require('../../assets/audio/prompt_chime.wav');
const AMBIENT_SHIMMER = require('../../assets/audio/ambient_shimmer.wav');

async function playOneShot(source: number): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync(source);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
    await sound.playAsync();
  } catch {
    // Audio is a nice-to-have — never block the capture/prompt flow on
    // playback failure (e.g. silent mode, missing asset in a bare test env).
  }
}

export function playCaptureChime(): Promise<void> {
  return playOneShot(CAPTURE_CHIME);
}

export function playPromptChime(): Promise<void> {
  return playOneShot(PROMPT_CHIME);
}

export interface AmbientLoopHandle {
  stop: () => Promise<void>;
}

export async function startAmbientShimmerLoop(): Promise<AmbientLoopHandle> {
  try {
    const { sound } = await Audio.Sound.createAsync(AMBIENT_SHIMMER, { isLooping: true, volume: 0.5 });
    await sound.playAsync();
    return {
      stop: async () => {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch {
          // already unloaded/stopped — fine.
        }
      },
    };
  } catch {
    return { stop: async () => {} };
  }
}
