import { StateCreator } from 'zustand';

export type AppScreen =
  | 'loading'
  | 'onboarding'
  | 'paywall'
  | 'welcome'
  | 'mainMenu'
  | 'analyze'
  | 'capture'
  | 'analyzing'
  | 'reveal'
  | 'results'
  | 'review'
  | 'settings';

// Transient, forward-only screens — never a sensible place for goBack() to
// land on (you never want to "go back" into the camera, a loading spinner,
// or a reading you already finished viewing).
const NON_RETURNABLE_SCREENS = new Set<AppScreen>(['loading', 'analyzing', 'reveal', 'capture']);

export interface NavigationSlice {
  screen: AppScreen;
  previousScreen: AppScreen | null;
  goToScreen: (screen: AppScreen) => void;
  // For "close/dismiss" actions (e.g. leaving Review or Paywall) that should
  // land back wherever the user actually came from — Settings, Analyze,
  // wherever — instead of a hardcoded destination. Falls back to mainMenu
  // when there is nowhere recorded to go back to, or when the recorded
  // screen is transient (see NON_RETURNABLE_SCREENS). This is a
  // single-level "back", not a full history stack.
  goBack: () => void;
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set, get) => ({
  screen: 'loading',
  previousScreen: null,
  goToScreen: (screen) => set({ screen, previousScreen: get().screen }),
  goBack: () => {
    const { previousScreen } = get();
    const target = previousScreen && !NON_RETURNABLE_SCREENS.has(previousScreen) ? previousScreen : 'mainMenu';
    set({ screen: target, previousScreen: null });
  },
});
