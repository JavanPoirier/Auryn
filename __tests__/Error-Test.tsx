import React from 'react';
import { Error } from '../src/components';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Error message="This is an error" />).toJSON();
  expect(tree).toMatchSnapshot();
});
