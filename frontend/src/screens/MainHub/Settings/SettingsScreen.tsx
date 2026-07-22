import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientBackground } from '../../../components/common/GradientBackground';
import { SettingsRow } from './components/SettingsRow';
import { Theme } from '../../../ui/theme';
import type { SettingsStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsHome'>;

export function SettingsScreen({ navigation }: Props) {
  return (
    <GradientBackground style={styles.fill}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.rows}>
          <SettingsRow icon="privacy-tip" label="Privacy" onPress={() => navigation.navigate('Privacy')} />
          <SettingsRow icon="description" label="Terms" onPress={() => navigation.navigate('Terms')} />
          <SettingsRow icon="delete-outline" label="Data Discard" onPress={() => navigation.navigate('DataDiscard')} />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Theme.spacing.sm,
    gap: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineLg.fontSize,
    color: Theme.colors.text.primary,
  },
  rows: {
    gap: Theme.spacing.xs,
  },
});
