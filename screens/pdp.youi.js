import React, { Component } from 'react';
import { withNavigationFocus } from 'react-navigation';
import {
  BackHandler,
  ButtonRef,
  Composition,
  ImageRef,
  ListRef,
  TextRef,
  TimelineRef,
  View,
  ViewRef,
  FocusManager,
} from '@youi/react-native-youi';
import { connect } from 'react-redux';

import { Timeline, Video, ListItem } from '../components';
import { tmdbDetails  } from '../actions/tmdbActions';
import { youtubeVideo } from '../actions/youtubeActions';

@connect(store => ({
  asset: store.tmdbReducer.details.data,
  fetched: store.tmdbReducer.details.fetched,
  videoSource: store.youtubeReducer.videoSource,
}))

class PDP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoVisible: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.asset !== prevProps.asset) {
      console.log('ASSET', this.props.asset);
      this.contentInTimeline.play();
      if (this.props.asset.videos.results.length > 0)
        this.props.dispatch(youtubeVideo(this.props.asset.videos.results[0].key));
    }

    if (this.state.videoVisible !== prevState.videoVisible)
      if (!this.state.videoVisible) FocusManager.focus(this.posterButton);
  }

  navigateBack = () => {
    if (this.state.videoVisible === true) {
      this.video.navigateBack();

      this.videoOutTimeline.play();
      this.setState({ videoVisible: false });
    } else {
      this.outTimeline.play().then(() => {
        this.props.navigation.goBack(null);
      });
    }
  }

  onPressItem = (id, type) => {
    this.contentOutTimeline.play();
    this.video.reset();
    this.props.dispatch(tmdbDetails(id, type));
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      if (this.contentInTimeline)
        this.contentInTimeline.play();
      if (this.posterButton) FocusManager.focus(this.posterButton);
      BackHandler.addEventListener('onBackButtonPressed', this.navigateBack);
    });
    this.props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('onBackButtonPressed', this.navigateBack);
    });
  }

  playVideo = () => {
    this.setState({ videoVisible: true });
    this.videoInTimeline.play();
    setTimeout(() => this.video.playPause(), 100);
  }

  getFeaturedText = credits => {
    const director = credits.crew.find(it => it.job === 'Director');
    const cast = credits.cast.slice(0, 3).map(it => it.name).join(', ');
    if (director)
      return `Director: ${director.name} | Starring: ${cast}`;

    return `Starring: ${cast}`;
  }

  render() { // eslint-disable-line max-lines-per-function
    const { asset, fetched, videoSource } = this.props;
    if (!fetched || !this.props.isFocused)
      return <View />;

    return (
      <Composition source="Auryn_PDP">

        <Timeline name="VideoIn" ref={timeline => this.videoInTimeline = timeline} />
        <Timeline name="VideoOut" ref={timeline => this.videoOutTimeline = timeline} />
        <Video source={videoSource} ref={ref => this.video = ref} visible={this.state.videoVisible}/>

        <Timeline name="PDPIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />

        <Timeline name="PDPOut" ref={timeline => this.outTimeline = timeline} />
        <ViewRef name="PDP-Scroller">
          <ListRef
            name="List-PDP"
            data={asset.similar.results.slice(0, 5).map(it => ({ ...it, key: it.id.toString() }))}
            renderItem={({ item, index }) =>
              <ListItem
                imageType="Backdrop"
                size="Small"
                focusable={this.props.isFocused && !this.state.videoVisible}
                onPress={this.onPressItem}
                data={item}
                index={index}
              />}
            horizontal={true}
          />

          <TimelineRef name="ContentIn" ref={timeline => this.contentInTimeline = timeline} onLoad={ref => ref.play()} />
          <Timeline name="ContentOut" ref={timeline => this.contentOutTimeline = timeline} />

          <ButtonRef
            name="Btn-Poster-Large"
            focusable={this.props.isFocused && !this.state.videoVisible}
            onPress={this.playVideo}
            ref={ref => this.posterButton = ref}
          >
            <ImageRef
              name="Image-Dynamic"
              source={{ uri: `http://image.tmdb.org/t/p/w500${asset.poster_path}` }}
            />
          </ButtonRef>

          <ImageRef
            name="Image-Dynamic-Background"
            source={{ uri: `http://image.tmdb.org/t/p/w1280${asset.backdrop_path}` }}
          />

          <ViewRef name="Layout-PDP-Meta">
            <TextRef name="Text-Title" text={asset.title || asset.name} />
            <TextRef name="Text-Overview" text={asset.overview} />
            <TextRef name="Text-Featured" text={this.getFeaturedText(asset.credits)} />
            <TimelineRef name="In2" ref={timeline => this.pdpMetaInTimeline = timeline} onLoad={ref => ref.play()} />
          </ViewRef>

        </ViewRef>
      </Composition>
    );
  }
}

export default withNavigationFocus(PDP);
