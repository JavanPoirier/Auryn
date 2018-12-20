import React, { PureComponent } from 'react';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
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

import { Timeline, List, BackButton } from '../components';
import { tmdbDetails } from '../actions/tmdbActions';

@connect(store => ({
  asset: store.tmdbReducer.details.data,
  fetched: store.tmdbReducer.details.fetched && store.youtubeReducer.fetched,
  fetching: store.tmdbReducer.details.fetching,
}))
class PDP extends PureComponent {
  constructor(props) {
    super(props);
    this.allowVideoPlayback = false;
  }

  navigateBack = () => {
    this.outTimeline.play().then(() => {
      this.props.navigation.goBack(null);
    });
    return true;
  }

  onPressItem = (id, type) => {
    this.allowVideoPlayback = false;
    this.props.dispatch(tmdbDetails(id, type));
    this.contentOutTimeline.play()
      .then(() => this.props.navigation.navigate({ routeName: 'PDP', params: { id, type } }))
      .then(() => {
        FocusManager.focus(this.posterButton);
        this.contentInTimeline.play();
      });
  }

  onFocusItem = (ref, id, type) => this.props.dispatch(tmdbDetails(id, type));

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
      if (this.posterButton)
        setTimeout(() => FocusManager.focus(this.posterButton), 1);

      if (this.videoOutTimeline) this.videoOutTimeline.play();
    });

    this.props.navigation.addListener('didBlur', () => this.backHandler.remove());
  }

  playVideo = () => {
    if (!this.allowVideoPlayback) return;
    this.videoInTimeline.play().then(() =>
      this.props.navigation.dispatch(NavigationActions.navigate({
          routeName: 'Video',
          params: { videoSource: this.props.asset.videoSource },
        })));
  }

  getFeaturedText = credits => {
    const director = credits.crew.find(it => it.job === 'Director');
    const cast = credits.cast.slice(0, 3).map(it => it.name).join(', ');
    if (director)
      return `Director: ${director.name} | Starring: ${cast}`;

    return `Starring: ${cast}`;
  }

  render() { // eslint-disable-line max-lines-per-function
    const { fetched, asset } = this.props;
    console.log('ASSET', asset);

    if (!fetched || !asset)
      return <View />;

      console.log('render');
    return (
      <Composition source="Auryn_PDP">

        <Timeline name="VideoIn" ref={timeline => this.videoInTimeline = timeline} />
        <Timeline name="VideoOut" ref={timeline => this.videoOutTimeline = timeline} />

        <Timeline name="PDPIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />

        <Timeline name="PDPOut" ref={timeline => this.outTimeline = timeline} />
        <ViewRef name="PDP-Scroller" visible={this.props.isFocused}>
          <BackButton
            focusable={this.props.isFocused}
            hasBackButton={this.props.screenProps.hasBackButton}
            onPress={this.navigateBack}
          />
          <List
            name="List-PDP"
            type="Shows"
            data={asset.similar.results.slice(0, 5).map(it => ({ ...it, key: it.id.toString() }))}
            focusable={this.props.isFocused}
            onPressItem={this.onPressItem}
            onFocusItem={this.onFocusItem}
          />

          <Timeline
            name="ContentIn"
            ref={timeline => this.contentInTimeline = timeline}
            onLoad={ref => ref.play().then(() => this.allowVideoPlayback = true)} />
          <Timeline name="ContentOut" ref={timeline => this.contentOutTimeline = timeline} />

          <ButtonRef
            name="Btn-Poster-Large"
            focusable={this.props.isFocused}
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
