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
} from '@youi/react-native-youi';
import { connect } from 'react-redux';
import Youtube from 'youtube-stream-url';
import { Timeline, Video, ListItem } from '../components';
import { tmdbMovieDetails, tmdbTvDetails } from '../actions/tmdbActions';

@connect(store => ({
  asset: store.tmdbReducer.details.data,
  fetched: store.tmdbReducer.details.fetched,
}))

class PDP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      youtubeVideo: null,
      videoPlaying: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.asset !== prevProps.asset) {
      console.log('ASSET', this.props.asset);
      this.contentInTimeline.play();
      if (this.props.asset.videos.results.length > 0) {
        Youtube.getInfo({ url: `http://www.youtube.com/watch?v=${this.props.asset.videos.results[0].key}` })
          .then(video => this.setState({ youtubeVideo: video }));
      }
    }
  }

  navigateBack = () => {
    if (this.state.videoPlaying === true) {
      this.video.navigateBack();
      this.videoOutTimeline.play();
      this.setState({ videoPlaying: false });
    } else {
      this.outTimeline.play().then(() => {
        this.props.navigation.goBack(null);
      });
    }
  }

  onPressItem = (id, type) => {
    this.contentOutTimeline.play();
    this.video.reset();
    type === 'movie' ?
    this.props.dispatch(tmdbMovieDetails(id))
    : this.props.dispatch(tmdbTvDetails(id));
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      if (this.contentInTimeline)
        this.contentInTimeline.play();
      BackHandler.addEventListener('onBackButtonPressed', this.navigateBack);
    });
    this.props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('onBackButtonPressed', this.navigateBack);
    });

    const type = this.props.navigation.getParam('type');
    const id = this.props.navigation.getParam('id');

    type === 'movie' ?
    this.props.dispatch(tmdbMovieDetails(id))
    : this.props.dispatch(tmdbTvDetails(id));
  }

  playVideo = () => {
    this.setState({ videoPlaying: true });
    this.videoInTimeline.play();
    setTimeout(() => this.video.playPause(), 100);
    // This.video.playPause();//
  }

  render() { // eslint-disable-line max-lines-per-function
    const { asset, fetched } = this.props;
    if (!fetched)
      return <View />;

    return (
      <Composition source="Auryn_PDP">

        <Timeline name="VideoIn" ref={timeline => this.videoInTimeline = timeline} />
        <Timeline name="VideoOut" ref={timeline => this.videoOutTimeline = timeline} />
        <Video source={this.state.youtubeVideo} ref={ref => this.video = ref} />

        <Timeline name="PDPIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />

        <Timeline name="PDPOut" ref={timeline => this.outTimeline = timeline} />
        <ViewRef name="PDP-Scroller">
          <ListRef
            name="List-PDP"
            data={asset.similar.results}
            renderItem={({ item, index }) =>
              <ListItem
                imageType="Backdrop"
                size="Small"
                focusable={this.props.isFocused}
                onPress={this.onPressItem}
                data={item}
                index={index}
              />}
            keyExtractor={item => item.id}
            horizontal={true}
          />

          <TimelineRef name="ContentIn" ref={timeline => this.contentInTimeline = timeline} onLoad={ref => ref.play()} />
          <Timeline name="ContentOut" ref={timeline => this.contentOutTimeline = timeline} />

          <ButtonRef
            name="Btn-Poster-Large"
            focusable={this.props.isFocused}
            onPress={this.playVideo}
          >
            <ImageRef
              name="Image-Dynamic"
              source={{ uri: `http://image.tmdb.org/t/p/w1280${asset.poster_path}` }}
            />
          </ButtonRef>

          <ImageRef
            name="Image-Dynamic-Background"
            source={{ uri: `http://image.tmdb.org/t/p/w1280${asset.backdrop_path}` }}
          />

          <ViewRef name="Layout-PDP-Meta">
            <TextRef name="Text-Title" text={asset.title} />
            <TextRef name="Text-Overview" text={asset.overview} />
            <TextRef name="Text-Featured" text="Director: Darth Solo  |  Starring: John Wick, Catherine Freda, Marco Frank" />
            <TimelineRef name="In2" ref={timeline => this.pdpMetaInTimeline = timeline} onLoad={ref => ref.play()} />
          </ViewRef>

        </ViewRef>
      </Composition>
    );
  }
}

export default withNavigationFocus(PDP);
