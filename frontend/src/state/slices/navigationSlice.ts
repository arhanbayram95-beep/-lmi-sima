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
  goToScreen: (screen: AppScreen) => void;
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set) => ({
  screen: 'loading',
  goToScreen: (screen) => set({ screen }),
});
