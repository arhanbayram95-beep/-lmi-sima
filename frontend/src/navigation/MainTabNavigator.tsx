import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { MainTabParamList, SettingsStackParamList } from './types';
import { FloatingTabBar } from '../components/navigation/FloatingTabBar';
import { AnalyzeScreen } from '../screens/MainHub/AnalyzeScreen';
import { ResultsScreen } from '../screens/MainHub/ResultsScreen';
import { SettingsStackNavigator } from './SettingsStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

function getSettingsTabBarVisibility(route: RouteProp<MainTabParamList, 'Settings'>) {
  const focusedRoute = getFocusedRouteNameFromRoute(route) as keyof SettingsStackParamList | undefined;
  return focusedRoute === undefined || focusedRoute === 'SettingsHome';
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen name="Analyze" component={AnalyzeScreen} options={{ title: 'Analyze' }} />
      <Tab.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={({ route }) => ({
          title: 'Settings',
          tabBarStyle: { display: getSettingsTabBarVisibility(route) ? 'flex' : 'none' },
        })}
      />
    </Tab.Navigator>
  );
}
