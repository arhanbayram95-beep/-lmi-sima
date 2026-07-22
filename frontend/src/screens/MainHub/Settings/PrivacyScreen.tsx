import { Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SubpageLayout } from './components/SubpageLayout';
import { Theme } from '../../../ui/theme';
import type { SettingsStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Privacy'>;

// Placeholder copy pending the legal review called for in PROJECT_SPEC.md §6.
export function PrivacyScreen({ navigation }: Props) {
  return (
    <SubpageLayout title="Privacy" onBack={() => navigation.goBack()}>
      <Text style={styles.body}>
        Your photos are processed in memory only, sent securely for analysis, and discarded immediately
        after your reading is generated. No image is ever stored on our servers or your device.
      </Text>
    </SubpageLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.bodyMd.fontSize,
    lineHeight: Theme.typography.bodyMd.lineHeight,
    color: Theme.colors.text.secondary,
  },
});
