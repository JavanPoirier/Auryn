/**
 * Auryn
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Image, DeviceInfo } from '@youi/react-native-youi';
import { Provider } from 'react-redux';
import store from './store';
import Stack from './navigation';

export default class YiReactApp extends Component {
  constructor() {
    super();
    const systemName = DeviceInfo.getSystemName();
    this.hasBackButton = !['iOS'].includes(systemName);
  }

  render = () =>
    <Provider store={store}>
      <View style={styles.container}>
        <Image
          style={styles.background}
          source={{ 'uri': 'res://drawable/default/Background-Gradient.png' }}
        />
        <Stack screenProps={{ hasBackButton: this.hasBackButton }}/>
      </View>
    </Provider>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: 1920,
    height: 1080,
    resizeMode: 'repeat',
    position: 'absolute',
  },
});

AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
