import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ButtonRef,
  Composition,
  Fragment,
  ImageRef,
  ViewRef,
  TextRef,
} from 'react-native-youi';

import Timeline from './timeline.youi.js'
import Button from './button.youi.js'
import Navigation from './navigation.youi.js'
import PDP from './pdp.youi.js'

class Lander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
    };
  }

  componentWillUnmount() {
    console.log('unmounting lander')
  }

  requestPopularMoviesAsync = () => {
    return fetch("https://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192&language=en")
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.results;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.requestPopularMoviesAsync()
      .then((results) => {
        this.setState({
          assets: results
        });
      });
  }

  render() {
    return (
      <Composition source="Lander_Main">

        <ViewRef name="Scroller">
          <Timeline name="In" onLoad={(timeline) => timeline.play() } />
          <Timeline name="Out" ref={(timeline) => this.outTimeline = timeline} />
        </ViewRef>

        {this.state.assets.length > 0 && <LanderList assets={this.state.assets} itemSelected={this.props.itemSelected} />}
      </Composition>
    );
  }
}

export function LanderList(props) {
  return (
    Array(10).fill().map((_, i) =>
      <LanderListItem
        name={"Poster" + (i + 1)}
        key={props.assets[i].id}
        asset={props.assets[i]}
        itemSelected={props.itemSelected}
      />)
  );
}

export function LanderListItem(props) {
  this.props = props
  return (
    <ButtonRef
      name={props.name}
      onClick={() => {
        // this.props.itemSelected(props.asset.id)
        Navigation.addScreen(<PDP id={props.asset.id}/>)
      }
    }
    >
      <ImageRef name="Container-Image" source={{ uri: "https://image.tmdb.org/t/p/w500" + props.asset.poster_path }} />
    </ButtonRef>
  );
}

export default Lander
