import { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SubpageLayout } from './components/SubpageLayout';
import { PrimaryButton } from '../../../components/common/PrimaryButton';
import { Theme } from '../../../ui/theme';
import { useCaptureStore } from '../../../store/useCaptureStore';
import type { SettingsStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<SettingsStackParamList, 'DataDiscard'>;

export function DataDiscardScreen({ navigation }: Props) {
  const clearAll = useCaptureStore((state) => state.clearAll);
  const [confirmed, setConfirmed] = useState(false);

  const handleDiscard = () => {
    clearAll();
    setConfirmed(true);
  };

  return (
    <SubpageLayout title="Data Discard" onBack={() => navigation.goBack()}>
      <Text style={styles.body}>
        Per our process-and-discard architecture, captured photos already live in memory only and are
        purged immediately after each reading. Use the button below to clear any in-memory capture data
        right now.
      </Text>
      <PrimaryButton label={confirmed ? 'Cleared' : 'Discard In-Memory Data'} onPress={handleDiscard} disabled={confirmed} />
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
