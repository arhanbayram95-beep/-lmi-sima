import { create } from 'zustand';
import { CaptureSlice, createCaptureSlice } from './slices/captureSlice';
import { ConsentSlice, createConsentSlice } from './slices/consentSlice';
import { createEntitlementSlice, EntitlementSlice } from './slices/entitlementSlice';
import { NavigationSlice, createNavigationSlice } from './slices/navigationSlice';

type AppStore = NavigationSlice & ConsentSlice & CaptureSlice & EntitlementSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createNavigationSlice(...args),
  ...createConsentSlice(...args),
  ...createCaptureSlice(...args),
  ...createEntitlementSlice(...args),
}));
