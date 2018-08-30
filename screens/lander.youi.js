import React, { Component } from 'react';
import { Composition, ViewRef, FocusManager } from '@youi/react-native-youi';
import { ListItem, Timeline } from '../components'
import { NavigationActions } from 'react-navigation';

export default class Lander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      focusable: true,
    };
  }

  requestPopularMoviesAsync = () => {
    return fetch("http://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192&language=en")
      .then(response => response.json())
      .then(responseJson => responseJson.results)
      .catch(error => console.error(error));
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.setState({focusable: true});
      this.inTimeline.play();
    })
    this.props.navigation.addListener('didBlur', () => {
      this.setState({focusable: false})
    })
    this.requestPopularMoviesAsync()
      .then(results => {
        this.setState({
          assets: results,
        });
      });
  }

  render() {
    let movies = this.state.assets.length > 0 ?
      Array(10).fill().map((_, i) =>
        <ListItem
          key={this.state.assets[i].id}
          asset={this.state.assets[i]}
          onLoad={ref => { if (i == 0) FocusManager.focus(ref)}}
          name={'Poster' + (i + 1)}
          focusable={this.state.focusable}
          image='Container-Image'
          onClick={() => {
            this.outTimeline.play()
              .then(() => {
                let navigateAction = NavigationActions.navigate({
                  routeName: 'PDP',
                  params: { id: this.state.assets[i].id },
                  key: this.state.assets[i].id
                })
                this.props.navigation.dispatch(navigateAction)
              });
          }}
        />
      ) : null;

    return (
      <Composition source="Lander_Main">

        <ViewRef name="Scroller">
          <Timeline name="In"
            ref={timeline => this.inTimeline = timeline}
            onLoad={timeline => timeline.play()}
          />
          <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />
        </ViewRef>

        {movies}

      </Composition>
    );
  }
}
