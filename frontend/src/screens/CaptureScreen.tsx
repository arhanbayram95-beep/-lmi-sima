import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/common/PrimaryButton';
import { useTranslation } from '../i18n/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { ExpressionLabel } from '../state/slices/captureSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';

const STEPS: { expression: ExpressionLabel; titleKey: TranslationKey; promptKey: TranslationKey }[] = [
  { expression: 'calm', titleKey: 'capture.step.calm.title', promptKey: 'capture.step.calm.prompt' },
  { expression: 'bright', titleKey: 'capture.step.bright.title', promptKey: 'capture.step.bright.prompt' },
  { expression: 'deep', titleKey: 'capture.step.deep.title', promptKey: 'capture.step.deep.prompt' },
];

export default function CaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [stepIndex, setStepIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const flash = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const setImage = useAppStore((s) => s.setImage);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const t = useTranslation();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const handleCapture = async () => {
    if (isCapturing || !cameraRef.current) return;
    setIsCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.6 });
      if (photo?.base64) {
        setImage(STEPS[stepIndex].expression, photo.base64);
      }
    } finally {
      setIsCapturing(false);
      if (stepIndex < STEPS.length - 1) {
        setStepIndex(stepIndex + 1);
      } else {
        goToScreen('mainMenu');
      }
    }
  };

  if (!permission) {
    return <View style={styles.container} testID="capture-screen" />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]} testID="capture-screen">
        <Text style={styles.headline}>{t('capture.permission.headline')}</Text>
        <Text style={styles.body}>{t('capture.permission.body')}</Text>
        <PrimaryButton label={t('capture.permission.button')} onPress={requestPermission} />
      </View>
    );
  }

  const currentStep = STEPS[stepIndex];
  const currentTitle = t(currentStep.titleKey);

  return (
    <View style={styles.container} testID="capture-screen">
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" />

      <Animated.View pointerEvents="none" style={[styles.flashOverlay, { opacity: flash }]} />

      <View style={styles.overlay}>
        <View style={styles.dots}>
          {STEPS.map((step, index) => (
            <View
              key={step.expression}
              style={[styles.dot, index === stepIndex && styles.dotActive, index < stepIndex && styles.dotDone]}
            />
          ))}
        </View>

        <View style={styles.guideWrap}>
          <Animated.View style={[styles.guideRing, { transform: [{ scale: pulse }] }]} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.stepTitle}>{currentTitle}</Text>
          <Text style={styles.stepPrompt}>{t(currentStep.promptKey)}</Text>

          <Pressable
            onPress={handleCapture}
            disabled={isCapturing}
            accessibilityRole="button"
            accessibilityLabel={`Capture ${currentTitle} expression`}
            testID="shutter-button"
            style={styles.shutterOuter}
          >
            <View style={styles.shutterInner} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.start,
  },
  permissionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  headline: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.accent.goldSecondary,
    textAlign: 'center',
  },
  body: {
    ...Theme.typography.bodyMd,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(26, 5, 11, 0.15)',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingTop: Theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(255, 223, 158, 0.3)',
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: Theme.colors.accent.crimsonPrimary,
  },
  dotDone: {
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  guideWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideRing: {
    width: 240,
    height: 300,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: Theme.colors.accent.goldSecondary,
    shadowColor: Theme.colors.accent.goldSecondary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  footer: {
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.containerPadding,
  },
  stepTitle: {
    ...Theme.typography.headlineMd,
    color: Theme.colors.text.primary,
  },
  stepPrompt: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.sm,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: Theme.radius.full,
    borderWidth: 3,
    borderColor: Theme.colors.accent.goldSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
});
