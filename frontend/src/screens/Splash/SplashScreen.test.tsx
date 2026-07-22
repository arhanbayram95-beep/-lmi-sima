import { act, render } from '@testing-library/react-native';
import { SplashScreen } from './SplashScreen';
import { useConsentStore } from '../../store/useConsentStore';
import { createMockNavigation, createMockRoute } from '../../test-utils/mockNavigation';

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: () => Promise.resolve(),
}));

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resets to Onboarding when onboarding has not been completed', async () => {
    useConsentStore.setState({ hasHydrated: true, hasCompletedOnboarding: false });
    const navigation = createMockNavigation();
    await render(<SplashScreen navigation={navigation as any} route={createMockRoute('Splash') as any} />);

    await act(async () => {
      jest.advanceTimersByTime(1600);
    });

    expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'Onboarding' }] });
  });

  it('resets to MainHub when onboarding was already completed', async () => {
    useConsentStore.setState({ hasHydrated: true, hasCompletedOnboarding: true });
    const navigation = createMockNavigation();
    await render(<SplashScreen navigation={navigation as any} route={createMockRoute('Splash') as any} />);

    await act(async () => {
      jest.advanceTimersByTime(1600);
    });

    expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'MainHub' }] });
  });
});
