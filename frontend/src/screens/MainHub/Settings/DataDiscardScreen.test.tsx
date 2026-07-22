import { fireEvent, render, screen } from '@testing-library/react-native';
import { DataDiscardScreen } from './DataDiscardScreen';
import { useCaptureStore } from '../../../store/useCaptureStore';
import { createMockNavigation, createMockRoute } from '../../../test-utils/mockNavigation';

describe('DataDiscardScreen', () => {
  it('clears the capture store and shows a confirmed state', async () => {
    useCaptureStore.setState({ calmImageUri: 'file://calm.jpg' });
    await render(
      <DataDiscardScreen navigation={createMockNavigation() as any} route={createMockRoute('DataDiscard') as any} />
    );

    await fireEvent.press(screen.getByText('Discard In-Memory Data'));

    expect(useCaptureStore.getState().calmImageUri).toBeNull();
    expect(screen.getByText('Cleared')).toBeTruthy();
  });
});
