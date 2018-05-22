import React, {Component} from 'react';
import {BackHandler} from 'react-native-youi'

export default class Navigation {

  static stack = [];

  static onScreenChanged = () => {}

  static addScreen(screen) {
    this
      .stack
      .push(screen);
    this.onScreenChanged(screen);
  }

  static isFirstScreen() {
    return this.stack.length == 1;
  }

  static popScreen() {
    this
      .stack
      .pop();
    this.onScreenChanged(this.getCurrentScreen());
    return this.getCurrentScreen();
  }

  static getCurrentScreen() {
    return this.stack[this.stack.length - 1];
  }
}
