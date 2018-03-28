/**
 * NAB Demo
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import {
  ButtonRef,
  Composition,
  ImageRef,
  TextRef,
  TimelineRef
} from 'react-native-youi';

export default class YiReactApp extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <Composition
          source="PDP_Main"
        >
        </Composition>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d0d0d0'
  },
});

AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
