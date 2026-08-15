module.exports = {
  preset: 'jest-expo',
  // react-native-worklets ships this specifically to stop Jest resolving
  // its .native.ts files (which try to load an actual native module that
  // doesn't exist under Jest) for anything worklets-related — reanimated's
  // own mock.js still imports from its real index.ts, which pulls in
  // worklets' native initializer at the top level regardless, so this is
  // required even with the reanimated mock wired in below.
  resolver: 'react-native-worklets/jest/resolver.js',
  // useSafeAreaInsets() throws without a <SafeAreaProvider> ancestor, and
  // most screen tests render a screen standalone (no App.tsx root) — the
  // library's own mock falls back to a zero-inset default instead of
  // throwing, so tests don't need to wrap every render in a provider.
  moduleNameMapper: {
    '^react-native-safe-area-context$': '<rootDir>/test/mocks/react-native-safe-area-context.js',
    // Official mock (react-native-reanimated/mock.js) — the real module
    // loads a native worklets runtime at import time that doesn't exist
    // under Jest at all, not something transformIgnorePatterns can fix.
    '^react-native-reanimated$': '<rootDir>/node_modules/react-native-reanimated/mock.js',
  },
  // Official gesture-handler setup (mocks its native component registry).
  setupFiles: ['react-native-gesture-handler/jestSetup'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|zustand|react-native-purchases|@revenuecat/.*|react-native-reanimated|react-native-worklets|react-native-gesture-handler)',
  ],
  // Several screens run continuous Animated.loop calls that fall back to
  // real JS timers under Jest (no native driver in the test environment).
  // Under full-suite resource contention on a loaded dev machine this
  // reliably pushes different files past the 5000ms default one at a time
  // (seen in AnalyzingScreen, then SwipeablePager/OnboardingScreen) even
  // though every one of them passes cleanly in isolation — a slow-machine
  // default, not a per-file bug, so fixed globally instead of file by file.
  testTimeout: 20000,
};
