import React from 'react';
import { Timeline } from '../src/components';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Timeline loop={false} name="In" />).toJSON();
  expect(tree).toMatchSnapshot();
});
