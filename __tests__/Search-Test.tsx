/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Search } from '../src/screens';
import { Provider } from 'react-redux';
import { navigationProp } from '../__mocks__/navigation';
import store from '../src/store';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Provider store={store}>
    <Search {...navigationProp} />
  </Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});
