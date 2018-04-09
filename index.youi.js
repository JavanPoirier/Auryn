/**
 * NAB Demo
 */

import React, { Component } from 'react';
import {
  AppRegistry,
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
    return this.state.screen;
  }
}

AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
