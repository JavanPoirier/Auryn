/**
 * Auryn
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View } from '@youi/react-native-youi';
import { Lander, PDP, Player } from './screens';
import { createStackNavigator } from 'react-navigation';

const Stack = createStackNavigator(
  {
    Lander: {
      screen: Lander
    },
    PDP: {
      screen: PDP
    },
    Player: {
      screen: Player
    }
  },
  {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#000',
    },
    transitionConfig: () => ({
      transitionSpec: {},
      screenInterpolator: () => {
      }
    })
  }
);

export default class YiReactApp extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <Stack
          ref={ref => this.stackNavigation = ref}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  }
});

AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
