import { render, screen } from '@testing-library/react-native';
import { FloatingTabBar } from './FloatingTabBar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function buildProps(overrides?: Partial<BottomTabBarProps>): BottomTabBarProps {
  const routes = [
    { key: 'Analyze-key', name: 'Analyze' },
    { key: 'Results-key', name: 'Results' },
    { key: 'Settings-key', name: 'Settings' },
  ];
  return {
    state: { index: 0, routes } as any,
    descriptors: {
      'Analyze-key': { options: { title: 'Analyze' } },
      'Results-key': { options: { title: 'Results' } },
      'Settings-key': { options: { title: 'Settings' } },
    } as any,
    navigation: { emit: jest.fn(() => ({ defaultPrevented: false })), navigate: jest.fn() } as any,
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
    ...overrides,
  };
}

describe('FloatingTabBar', () => {
  it('renders a label for every route', async () => {
    await render(<FloatingTabBar {...buildProps()} />);
    expect(screen.getByText('Analyze')).toBeTruthy();
    expect(screen.getByText('Results')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('renders nothing when the focused route sets tabBarStyle display to none', async () => {
    const props = buildProps();
    props.descriptors['Analyze-key'].options.tabBarStyle = { display: 'none' };
    const { toJSON } = await render(<FloatingTabBar {...props} />);
    expect(toJSON()).toBeNull();
  });
});
