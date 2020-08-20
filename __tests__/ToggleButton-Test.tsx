import React from 'react';
import { ToggleButton } from '../src/components';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<ToggleButton name="Button1" />).toJSON();
  expect(tree).toMatchSnapshot();
});
