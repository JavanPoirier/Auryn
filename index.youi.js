/**
 * NAB Demo
 */

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';

import Lander from './lander.youi.js';
import Navigation from './navigation.youi.js';
import {BackHandler} from 'react-native-youi';

export default class YiReactApp extends Component {

  constructor() {
    super();
    this.state = {
      screen: null
    }

    BackHandler.addEventListener("onBackButtonPressed", () => {
      if (!Navigation.isFirstScreen())
        Navigation.popScreen();
      }
    );

    Navigation.onScreenChanged = screen => this.setState({screen: screen})
  }

  componentDidMount() {
    Navigation.addScreen(<Lander/>)
  }

  render() {
    return this.state.screen;
  }
}

AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
