import Constants from 'expo-constants';
import * as Device from 'expo-device';
import React, { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavBar from '../components/common/BottomNavBar';
import FadeInView from '../components/common/FadeInView';
import GlassCard from '../components/common/GlassCard';
import LanguagePickerModal from '../components/common/LanguagePickerModal';
import PrivacyPolicyModal from '../components/common/PrivacyPolicyModal';
import TermsModal from '../components/common/TermsModal';
import { SUPPORTED_LANGUAGES } from '../state/slices/localeSlice';
import { useAppStore } from '../state/useAppStore';
import { Theme } from '../ui/theme';
import { buildContactMailUrl } from '../utils/contactMail';

interface SettingsRowConfig {
  label: string;
  value?: string;
  onPress?: () => void;
  testID?: string;
}

function SettingsRow({ label, value, onPress, testID, isLast }: SettingsRowConfig & { isLast: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" testID={testID} style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Text style={styles.chevron}>›</Text>
      </View>
      {!isLast && <View style={styles.divider} />}
    </Pressable>
  );
}

function SettingsSection({ title, rows, delay }: { title: string; rows: SettingsRowConfig[]; delay: number }) {
  return (
    <FadeInView delay={delay} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <GlassCard style={styles.sectionCard}>
        {rows.map((row, index) => (
          <SettingsRow key={row.label} {...row} isLast={index === rows.length - 1} />
        ))}
      </GlassCard>
    </FadeInView>
  );
}

function resolvePlatformLabel(): string {
  if (Platform.OS === 'ios') return 'iOS';
  if (Platform.OS === 'android') return 'Android';
  return 'Web';
}

function resolveOsVersionLabel(): string {
  if (!Device.osVersion) return 'Unknown';
  if (Platform.OS === 'ios') {
    return Device.osBuildId ? `Version ${Device.osVersion} (Build ${Device.osBuildId})` : `Version ${Device.osVersion}`;
  }
  if (Platform.OS === 'android') return `Android ${Device.osVersion}`;
  return Device.osVersion;
}

function resolveSignOff(): string {
  if (Platform.OS === 'ios') return 'Sent from my iPhone';
  if (Platform.OS === 'android') return 'Sent from my Android device';
  return 'Sent from FaceAI';
}

function resolveBuildNumber(): string | null {
  const extra = Constants.expoConfig;
  if (Platform.OS === 'ios') return extra?.ios?.buildNumber ?? null;
  if (Platform.OS === 'android' && extra?.android?.versionCode != null) {
    return String(extra.android.versionCode);
  }
  return null;
}

export default function SettingsScreen() {
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);
  const goToScreen = useAppStore((s) => s.goToScreen);
  const anonymousId = useAppStore((s) => s.anonymousId);
  const isProActive = useAppStore((s) => s.isProActive);
  const languageCode = useAppStore((s) => s.languageCode);

  const currentLanguageName =
    SUPPORTED_LANGUAGES.find((language) => language.code === languageCode)?.englishName ?? 'English';

  const handleContactUs = () => {
    const url = buildContactMailUrl({
      anonymousId,
      isProActive,
      languageCode,
      appVersion: Constants.expoConfig?.version ?? '1.0.0',
      buildNumber: resolveBuildNumber(),
      platformLabel: resolvePlatformLabel(),
      osVersionLabel: resolveOsVersionLabel(),
      signOff: resolveSignOff(),
    });
    Linking.openURL(url);
  };

  return (
    <View style={styles.container} testID="settings-screen">
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SettingsSection
          title="Subscription"
          delay={0}
          rows={[
            { label: 'Manage Subscription', onPress: () => goToScreen('paywall'), testID: 'settings-manage-subscription' },
            { label: 'Restore Purchases' },
          ]}
        />

        <SettingsSection
          title="General"
          delay={80}
          rows={[
            {
              label: 'Language',
              value: currentLanguageName,
              onPress: () => setLanguageVisible(true),
              testID: 'settings-language',
            },
            { label: 'Rate Us', onPress: () => goToScreen('review'), testID: 'settings-rate-us' },
            { label: 'Share App' },
          ]}
        />

        <SettingsSection
          title="Legal"
          delay={160}
          rows={[
            { label: 'Privacy Policy', onPress: () => setPrivacyVisible(true), testID: 'settings-privacy-policy' },
            { label: 'Terms & Conditions', onPress: () => setTermsVisible(true), testID: 'settings-terms' },
            { label: 'Contact Us', onPress: handleContactUs, testID: 'settings-contact-us' },
          ]}
        />
      </ScrollView>

      <BottomNavBar active="settings" />
      <PrivacyPolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} />
      <TermsModal visible={termsVisible} onClose={() => setTermsVisible(false)} />
      <LanguagePickerModal visible={languageVisible} onClose={() => setLanguageVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.middle,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.headlineLg,
    color: Theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.gutter,
    paddingBottom: 120,
    gap: Theme.spacing.md,
  },
  section: {
    gap: Theme.spacing.xs,
  },
  sectionTitle: {
    ...Theme.typography.labelSm,
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 14,
  },
  rowLabel: {
    ...Theme.typography.bodyMd,
    fontSize: 15,
    color: Theme.colors.text.primary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    ...Theme.typography.bodyMd,
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  chevron: {
    color: Theme.colors.text.muted,
    fontSize: 18,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: Theme.spacing.sm,
    right: Theme.spacing.sm,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.surface.glassBorder,
  },
});
