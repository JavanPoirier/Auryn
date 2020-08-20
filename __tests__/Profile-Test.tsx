import React from 'react';
import { Profile } from '../src/screens';
import { navigationProp } from '../__mocks__/navigation';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Profile {...navigationProp} />).toJSON();
  expect(tree).toMatchSnapshot();
});
