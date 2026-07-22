import React from 'react';
import LoadingScreen from '../screens/LoadingScreen';
import MainMenuScreen from '../screens/MainMenuScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PaywallScreen from '../screens/PaywallScreen';
import ReviewScreen from '../screens/ReviewScreen';
import { useAppStore } from '../state/useAppStore';
import { AppScreen } from '../state/slices/navigationSlice';

const SCREENS: Record<AppScreen, React.ComponentType> = {
  loading: LoadingScreen,
  onboarding: OnboardingScreen,
  review: ReviewScreen,
  paywall: PaywallScreen,
  mainMenu: MainMenuScreen,
};

export default function AppNavigator() {
  const screen = useAppStore((s) => s.screen);
  const ActiveScreen = SCREENS[screen];
  return <ActiveScreen />;
}
