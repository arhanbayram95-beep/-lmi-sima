import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import SwipeablePager from './SwipeablePager';

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
});
