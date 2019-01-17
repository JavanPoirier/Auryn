import React, { Component } from 'react';
import { Composition, ViewRef, View, StyleSheet } from '@youi/react-native-youi';
import { Timeline } from '../components';
import { tmdb } from '../actions';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
    this.props.dispatch(tmdb.getDiscover());
    this.props.dispatch(tmdb.getMovies());
    this.props.dispatch(tmdb.getTv());
  }

  render() {
    const { fetched } = this.props;
    if (fetched) {
      const navigate = () => {
        const landerNavigationAction = NavigationActions.navigate({
          routeName: 'Lander',
        });
        this.props.navigation.dispatch(landerNavigationAction);
      };
      this.outTimeline ? this.outTimeline.play().then(navigate) : navigate();
    }

    return (
      <View style={styles.container}
      >
        <Composition source="Auryn_Splash">
          <Timeline
            name="SplashIn"
            onLoad={timeline => timeline.play()}
          />
          <Timeline
            name="SplashOut"
            ref={timeline => {
              if (!global.isRoku) this.outTimeline = timeline;
            }}
          />
          <ViewRef name="Loader">
            <Timeline name="Loop"
              onLoad={timeline => {
                if (!global.isRoku) timeline.play();
              }}
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

Splash.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  fetched: PropTypes.bool,
};
