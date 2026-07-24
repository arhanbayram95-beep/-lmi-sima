import { fireEvent, render, screen } from '@testing-library/react-native';
import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import SwipeablePager from './SwipeablePager';

function ControlledPager({ children }: React.PropsWithChildren) {
  const [index, setIndex] = useState(0);
  return (
    <SwipeablePager index={index} onIndexChange={setIndex}>
      {children}
    </SwipeablePager>
  );
}

describe('SwipeablePager', () => {
  it('renders every page', () => {
    render(
      <SwipeablePager index={0} onIndexChange={jest.fn()}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );
    expect(screen.getByText('Page One')).toBeTruthy();
    expect(screen.getByText('Page Two')).toBeTruthy();
  });

  it('reports the nearest page continuously while scrolling, not just once the gesture settles', () => {
    const onIndexChange = jest.fn();
    render(
      <SwipeablePager index={0} onIndexChange={onIndexChange}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });

    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });
    // Midway through the drag it's still page 0 — should not report yet.
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.3 } } });
    expect(onIndexChange).not.toHaveBeenCalled();

    // Past the halfway point it rounds up to page 1.
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.6 } } });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('does not fight an in-progress drag with a programmatic reposition', () => {
    const onIndexChange = jest.fn();
    render(
      <SwipeablePager index={0} onIndexChange={onIndexChange}>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </SwipeablePager>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });
    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });

    fireEvent(scrollView, 'scrollBeginDrag');
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth } } });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('does not race a second programmatic scrollTo against the native paging snap after release', () => {
    const scrollToSpy = jest.spyOn(ScrollView.prototype, 'scrollTo').mockImplementation(() => {});

    render(
      <ControlledPager>
        <Text>Page One</Text>
        <Text>Page Two</Text>
      </ControlledPager>
    );

    const pageWidth = 400;
    fireEvent(screen.getByTestId('swipeable-pager'), 'layout', { nativeEvent: { layout: { width: pageWidth } } });
    const scrollView = screen.UNSAFE_getByProps({ horizontal: true });
    scrollToSpy.mockClear();

    // Cross the threshold mid-drag, then release — the settle grace period
    // should suppress any corrective scrollTo while the native snap
    // animation (real or assumed, since momentum events aren't guaranteed)
    // is still settling toward the same page.
    fireEvent(scrollView, 'scrollBeginDrag');
    fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { x: pageWidth * 0.6 } } });
    fireEvent(scrollView, 'scrollEndDrag');

    const racedCall = scrollToSpy.mock.calls.find(
      ([options]) => typeof options === 'object' && options?.x === pageWidth
    );
    expect(racedCall).toBeUndefined();

    scrollToSpy.mockRestore();
  });
});
