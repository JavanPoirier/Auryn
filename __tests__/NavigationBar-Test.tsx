import React from 'react';
import { NavigationBar, ToggleButton } from '../src/components';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer
    .create(
      <NavigationBar
        name="Nav-List"
        scrollEnabled={false}
        horizontal={true}
        focusable={true}
        onPressItem={jest.fn()}
        initialToggleIndex={0}
      >
        <ToggleButton />
        <ToggleButton />
        <ToggleButton />
      </NavigationBar>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
