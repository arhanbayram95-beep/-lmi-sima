import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { analyzeReading, ReadingApiError } from '../api/reading';
import AppLogo from '../components/common/AppLogo';
import PrimaryButton from '../components/common/PrimaryButton';
import { MODULE_PHOTO_COUNTS } from '../api/types';
import { useTranslation } from '../i18n/useTranslation';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';
import { AmbientLoopHandle, startAmbientShimmerLoop } from '../utils/sound';

export default function AnalyzingScreen() {
  const [error, setError] = useState<string | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const spin = useRef(new Animated.Value(0)).current;

  const images = useAppStore((s) => s.images);
  const selectedModule = useAppStore((s) => s.selectedModule);
  const setReading = useAppStore((s) => s.setReading);
  const logReading = useAppStore((s) => s.logReading);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const clearImages = useAppStore((s) => s.clearImages);
  const t = useTranslation();

  // Only the success path below hands the photos on to RevealScreen (which
  // purges them itself on unmount). Every path that leaves this screen
  // without a reading has to purge them here instead — otherwise they sit in
  // the store for the rest of the session (against process-and-discard,
  // PROJECT_SPEC.md §3) and the next capture session's addImage() calls
  // append onto them, overshooting MODULE_PHOTO_COUNTS and failing the
  // count check above with a misleading "couldn't complete your reading."
  const abandonReading = useCallback(
    (destination: 'analyze' | 'noFaceDetected') => {
      clearImages();
      goToScreen(destination);
    },
    [clearImages, goToScreen]
  );

  // Pulse/spin are native-driver Animated.loop()s left running indefinitely
  // from mount — on-device testing found that after several retries the
  // spinner could visually stop advancing (the loop's internal state
  // getting wedged after enough start/stop churn from repeated retries,
  // not something traceable to a single root line). Rather than chase the
  // exact native-driver mechanism, every retry now explicitly stops
  // whatever loop is currently running, resets both values to their base
  // state, and starts a fresh loop — guaranteeing the spinner can never be
  // stuck showing a dead animation, regardless of what state the previous
  // one was actually in.
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const spinLoop = useRef<Animated.CompositeAnimation | null>(null);

  const restartLoadingAnimations = useCallback(() => {
    pulseLoop.current?.stop();
    spinLoop.current?.stop();
    pulse.setValue(1);
    spin.setValue(0);

    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();

    spinLoop.current = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    );
    spinLoop.current.start();
  }, [pulse, spin]);

  // A rapid double-tap on "Try Again" (or the effect below racing a manual
  // retry) could otherwise fire two overlapping analyzeReading() calls;
  // whichever resolved last would win regardless of which was actually
  // most recent, sometimes leaving the screen showing a stale error while
  // a later success had already fired — indistinguishable on-screen from
  // "stuck loading" since the spinner branch and error branch could
  // flicker between each other. This guard makes a retry while one is
  // already in flight a no-op.
  const inFlightRef = useRef(false);

  const runAnalysis = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setError(null);
    restartLoadingAnimations();

    if (images.length !== MODULE_PHOTO_COUNTS[selectedModule]) {
      setError(t('analyzing.error.body'));
      inFlightRef.current = false;
      return;
    }

    try {
      const result = await analyzeReading({ photos: images, module: selectedModule });
      setReading(result);
      logReading(result);
      // Images stay in the store past this point — RevealScreen shows them
      // alongside the reading and purges them itself once the user leaves.
      goToScreen('reveal');
    } catch (cause) {
      if (cause instanceof ReadingApiError && cause.code === 'NO_FACE_DETECTED') {
        abandonReading('noFaceDetected');
        return;
      }
      setError(cause instanceof ReadingApiError ? cause.message : t('analyzing.error.body'));
    } finally {
      inFlightRef.current = false;
    }
  }, [images, selectedModule, setReading, logReading, goToScreen, abandonReading, t, restartLoadingAnimations]);

  useEffect(() => {
    runAnalysis();
    // Only re-run when explicitly retried — capturing `images` at mount time
    // is intentional, this effect is not meant to react to later changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let handle: AmbientLoopHandle | null = null;
    let cancelled = false;

    startAmbientShimmerLoop().then((h) => {
      if (cancelled) {
        h.stop();
      } else {
        handle = h;
      }
    });

    return () => {
      cancelled = true;
      handle?.stop();
    };
  }, []);

  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]} testID="analyzing-screen">
        <Text style={styles.errorTitle}>{t('analyzing.error.title')}</Text>
        <Text style={styles.errorBody}>{error}</Text>
        <PrimaryButton label={t('analyzing.error.retry')} onPress={runAnalysis} testID="analyzing-retry-button" />
        <PrimaryButton
          label={t('analyzing.error.backHome')}
          variant="secondary"
          onPress={() => abandonReading('analyze')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="analyzing-screen">
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <AppLogo size="lg" />
      </Animated.View>
      <Text style={styles.headline}>{t('analyzing.headline')}</Text>
      <Text style={styles.subtitle}>{t('analyzing.subtitle')}</Text>
      <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spinDeg }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.containerPadding,
    gap: Theme.spacing.sm,
  },
  errorContainer: {
    gap: Theme.spacing.sm,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  subtitle: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  spinnerRing: {
    width: 44,
    height: 44,
    borderRadius: Theme.radius.full,
    borderWidth: 2,
    borderColor: 'rgba(158, 41, 65, 0.3)',
    borderTopColor: Theme.colors.accent.goldSecondary,
    marginTop: Theme.spacing.md,
  },
  errorTitle: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  errorBody: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
});
