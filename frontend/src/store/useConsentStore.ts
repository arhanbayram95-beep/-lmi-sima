import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ConsentState {
  ageAffirmed: boolean | null;
  consentAffirmed: boolean;
  hasCompletedOnboarding: boolean;
  hasHydrated: boolean;
  affirmAge: (isAdult: boolean) => void;
  setConsent: (value: boolean) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'consent-store';

type PersistedConsentState = Pick<
  ConsentState,
  'ageAffirmed' | 'consentAffirmed' | 'hasCompletedOnboarding'
>;

function persistState(state: ConsentState) {
  const { ageAffirmed, consentAffirmed, hasCompletedOnboarding } = state;
  const payload: PersistedConsentState = { ageAffirmed, consentAffirmed, hasCompletedOnboarding };
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
}

// Hand-rolled persistence rather than zustand/middleware's `persist` —
// that middleware's bundled file pulls in devtools-connector code using
// `import.meta.env`, which Metro's web target can't strip from a classic
// (non-module) script and fails to parse entirely.
export const useConsentStore = create<ConsentState>()((set, get) => ({
  ageAffirmed: null,
  consentAffirmed: false,
  hasCompletedOnboarding: false,
  hasHydrated: false,
  affirmAge: (isAdult) => {
    set({ ageAffirmed: isAdult });
    persistState(get());
  },
  setConsent: (value) => {
    set({ consentAffirmed: value });
    persistState(get());
  },
  completeOnboarding: () => {
    set({ hasCompletedOnboarding: true });
    persistState(get());
  },
  reset: () => {
    set({ ageAffirmed: null, consentAffirmed: false, hasCompletedOnboarding: false });
    persistState(get());
  },
}));

AsyncStorage.getItem(STORAGE_KEY)
  .then((raw) => {
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedConsentState;
      useConsentStore.setState(parsed);
    }
  })
  .catch(() => {})
  .finally(() => {
    useConsentStore.setState({ hasHydrated: true });
  });
