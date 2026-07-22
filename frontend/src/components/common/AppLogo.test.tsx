import { render, screen } from '@testing-library/react-native';
import { AppLogo } from './AppLogo';

describe('AppLogo', () => {
  it('renders the wordmark when variant is full', async () => {
    await render(<AppLogo variant="full" />);
    expect(screen.getByText('FaceAI')).toBeTruthy();
  });

  it('omits the wordmark when variant is icon', async () => {
    await render(<AppLogo variant="icon" />);
    expect(screen.queryByText('FaceAI')).toBeNull();
  });
});
