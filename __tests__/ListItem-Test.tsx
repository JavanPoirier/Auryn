import React from 'react';
import { ListItem } from '../src/components';
import { fromApi } from '../src/adapters/dummyAdapter';

import renderer from 'react-test-renderer';

const asset = fromApi(false);

test('renders correctly', () => {
  const tree = renderer.create(<ListItem imageType={{ type: 'Backdrop', size: 'Large' }} data={asset} />).toJSON();
  expect(tree).toMatchSnapshot();
});
