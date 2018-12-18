import React, { PureComponent } from 'react';
import { View, Composition, ViewRef, VideoRef, ButtonRef, TextRef, Input, FocusManager, BackHandler } from '@youi/react-native-youi';
import { Timeline, ToggleButton, BackButton } from '../components';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';

@connect(store => ({
  asset: store.tmdbReducer.details.data,
  fetched: store.tmdbReducer.details.fetched && store.youtubeReducer.fetched,
  videoSource: store.youtubeReducer.videoSource,
}))
class Video extends PureComponent {
  constructor(props) {
    super(props);
    this.fallbackVideo = {
      uri: 'http://www.streambox.fr/playlists/x31jrg1/x31jrg1.m3u8',
      type: 'HLS',
    };

    this.state = {
      formattedTime: '00:00',
      focusable: true,
      paused: true,
    };
    this.controlsVisible = false;
  }

  keys = [
    'YI_KEY_SPACE',
    'YI_KEY_PLAY',
    'YI_KEY_MEDIA_PLAY',
    'YI_KEY_MEDIA_PLAY_PAUSE',
    'YI_KEY_ENTER',
    'YI_KEY_SELECT',
    'YI_KEY_PAGEDOWN',
    'YI_KEY_ARROW_DOWN',
    'YI_KEY_ARROW_UP',
    'YI_KEY_ARROW_LEFT',
    'YI_KEY_ARROW_RIGHT',
    'YI_KEY_ARROW_UP_LEFT',
    'YI_KEY_ARROW_UP_RIGHT',
    'YI_KEY_ARROW_DOWN_LEFT',
    'YI_KEY_ARROW_DOWN_RIGHT',
  ];

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () =>
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.navigateBack));
    this.props.navigation.addListener('didBlur', () => this.backHandler.remove());
    this.keys.forEach(key => Input.addEventListener(key, this.registerUserActivity));
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line max-statements
    if (this.props.source !== prevProps.source) {
      console.log('VIDEO', this.props.source);
      this.setState({ videoSource: this.props.source });
    }

    if (this.state.percent !== prevState.percent) {
      console.log('SCRUB', this.state.percent);
      this.scrubberTimeline.play(this.state.percent);
    }
  }

  inactivityDetected = () => {
    if (this.controlsHideTimeline) this.controlsHideTimeline.play();
    this.controlsVisible = false;
  }

  showControls = () => {
    this.controlsVisible = true;
    FocusManager.focus(this.playButton);
    this.controlsShowTimeline.play();
  }

  hideControls = () => {
    this.controlsVisible = false;
    FocusManager.focus(this.videoPlayer);
    if (this.controlsHideTimeline) this.controlsHideTimeline.play();
  }

  registerUserActivity = () => {
    if (!this.controlsVisible) this.showControls();

    if (this.activityTimeout)
      clearTimeout(this.activityTimeout);

    // Set our new activity timeout
    this.activityTimeout = setTimeout(() => this.inactivityDetected(), 3000);
  }

  reset = () => {
    if (!this.videoPlayer) return;

    this.videoPlayer.stop();
    this.scrubberTimeline.play(0);
    this.setState({
      formattedTime: '00:00',
      duration: 0,
      paused: true,
    });
  }

  playPause = () => {
    this.state.paused ? this.videoPlayer.play() : this.videoPlayer.pause();
  }

  navigateBack = () => {
    this.keys.forEach(key => Input.removeEventListener(key, this.registerUserActivity));
    this.outTimeline.play().then(() => {
      this.videoPlayer.pause();
      this.props.navigation.goBack(null);
    });
    return true;
  }

  onCurrentTimeUpdated = currentTime => { // eslint-disable-line max-statements
    if (isNaN(currentTime.nativeEvent)) return;
    let sec = Math.floor(currentTime.nativeEvent / 1000);
    let min = Math.floor(sec / 60);
    let hour = Math.floor(sec / 3600);
    sec %= 60;
    min %= 60;
    hour = hour < 1 ? '' : `${hour}:`;
    min = min < 10 ? `0${min}` : min;
    sec = sec < 10 ? `0${sec}` : sec;
    const time = `${hour}${min}:${sec}`;
    this.setState({
      currentTime: currentTime.nativeEvent,
      formattedTime: time,
      percent: currentTime.nativeEvent / this.state.duration,
    });
  }

  render() { // eslint-disable-line max-lines-per-function
    const { asset, fetched, videoSource } = this.props;
    if (!fetched || !this.props.isFocused)
      return <View />;

    return (
      <Composition source="Auryn_VideoContainer">
        <Timeline name="In"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()} />
        <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />

        <ButtonRef name="Video" onPress={this.registerUserActivity}>
          <VideoRef
            name="VideoSurface"
            ref={ref => {
              this.videoPlayer = ref;
            }}
            onPaused={() => this.setState({ paused: true })}
            onPlaying={() => this.setState({ paused: false })}
            onReady={() => this.videoPlayer.play()}
            source={videoSource}
            onErrorOccurred={() => {
              this.setState({ videoSource: this.fallbackVideo });
            }}
            onCurrentTimeUpdated={this.onCurrentTimeUpdated}
            onDurationChanged={duration => {
              this.setState({ duration: duration.nativeEvent });
            }}
          />
          <ViewRef name="ActivityIndicator">
            <Timeline name="Show" ref={ref => this.activityShowTimeline = ref} />
            <Timeline name="Hide" ref={ref => this.activityHideTimeline = ref} />
          </ViewRef>
          <ViewRef name="Player-Controls">
            <BackButton
              focusable={this.props.isFocused}
              hasBackButton={this.props.screenProps.hasBackButton}
              onPress={this.props.onPressBackButton}
            />
            <Timeline name="Show"
              ref={ref => this.controlsShowTimeline = ref}
            />
            <Timeline name="Hide"
              ref={ref => this.controlsHideTimeline = ref}
            />
            <ToggleButton name="Btn-PlayPause"
              onPress={this.playPause}
              toggled={!this.state.paused}
              toggle={true}
              focusable={this.props.isFocused}
              ref={ref => this.playButton = ref}
            />
            <TextRef name="Duration" text={this.state.formattedTime} />
            <ViewRef name="Bar">
              <Timeline name="ScrollStart" ref={ref => this.scrubberTimeline = ref} />
            </ViewRef>
            <ViewRef name="Video-TextDetails">
              <TextRef name="Title" text={asset.title || asset.name} />
              <TextRef name="Details" text={asset.overview} />
            </ViewRef>
          </ViewRef>
        </ButtonRef>
      </Composition>
    );
  }
}

export default withNavigationFocus(Video);
