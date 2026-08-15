import { StateCreator } from 'zustand';

export interface PreferencesSlice {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

// In-memory only, same as languageCode (localeSlice) — no AsyncStorage
// dependency in PROJECT_SPEC.md yet, so this resets on app restart like
// every other preference here does today.
export const createPreferencesSlice: StateCreator<PreferencesSlice> = (set) => ({
  soundEnabled: true,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
});
