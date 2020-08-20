import React from 'react';
import { DiscoverContainer } from '../src/components';
import { fromApi } from '../src/adapters/dummyAdapter';

import renderer from 'react-test-renderer';

const data = [fromApi(false), fromApi(false), fromApi(false)];

test('renders correctly', () => {
  const tree = renderer.create(<DiscoverContainer data={data} index={0} />).toJSON();
  expect(tree).toMatchSnapshot();
});
