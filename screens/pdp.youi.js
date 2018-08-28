import React, { Component, Fragment } from 'react';
import {
  ButtonRef,
  Composition,
  ImageRef,
  TextRef,
} from '@youi/react-native-youi';

import Youtube from 'youtube-stream-url'
import { ListItem, Timeline, Button } from '../components'
import { NavigationActions } from 'react-navigation';

export default class PDP extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => this.inTimeline.play())
    this.requestMovieDetailsAsync()
      .then(asset => {
        this.setState({
          details: asset,
        });

        if (asset.videos.results.length > 0) {
          Youtube.getInfo({ url: 'http://www.youtube.com/watch?v=' + asset.videos.results[0].key })
            .then(video => this.video = video);
        }
      })
      .then(this.inTimeline.play);
  }

  requestMovieDetailsAsync = () => {
    return fetch("http://api.themoviedb.org/3/movie/" + this.props.navigation.getParam('id') + "?api_key=7f5e61b6cef8643d2442344b45842192&append_to_response=releases,credits,recommendations,videos&language=en")
      .then(response => response.json())
      .catch(error => console.error(error));
  }

  render() {
    let recommendations = this.state.details ?
      Array(4).fill().map((_, i) =>
        this.state.details.recommendations.results.length > i ?
          <ListItem
            key={this.state.details.recommendations.results[i].id}
            name={'Poster' + (i + 1)}
            image='Image-2x3'
            asset={this.state.details.recommendations.results[i]}
            onClick={() => {
              this.outTimeline.play().then(() => {
                let navigateAction = NavigationActions.navigate({
                  routeName: 'PDP',
                  params: { id: this.state.details.recommendations.results[i].id},
                  key: this.state.details.recommendations.results[i].id
                })
                this.props.navigation.dispatch(navigateAction)
              });
            }}
          /> : null
      ) : null;

    return (
      <Composition source="PDP_Main">

        <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />
        <Timeline name="In" ref={timeline => this.inTimeline = timeline} />

        <ButtonRef
          name="Btn-Play"
          onClick={() => {
            this.outTimeline.play().then(() => {
              let navigateAction = NavigationActions.navigate({
                routeName: 'Player',
                params: { video: this.video, onBack: () => this.inTimeline.play()},
              })
              this.props.navigation.dispatch(navigateAction)
            });
          }}
        />

        <Button
          name='Btn-Back'
          onClick={() => {
            this.outTimeline.play().then(() => {
              this.props.navigation.goBack(null);
              // this.props.navigation.dispatch(backAction)
            });
          }} />

        <Metadata asset={this.state.details} />

        {recommendations}
      </Composition>
    );
  }
}

function Metadata(props) {
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

  let posterSource = "http://image.tmdb.org/t/p/w500" + props.asset.poster_path;
  let backdropSource = "http://image.tmdb.org/t/p/w1280" + props.asset.backdrop_path;

  return (
    <Fragment>
      <TextRef name="Title-Text" text={props.asset.title} />
      <TextRef name="Details-Text" text={details} />
      <TextRef name="Director" text={director} />
      <TextRef name="Stars" text={stars} />
      <TextRef name="Body-Text" text={props.asset.overview} />
      <ImageRef name="Image-2x3" source={{ uri: posterSource }} />
      <ImageRef name="Image-16x9" source={{ uri: backdropSource }} />
    </Fragment>
  );
}
