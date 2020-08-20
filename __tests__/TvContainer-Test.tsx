import React from 'react';
import { TvContainer } from '../src/components';
import { fromApi } from '../src/adapters/dummyAdapter';

import renderer from 'react-test-renderer';

const data = [fromApi(false), fromApi(false)];

test('renders correctly', () => {
  const tree = renderer.create(<TvContainer data={data} />).toJSON();
  expect(tree).toMatchSnapshot();
});
