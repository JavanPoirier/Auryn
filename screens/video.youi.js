import React, { PureComponent } from 'react';
import { View, Composition, ViewRef, VideoRef, ButtonRef, TextRef, Input, FocusManager, BackHandler } from '@youi/react-native-youi';
import { Timeline, ToggleButton, BackButton } from '../components';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';

@connect(store => ({
  videoSource: store.youtubeReducer.videoSource,
  asset: store.tmdbReducer.details.data,
  fetched: store.youtubeReducer.fetched,
}))
class Video extends PureComponent {
  constructor(props) {
    super(props);
    this.fallbackVideo = {
      uri: 'http://www.streambox.fr/playlists/x31jrg1/x31jrg1.m3u8',
      type: 'HLS',
    };

    this.state = {
      controlsVisible: false,
      formattedTime: '00:00',
      focusable: true,
      paused: true,
      error: false,
    };
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
    if (prevProps.videoSource !== this.props.videoSource)
      this.setState({ videoSource: this.props.videoSource });

    if (this.state.percent !== prevState.percent) {
      console.log('SCRUB', this.state.percent);
      this.scrubberTimeline.play(this.state.percent);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.videoSource !== this.props.videoSource)
      return true;

    if (nextState.videoSource !== this.state.videoSource)
      return true;

    if (this.state.percent !== nextState.percent)
      return true;

    if (nextState.controlsVisible) return true;

    return false;
  }

  inactivityDetected = () => {
    if (this.controlsHideTimeline) this.controlsHideTimeline.play();
    this.setState({ controlsVisible: false });
  }

  showControls = () => {
    this.setState({ controlsVisible: true });
    FocusManager.focus(this.playButton);
    this.controlsShowTimeline.play();
  }

  hideControls = () => {
    this.setState({ controlsVisible: false });
    FocusManager.focus(this.videoPlayer);
    if (this.controlsHideTimeline) this.controlsHideTimeline.play();
  }

  registerUserActivity = () => {
    if (!this.state.controlsVisible) this.showControls();

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
    if (this.outTimeline) {
      this.outTimeline.play().then(() => {
        this.videoPlayer.stop();
        this.props.navigation.goBack(null);
      });
    } else
      this.props.navigation.goBack(null);

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
    const { fetched, asset } = this.props;
    if (!fetched)
      return <View />;

    return (
      <Composition source="Auryn_VideoContainer">
        <Timeline
          name="In"
          ref={timeline => this.inTimeline = timeline}
         />
        <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />

        <ButtonRef name="Video" onPress={this.registerUserActivity}>
          <VideoRef
            name="VideoSurface"
            ref={ref => {
              this.videoPlayer = ref;
            }}
            onPaused={() => this.setState({ paused: true })}
            onPlaying={() => this.setState({ paused: false })}
            onReady={() => {
             this.videoPlayer.play();
             this.inTimeline.play();
            }}
            source={this.state.videoSource}
            onErrorOccurred={() => {
              this.setState({ error: true, videoSource: this.fallbackVideo });
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
