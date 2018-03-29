/**
 * NAB Demo
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import {
  ButtonRef,
  Composition,
  ImageRef,
  ViewRef,
  TextRef,
  TimelineRef,
  Fragment,
  Video
} from 'react-native-youi';

import VideoPlayer from './video.youi.js'

export default class YiReactApp extends Component {

  constructor() {
    super();
    this.state = {
      details: {},
      selected: 0,
    };
  }

  componentDidMount() {
    this.requestPopularMoviesAsync((results) => {
      let id = results[1].id;

      this.requestMovieDetailsAsync(id, (asset) => {
        this.setState({
          selected: id,
          details: {
            ...this.state.details,
            [id]: asset,
          },
        });

        this.inTimeline.play();
      });
    });
  }

  requestPopularMoviesAsync = (callback) => {
    return fetch("https://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192")
      .then((response) => response.json())
      .then((responseJson) => {
        callback(responseJson.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  requestMovieDetailsAsync = (assetID, callback) => {
    return fetch("https://api.themoviedb.org/3/movie/" + assetID + "?api_key=7f5e61b6cef8643d2442344b45842192&append_to_response=releases,credits")
      .then((response) => response.json())
      .then((responseJson) => {
        callback(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    let metadata = this.state.details[this.state.selected] ? <Metadata asset={this.state.details[this.state.selected]} /> : null;
    if (true) {
      return <VideoPlayer />;
    }
    else
    return (
      <View
        style={styles.container}
      >
        <Composition
          source="PDP_Main"
        >
          <TimelineRef
            name="In"
            onLoad={(timeline) => {
              this.inTimeline = timeline;
            }}
          />

          <ButtonRef
            name="Btn-Previous"
            text="Back"
          />

          <ButtonRef
            name="Btn-Next"
            onClick={() => {
              console.log("clicked");
            }}
          />

          {/* {video} */}
          {metadata}
        </Composition>
      </View>
    );
  }
}

export function Metadata(props) {
  let rating = props.asset.releases.countries.filter((release) => release["iso_3166_1"] === "US")[0].certification;
  let director = props.asset.credits.crew.filter((member) => member["job"] === "Director")[0].name;
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
        text={props.asset.release_date.split("-")[0] + (rating ? " | Rated " + rating : "") + " | " + props.asset.runtime}
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
