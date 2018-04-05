/**
 * NAB Demo
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
} from 'react-native';

import Lander from './lander.youi.js'
import Navigation from './navigation.youi.js'

export default class YiReactApp extends Component {

  constructor() {
    super();
    this.state = {
      screen: null
    }

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
  },
});


AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
