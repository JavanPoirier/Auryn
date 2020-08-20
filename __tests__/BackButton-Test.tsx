import React from 'react';
import { BackButton } from '../src/components';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<BackButton />).toJSON();
  expect(tree).toMatchSnapshot();
});
