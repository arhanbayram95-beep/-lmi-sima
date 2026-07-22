export function createMockNavigation() {
  return {
    navigate: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  };
}

export function createMockRoute(name: string) {
  return { key: `${name}-key`, name, params: undefined };
}
