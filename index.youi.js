/**
 * NAB Demo
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ButtonRef,
  Composition,
  Fragment,
  ImageRef,
  TextRef,
  ViewRef,
} from 'react-native-youi';

import PDP from './pdp.youi.js'
import Lander from './lander.youi.js'
import Navigation from './navigation.youi.js'

export default class YiReactApp extends Component {

  constructor() {
    super();
    this.state = {
      screen: null
    }
    this.model = []

    Navigation.onScreenChanged = screen =>
      this.setState({ screen: screen }
      )
  }

  componentDidMount() {
    Navigation.addScreen(<Lander />)
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.screen}
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
