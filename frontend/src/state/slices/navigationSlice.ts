import { StateCreator } from 'zustand';

export type AppScreen =
  | 'loading'
  | 'onboarding'
  | 'paywall'
  | 'mainMenu'
  | 'analyze'
  | 'capture'
  | 'analyzing'
  | 'reveal'
  | 'results'
  | 'review'
  | 'settings';

export interface NavigationSlice {
  screen: AppScreen;
  previousScreen: AppScreen | null;
  goToScreen: (screen: AppScreen) => void;
  // For "close/dismiss" actions (e.g. leaving Review or Paywall) that should
  // land back wherever the user actually came from — Settings, Analyze,
  // wherever — instead of a hardcoded destination. Falls back to mainMenu
  // when there is nowhere recorded to go back to (e.g. straight after
  // onboarding). This is a single-level "back", not a full history stack:
  // screens that are always reached via a fixed forward flow (like Reveal)
  // should keep using goToScreen with an explicit destination.
  goBack: () => void;
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set, get) => ({
  screen: 'loading',
  previousScreen: null,
  goToScreen: (screen) => set({ screen, previousScreen: get().screen }),
  goBack: () => {
    const { previousScreen } = get();
    set({ screen: previousScreen ?? 'mainMenu', previousScreen: null });
  },
});
