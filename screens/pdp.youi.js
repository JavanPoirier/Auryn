import React, { Component } from 'react';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
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
    BackHandler.addEventListener('onBackButtonPressed', this.navigateBack);
    this.state = {
      youtubeVideo: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.asset !== prevProps.asset) {
      console.log('ASSET', this.props.asset);
      if (this.props.asset.videos.results.length > 0) {
        Youtube.getInfo({ url: `http://www.youtube.com/watch?v=${this.props.asset.videos.results[0].key}` })
          .then(video => this.setState({ youtubeVideo: video }));
      }
    }
  }

  navigateBack = () => {
    this.contentoutTimeline.play();
    this.outTimeline.play().then(() => this.props.navigation.goBack(null));
  }

  onPressItem = id => {
    this.outTimeline.play()
      .then(() => {
        const navigateAction = NavigationActions.navigate({
          routeName: 'PDP',
          params: { id },
          key: id,
        });

        this.props.navigation.dispatch(navigateAction);
      });
  }

  componentDidMount() {
    const type = this.props.navigation.getParam('type');
    const id = this.props.navigation.getParam('id');

    if (type === 'movie')
      this.props.dispatch(tmdbMovieDetails(id));
    if (type === 'tv')
      this.props.dispatch(tmdbTvDetails(id));
  }

  renderItem = ({ item }) =>
    <Composition source="Auryn_ListItem-PDP">
      <ButtonRef name="Btn-Main-Half" onPress={() => this.onPressItem(item.id)}>
        <ImageRef
          name="Image-Dynamic"
          source={{ uri: `http://image.tmdb.org/t/p/w500${item.backdrop_path}` }}
        />
        <TextRef name="Text-Title" text={item.title} />
        <TextRef name="Text-Details" text={item.overview} />
      </ButtonRef>
    </Composition>

  playVideo = () =>
    this.videoInTimeline.play()
      .then(() => {
        this.videoPlayer.play();
      });

  render() { // eslint-disable-line max-lines-per-function
    const { asset, fetched } = this.props;

    if (!fetched)
      return <View />;

    return (
      <Composition source="Auryn_PDP">

        <Timeline name="VideoIn" ref={timeline => this.videoInTimeline = timeline} />
        <Timeline name="VideoOut" ref={timeline => this.videoOutTimeline = timeline} />
        <Video source={this.state.youtubeVideo} ref={ref => this.videoPlayer = ref} />

        <Timeline name="PDPIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />

        <Timeline name="PDPOut" ref={timeline => this.outTimeline = timeline} />
        <ViewRef name="PDP-Scroller">
          <ListRef
            name="List-PDP"
            data={asset.similar.results}
            renderItem={({ item }) =>
              <ListItem imageType="Backdrop" size="Small" data={item} onPress={() => this.onPressItem(item.id)} />}
            keyExtractor={item => item.id}
            horizontal={true}
          />

          <TimelineRef name="ContentIn" ref={timeline => this.contentinTimeline = timeline} onLoad={ref => ref.play()} />
          <TimelineRef name="ContentOut" ref={timeline => this.contentoutTimeline = timeline} />

          <ButtonRef
            name="Btn-Poster-Large"
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
            <TimelineRef name="In2" ref={timeline => this.in2Timeline = timeline} onLoad={ref => ref.play()} />
          </ViewRef>

        </ViewRef>
      </Composition>
    );
  }
}

export default withNavigationFocus(PDP);
