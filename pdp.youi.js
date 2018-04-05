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
} from 'react-native-youi';

import VideoPlayer from './video.youi.js'
import Timeline from './timeline.youi.js'
import Button from './button.youi.js'
import ListItem from './listitem.youi.js';
import Navigation from './navigation.youi.js'

class PDP extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      animating: false
    };
    this.model = []
    console.log('creating pdp')
  }

  componentDidMount() {
    this.requestMovieDetailsAsync()
      .then((asset) => { this.setState({ details: asset }) })
      .then(this.inTimeline.play);
  }

  requestMovieDetailsAsync = (callback) => {
    return fetch("https://api.themoviedb.org/3/movie/" + this.props.id + "?api_key=7f5e61b6cef8643d2442344b45842192&append_to_response=releases,credits,recommendations&language=en")
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    let recommendations = this.state.details ?
      Array(4).fill().map((_, x) =>
        <ListItem
          key={this.state.details.recommendations.results[x].id}
          name={'Poster' + (x + 1)}
          image='Image-2x3'
          asset={this.state.details.recommendations.results[x]}
          onClick={() => {
            this.outTimeline.play().then(() => {
              Navigation.addScreen(<PDP key={this.state.details.recommendations.results[x].id} id={this.state.details.recommendations.results[x].id} />)
            })
          }}
        />)
      : null
    return (
      <View style={styles.container}>
        <View style={{ position: 'absolute' }}>
          <Composition source="PDP_Main">

            <Timeline name="Out" ref={(timeline) => this.outTimeline = timeline} />
            <Timeline name="In" ref={(timeline) => this.inTimeline = timeline} />

            <ButtonRef
              name="Btn-Play"
              onClick={() => {
                this.outTimeline.play().then(() => {
                  Navigation.addScreen(<VideoPlayer
                    style={{ background: 'black', position: 'absolute', top: 0, left: 0 }}
                    onBack={() => {
                      this.inTimeline.play()
                    }
                    } />)
                })
              }}
            />

            <Button
              name='Btn-Back'
              onClick={() => {
                this.outTimeline.play().then(() => { Navigation.popScreen() })
              }} />

            <Metadata asset={this.state.details} />

            {recommendations}
          </Composition>
        </View>
      </View>
    );
  }
}

export function Metadata(props) {
  if (!props.asset)
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
        source={{ uri: backdropSource }}
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

export default PDP
