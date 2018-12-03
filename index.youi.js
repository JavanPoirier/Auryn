/**
 * Auryn
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View } from '@youi/react-native-youi';
import { Provider } from 'react-redux';
import store from './store';
import Stack from './navigation';

export default class YiReactApp extends Component {
  constructor() {
    super();
  }

  render = () =>
    <Provider store={store}>
      <View style={styles.container}>
        <Stack />
      </View>
    </Provider>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143672',
  },
});

AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
