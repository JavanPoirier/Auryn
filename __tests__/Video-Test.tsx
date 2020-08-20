import React from 'react';
import { Video } from '../src/screens';
import { Provider } from 'react-redux';
import { navigationProp } from '../__mocks__/navigation';
import store from '../src/store';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Video {...navigationProp} />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
