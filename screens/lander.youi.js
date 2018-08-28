import React, { Component } from 'react';
import {
  Composition,
  ViewRef,
} from '@youi/react-native-youi';

import { ListItem, Timeline } from '../components'
import Navigation from '../navigation.youi.js'
import { PDP } from '../screens'

export default class Lander extends Component {

  constructor(props) {
    super(props);
    this.state = {
      assets: [],
    };
  }

  requestPopularMoviesAsync = () => {
    return fetch("http://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192&language=en")
      .then(response => response.json())
      .then(responseJson => responseJson.results)
      .catch(error => console.error(error));
  }

  componentDidMount() {
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
          name={'Poster' + (i + 1)}
          image='Container-Image'
          onClick={() => {
            this.outTimeline.play()
              .then(() => Navigation.addScreen(<PDP id={this.state.assets[i].id} />));
          }}
        />
      ) : null;

    return (
      <Composition source="Lander_Main">

        <ViewRef name="Scroller">
          <Timeline name="In" onLoad={timeline => timeline.play()} />
          <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />
        </ViewRef>

        {movies}

      </Composition>
    );
  }
}
