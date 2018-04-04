/**
 * NAB Demo
 */

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
  TextRef,
  ViewRef,
} from 'react-native-youi';

import VideoPlayer from './video.youi.js'
import Timeline from './timeline.youi.js'
import Button from './button.youi.js'

export default class YiReactApp extends Component {

  constructor() {
    super();
    this.state = {
      details: {},
      selected: 0,
      playerScreen: true,
      animating: false
    };
    this.model = []
  }

  componentDidMount() {

    this.requestPopularMoviesAsync()
      .then((results) => {
        this.model = results
        this.setState({ selected: 0 })
      })
      .then(this.requestMovieDetailsAsync)
      .then((asset) => { this.setState({ details: asset }) })
      .then(this.inTimeline.play);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.selected != this.state.selected) {
      Promise.all([this.outTimeline.play(), this.requestMovieDetailsAsync()])
        .then(values => {
          this.setState({ details: values[1] })
        })
        .then(this.inTimeline.play);
    }
  }

  requestPopularMoviesAsync = (callback) => {
    return fetch("https://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192")
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.results;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  requestMovieDetailsAsync = (callback) => {
    return fetch("https://api.themoviedb.org/3/movie/" + this.model[this.state.selected].id + "?api_key=7f5e61b6cef8643d2442344b45842192&append_to_response=releases,credits")
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ position: 'absolute' }}>
          <Composition source="PDP_Main">

            <Timeline name="Out" ref={(timeline) => this.outTimeline = timeline} />
            <Timeline name="In" ref={(timeline) => this.inTimeline = timeline} />

            <Button
              name="Btn-Previous"
              onClick={() => {
                let prevIndex = this.state.selected - 1
                if (prevIndex < 0)
                  prevIndex = this.model.length - 1

                this.setState({
                  selected: prevIndex
                })
              }}
            />

            <Button
              name="Btn-Next"
              onClick={() => {
                let nextIndex = this.state.selected + 1
                if (nextIndex >= this.model.length)
                  nextIndex = 0

                this.setState({ selected: nextIndex })
              }}
            />

            <ButtonRef
              name="Btn-Play"
              onClick={() => {
                this.outTimeline.play().then(() => {
                  this.setState({ playerScreen: true })
                })
              }}
            />

            <Metadata asset={this.state.details} />
          </Composition>
        </View>
        {this.state.playerScreen &&
          <VideoPlayer
            style={{ background: 'black', position: 'absolute', top: 0, left: 0 }}
            onBack={() => {
              this.inTimeline.play()
              this.setState({ playerScreen: false })
            }
            } />}
      </View>
    );
  }
}

export class Lander extends Component {
  constructor() {
    super();
    this.state = {
      assets: [],
    };
  }

  requestPopularMoviesAsync = () => {
    return fetch("https://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192")
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

        {this.state.assets.length > 0 && <LanderList assets={this.state.assets} />}
      </Composition>
    );
  }
}

export function LanderList(props) {
  return (
    Array(10).fill().map((_, i) =>
      <LanderListItem
        name={"Poster" + (i + 1)}
        asset={props.assets[i]}
        itemSelected={props.itemSelected}
      />)
  );
}

export function LanderListItem(props) {
  return (
    <ButtonRef
      name={props.name}
      onClick={() => this.props.itemSelected(props.asset.id)}
    >
      <ImageRef name="Container-Image" source={{ uri: "https://image.tmdb.org/t/p/w500" + props.asset.poster_path }} />
    </ButtonRef>
  );
}

export function Metadata(props) {
  if (!props.asset.id)
    return null

  let releaseDate = props.asset.release_date.split("-")[0];
  let rating = props.asset.releases.countries.find((release) => release["iso_3166_1"] === "US");
  rating = rating && rating.certification ? "Rated " + rating.certification : null;
  let runtime = props.asset.runtime ? props.asset.runtime + " mins" : null;
  let details = [releaseDate, rating, runtime].filter((item) => item !== null).join(" | ");

  let director = props.asset.credits.crew.find((member) => member["job"] === "Director");
  director = director ? director.name : "";
  let stars = props.asset.credits.cast.slice(0, 3).map((member) => member["name"]).join(", ");

  let posterSource = "https://image.tmdb.org/t/p/w500" + props.asset.poster_path;
  let backdropSource = "https://image.tmdb.org/t/p/w1280" + props.asset.backdrop_path;

  return (
    <Fragment>
      <TextRef
        name="Title-Text"
        text={props.asset.title}
      />
      <TextRef
        name="Details-Text"
        text={details}
      />
      <TextRef
        name="Director"
        text={director}
      />
      <TextRef
        name="Stars"
        text={stars}
      />
      <TextRef
        name="Body-Text"
        text={props.asset.overview}
      />
      <ImageRef
        name="Image-2x3"
        source={{ uri: posterSource }}
      />
      <ImageRef
        name="Image-16x9"
        source={{ uri: posterSource }}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d0d0d0'
  },
});


AppRegistry.registerComponent('YiReactApp', () => YiReactApp);
