import React, { Component } from 'react';

class Navigation {
  constructor() {

  }
  static stack = []

  static onScreenChanged = () => { }

  static addScreen(screen) {
    this.stack.push(screen)
    this.onScreenChanged(screen);
  }

  static popScreen() {
    this.stack.pop()
    this.onScreenChanged(this.getCurrentScreen())
    return this.getCurrentScreen()
  }

  static getCurrentScreen() {
    return this.stack[this.stack.length - 1]
  }
}

Navigation.stack = []

export default Navigation
