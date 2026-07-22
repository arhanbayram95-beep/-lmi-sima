import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from './types';
import { SettingsScreen } from '../screens/MainHub/Settings/SettingsScreen';
import { PrivacyScreen } from '../screens/MainHub/Settings/PrivacyScreen';
import { TermsScreen } from '../screens/MainHub/Settings/TermsScreen';
import { DataDiscardScreen } from '../screens/MainHub/Settings/DataDiscardScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="DataDiscard" component={DataDiscardScreen} />
    </Stack.Navigator>
  );
}
