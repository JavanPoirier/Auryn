import React, { Component } from 'react';
import { Composition, ViewRef, View, StyleSheet } from '@youi/react-native-youi';
import { Timeline } from '../components';
import { tmdbDiscover, tmdbMovies, tmdbTv } from '../actions/tmdbActions';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

@connect(store => ({
  fetched:
    store.tmdbReducer.discover.fetched
    && store.tmdbReducer.movies.fetched
    && store.tmdbReducer.tv.fetched,
}))
class Splash extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(tmdbDiscover());
    this.props.dispatch(tmdbMovies());
    this.props.dispatch(tmdbTv());
  }

  render() {
    const { fetched } = this.props;
    if (fetched) {
      this.outTimeline.play().then(() => {
        console.log('SPLASH', 'Navigating to lander');
        const landerNavigationAction = NavigationActions.navigate({
          routeName: 'Lander',
        });
        this.props.navigation.dispatch(landerNavigationAction);
      });
    }

    return (
      <View style={styles.container}
      >
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143672',
  },
});
export default Splash;
