import React, { Component } from 'react';
import { Composition, ViewRef } from '@youi/react-native-youi';
import { Timeline } from '../components';
import { tmdbDiscover } from '../actions/tmdbActions'
import { NavigationActions } from 'react-navigation';
import { connect } from "react-redux";

@connect((store) => {
  return {
    fetched: store.tmdbReducer.discover.fetched
  }
})
export default class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(tmdbDiscover());
  }

  render() {
    const { fetched } = this.props
    if (fetched) {
      this.outTimeline.play().then(() => {
        console.log('SPLASH', 'Navigating to lander');
        const landerNavigationAction = NavigationActions.navigate({
          routeName: 'Lander',
        })
        this.props.navigation.dispatch(landerNavigationAction);
      })
    }

    return (
      <Composition source="Auryn_Splash">
        <Timeline
          name="SplashIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
        <Timeline
          name="SplashOut"
          ref={timeline => this.outTimeline = timeline}
        />
        <ViewRef name="Loader">
          <Timeline name="Loop"
            onLoad={timeline => timeline.play()}
          />
        </ViewRef>
      </Composition>
    );
  }
}
