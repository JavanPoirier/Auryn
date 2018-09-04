import React, { Component, Fragment } from 'react';
import { ButtonRef, Composition, ImageRef, TextRef, BackHandler, FocusManager } from '@youi/react-native-youi';
import Youtube from 'youtube-stream-url'
import { ListItem, Timeline, Button } from '../components'
import { NavigationActions } from 'react-navigation';
import { fetchPDPfromCache, fetchPDP } from '../actions/moviesActions';
import { connect } from "react-redux";

@connect((store) => {
  return {
    asset: store.pdpReducer.asset,
    fetched: store.pdpReducer.fetched
  }
})
export default class PDP extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focusable: true
    };
  }

  navigateBack = () => {
    this.outTimeline.play().then(() => {
      this.props.navigation.goBack(null);
    });
  }

  componentDidMount() {
    this.props.dispatch(fetchPDP(this.props.navigation.getParam('id')));

    this.props.navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener('onBackButtonPressed', this.navigateBack);
      this.setState({focusable: false})
    })

    this.props.navigation.addListener('willFocus', () => {
      BackHandler.addEventListener("onBackButtonPressed", this.navigateBack);
      this.setState({focusable: true});
      this.props.dispatch(fetchPDPfromCache(this.props.navigation.getParam('id')));
      this.inTimeline.play()
    })
  }

  render() {
    const { asset, fetched } = this.props
    let metadata = Metadata(asset)
    let listItems = fetched ?
      Array(4).fill().map((_, i) =>
      asset.recommendations.results.length > i ?
          <ListItem
            key={asset.recommendations.results[i].id}
            name={'Poster' + (i + 1)}
            image='Image-2x3'
            focusable={this.state.focusable}
            asset={asset.recommendations.results[i]}
            onClick={() => {
              this.outTimeline.play().then(() => {
                let navigateAction = NavigationActions.navigate({
                  routeName: 'PDP',
                  params: { id: asset.recommendations.results[i].id},
                  key: asset.recommendations.results[i].id
                })
                this.props.navigation.dispatch(navigateAction)
              });
            }}
          /> : null
      ) : null;

    return (
      <Composition source="PDP_Main">

        <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />
        <Timeline name="In" ref={timeline => this.inTimeline = timeline} onLoad={timeline => timeline.play()} />

        <ButtonRef
          focusable={this.state.focusable}
          ref={ref => this.mainButton = ref}
          onLoad={() => FocusManager.focus(this.mainButton)}
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
          focusable={this.state.focusable}
          onClick={() => {
            this.navigateBack();
          }} />

        {metadata}

        {listItems}
      </Composition>
    );
  }
}

function Metadata(asset) {
  if (!asset)
    return null;

  console.log(asset)
  let releaseDate = asset.release_date.split("-")[0];
  let rating = asset.releases.countries.find((release) => release["iso_3166_1"] === "US");
  rating = rating && rating.certification ? "Rated " + rating.certification : null;
  let runtime = asset.runtime ? asset.runtime + " mins" : null;
  let details = [releaseDate, rating, runtime].filter((item) => item !== null).join(" | ");

  let director = asset.credits.crew.find((member) => member["job"] === "Director");
  director = director ? director.name : "";
  let stars = asset.credits.cast.slice(0, 3).map((member) => member["name"]).join(", ");

  let posterSource = "http://image.tmdb.org/t/p/w500" + asset.poster_path;
  let backdropSource = "http://image.tmdb.org/t/p/w1280" + asset.backdrop_path;

  return (
    <Fragment>
      <TextRef name="Title-Text" text={asset.title} />
      <TextRef name="Details-Text" text={details} />
      <TextRef name="Director" text={director} />
      <TextRef name="Stars" text={stars} />
      <TextRef name="Body-Text" text={asset.overview} />
      <ImageRef name="Image-2x3" source={{ uri: posterSource }} />
      <ImageRef name="Image-16x9" source={{ uri: backdropSource }} />
    </Fragment>
  );
}
