import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import CaptureScreen from '../screens/CaptureScreen';
import LoadingScreen from '../screens/LoadingScreen';
import MainMenuScreen from '../screens/MainMenuScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PaywallScreen from '../screens/PaywallScreen';
import ReviewScreen from '../screens/ReviewScreen';
import { AppScreen } from '../state/slices/navigationSlice';
import { useAppStore } from '../state/useAppStore';

const SCREENS: Record<AppScreen, React.ComponentType> = {
  loading: LoadingScreen,
  onboarding: OnboardingScreen,
  capture: CaptureScreen,
  review: ReviewScreen,
  paywall: PaywallScreen,
  mainMenu: MainMenuScreen,
};

export default function AppNavigator() {
  const screen = useAppStore((s) => s.screen);
  const ActiveScreen = SCREENS[screen];
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [screen, fade]);

  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      <ActiveScreen />
    </Animated.View>
  );
}
