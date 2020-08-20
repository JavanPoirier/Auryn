import React from 'react';
import { List } from '../src/components';
import { fromApi } from '../src/adapters/dummyAdapter';

import renderer from 'react-test-renderer';
import { ListType } from '../src/components/list';

const assets = Array.from(Array(10)).map(() => fromApi(false));

test('renders correctly', () => {
  const tree = renderer.create(<List name="Discover" type={ListType.Featured} data={assets} />).toJSON();
  expect(tree).toMatchSnapshot();
});
