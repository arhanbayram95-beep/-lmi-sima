import { View, Pressable, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Theme } from '../../ui/theme';
import { TabBarIcon } from './TabBarIcon';
import type { MainTabParamList } from '../../navigation/types';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const isHidden = (focusedOptions.tabBarStyle as { display?: string } | undefined)?.display === 'none';

  if (isHidden) {
    return null;
  }

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <BlurView intensity={50} tint="dark" style={styles.pill}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const routeName = route.name as keyof MainTabParamList;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.tabActive]}
            >
              <TabBarIcon
                route={routeName}
                color={isFocused ? Theme.colors.background.start : Theme.colors.text.secondary}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {options.title ?? route.name}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.surface.glassBorder,
    paddingVertical: 8,
    paddingHorizontal: 12,
    overflow: 'hidden',
    shadowColor: Theme.colors.accent.crimsonPrimary,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: Theme.radius.full,
    gap: 2,
  },
  tabActive: {
    backgroundColor: Theme.colors.accent.goldSecondary,
  },
  label: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: Theme.typography.labelSm.fontSize,
    color: Theme.colors.text.secondary,
  },
  labelActive: {
    color: Theme.colors.background.start,
  },
});
