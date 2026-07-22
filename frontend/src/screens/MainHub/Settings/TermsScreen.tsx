import { Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SubpageLayout } from './components/SubpageLayout';
import { Theme } from '../../../ui/theme';
import type { SettingsStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Terms'>;

// Placeholder copy pending the legal review called for in PROJECT_SPEC.md §6.
export function TermsScreen({ navigation }: Props) {
  return (
    <SubpageLayout title="Terms" onBack={() => navigation.goBack()}>
      <Text style={styles.body}>
        FaceAI is provided strictly for entertainment purposes. It carries no scientific or clinical
        validity and should not be relied upon for any real-world decision-making.
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
