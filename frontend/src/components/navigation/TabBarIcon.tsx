import { MaterialIcons } from '@expo/vector-icons';
import type { MainTabParamList } from '../../navigation/types';

const ROUTE_ICON_MAP: Record<keyof MainTabParamList, keyof typeof MaterialIcons.glyphMap> = {
  Analyze: 'face',
  Results: 'assessment',
  Settings: 'settings',
};

export type TabBarIconProps = {
  route: keyof MainTabParamList;
  color: string;
  size?: number;
};

export function TabBarIcon({ route, color, size = 22 }: TabBarIconProps) {
  return <MaterialIcons name={ROUTE_ICON_MAP[route]} size={size} color={color} />;
}
