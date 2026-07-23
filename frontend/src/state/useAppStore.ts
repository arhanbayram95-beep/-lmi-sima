import { create } from 'zustand';
import { CaptureSlice, createCaptureSlice } from './slices/captureSlice';
import { ConsentSlice, createConsentSlice } from './slices/consentSlice';
import { createDeviceSlice, DeviceSlice } from './slices/deviceSlice';
import { createEntitlementSlice, EntitlementSlice } from './slices/entitlementSlice';
import { createLocaleSlice, LocaleSlice } from './slices/localeSlice';
import { NavigationSlice, createNavigationSlice } from './slices/navigationSlice';
import { createResultSlice, ResultSlice } from './slices/resultSlice';

type AppStore = NavigationSlice &
  ConsentSlice &
  CaptureSlice &
  EntitlementSlice &
  LocaleSlice &
  DeviceSlice &
  ResultSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createNavigationSlice(...args),
  ...createConsentSlice(...args),
  ...createCaptureSlice(...args),
  ...createEntitlementSlice(...args),
  ...createLocaleSlice(...args),
  ...createDeviceSlice(...args),
  ...createResultSlice(...args),
}));
