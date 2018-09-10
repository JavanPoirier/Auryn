import React, { Component, Fragment } from 'react';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
import { View, ButtonRef, Composition, ImageRef, TextRef, BackHandler, FocusManager, ViewRef } from '@youi/react-native-youi';
import { connect } from "react-redux";
import { tmdbMovieDetails, tmdbTvDetails } from '../actions/tmdbActions'
@connect((store) => {
  return {
    asset: store.tmdbReducer.details.data,
    fetched: store.tmdbReducer.details.fetched,
  }
})
class PDP extends Component {

  constructor(props) {
    super(props);
    BackHandler.addEventListener("onBackButtonPressed", this.navigateBack);
  }

  navigateBack = () => {
    this.outTimeline.play().then(() => {
      this.props.navigation.goBack(null);
    });
  }

  onPressItem = (item) => {
    let navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: { id: item.id },
      key: item.id
    })
    this.props.navigation.dispatch(navigateAction)
  }

  componentDidMount() {
    let type = this.props.navigation.getParams('type');
    let id = this.props.navigation.getParams('id');
    if (type == "movie")
      this.props.dispatch(tmdbMovieDetails(id));
    if (type == "tv")
      this.props.dispatch(tmdbTvDetails(id));
  }

  renderItem = (item) => {
    return (
      <Composition source="Auryn_ListItem-PDP">
        <ButtonRef name="Btn-Main-Half">
          <ImageRef
            name="Image-Dyanmic"
            source={{uri: "http://image.tmdb.org/t/p/w500" + item.backdrop_path}}
          />
          <TextRef name="Text-Title" text={item.title}/>
          <TextRef name="Text-Details" text={item.overview}/>
        </ButtonRef>
      </Composition>
    )
  }

  render() {
    const { asset, fetched } = this.props
    if (!fetched) {
      return(<View/>)
    }
    return (
      <Composition source="Auryn_PDP">
        <Timeline name="PDPIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
        <Timeline name="PDPOut" ref={timeline => this.outTimeline = timeline} />
        <ViewRef name="PDP-Scroller">
          <ListRef
            name="List-PDP"
            data={asset.similar.results}
            renderItem={this.renderItem}
            onPressItem={this.onPressItem}
            key={(item) => item.id}
            horizontal={true}
          />
          <ButtonRef name="Btn-2x3-Full">
            <ImageRef
              name="Image-Dynamic-2x3"
              source={{uri: "http://image.tmdb.org/t/p/w500" + asset.poster_path}}
            />
          </ButtonRef>
          <ImageRef
            name="Image-Dynamic-Background"
            source={{uri: "http://image.tmdb.org/t/p/w1280" + asset.backdrop_path}}
          />
          <ViewRef name="Layout-PDP-Meta">
            <TextRef name="Text-Title" text={asset.title} />
            <TextRef name="Text-Overview" text={asset.overview} />
            <TextRef name="Text-Featured" text="I don't know" />
          </ViewRef>
        </ViewRef>
      </Composition>
    );
  }
}

export default withNavigationFocus(PDP);
