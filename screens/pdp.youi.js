import React, { Component } from 'react';
import { withNavigationFocus } from 'react-navigation';
import {
  BackHandler,
  ButtonRef,
  Composition,
  ImageRef,
  TextRef,
  View,
  ViewRef,
  FocusManager,
} from '@youi/react-native-youi';
import { connect } from 'react-redux';

import { Timeline, Video, List, BackButton } from '../components';
import { tmdbDetails } from '../actions/tmdbActions';

@connect(store => ({
  asset: store.tmdbReducer.details.data,
  fetched: store.tmdbReducer.details.fetched && store.youtubeReducer.fetched,
  videoSource: store.youtubeReducer.videoSource,
}))

class PDP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoVisible: false,
    };
    this.allowVideoPlayback = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.asset !== prevProps.asset) {
      console.log('ASSET', this.props.asset);
      this.contentInTimeline.play().then(() => this.allowVideoPlayback = true);

      FocusManager.focus(this.posterButton);
    }
  }

  navigateBack = () => {
    if (this.state.videoVisible === true) {
      this.video.navigateBack();

      this.videoOutTimeline.play();
      this.setState({ videoVisible: false });
      FocusManager.focus(this.posterButton);
    } else {
      this.outTimeline.play().then(() => {
        this.props.navigation.goBack(null);
      });
    }

    return true;
  }

  onPressItem = (id, type) => {
    this.allowVideoPlayback = false;
    this.contentOutTimeline.play();
    this.video.reset();
    this.props.dispatch(tmdbDetails(id, type));
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () =>
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.navigateBack));
    this.props.navigation.addListener('didBlur', () => this.backHandler.remove());
  }

  playVideo = () => {
    if (!this.allowVideoPlayback) return;
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
        <Video
          source={videoSource}
          ref={ref => this.video = ref}
          visible={this.state.videoVisible}
          title={asset.title || asset.name}
          details={asset.overview}
          onPressBackButton={this.navigateBack}
          hasBackButton={this.props.screenProps.hasBackButton}
        />

        <Timeline name="PDPIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />

        <Timeline name="PDPOut" ref={timeline => this.outTimeline = timeline} />
        <ViewRef name="PDP-Scroller">
          <BackButton
            focusable={this.props.isFocused}
            hasBackButton={this.props.screenProps.hasBackButton}
            onPress={this.navigateBack}
          />
          <List
            name="List-PDP"
            type="Shows"
            data={asset.similar.results.slice(0, 5).map(it => ({ ...it, key: it.id.toString() }))}
            focusable={this.props.isFocused && !this.state.videoVisible}
            onPressItem={this.onPressItem}
          />

          <Timeline
            name="ContentIn"
            ref={timeline => this.contentInTimeline = timeline}
            onLoad={ref => ref.play().then(() => this.allowVideoPlayback = true)} />
          <Timeline name="ContentOut" ref={timeline => this.contentOutTimeline = timeline} />

          <ButtonRef
            name="Btn-Poster-Large"
            focusable={this.props.isFocused && !this.state.videoVisible}
            onPress={this.playVideo}
            ref={ref => this.posterButton = ref}
            onLoad={() => FocusManager.focus(this.posterButton)}
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
            <Timeline name="In2" ref={timeline => this.pdpMetaInTimeline = timeline} onLoad={ref => ref.play()} />
          </ViewRef>

        </ViewRef>
      </Composition>
    );
  }
}

export default withNavigationFocus(PDP);
