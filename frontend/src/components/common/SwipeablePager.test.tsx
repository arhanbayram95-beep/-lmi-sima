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

  it('reports the landed-on page index after a swipe settles', () => {
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
    fireEvent(scrollView, 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: pageWidth }, contentSize: {}, layoutMeasurement: {} },
    });

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});
