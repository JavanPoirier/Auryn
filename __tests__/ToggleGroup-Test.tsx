import React from 'react';
import { ToggleGroup, ToggleButton } from '../src/components';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer
    .create(
      <ToggleGroup onPressItem={jest.fn()} initialToggleIndex={0}>
        <ToggleButton />
        <ToggleButton />
        <ToggleButton />
      </ToggleGroup>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
