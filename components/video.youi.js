import React, { Component } from 'react';
import { ViewRef, VideoRef, TextRef } from '@youi/react-native-youi';
import { Timeline, ToggleButton } from '../components';

export default class Video extends Component {
  constructor(props) {
    super(props);
    const videoSource = {
      uri: 'http://www.streambox.fr/playlists/x31jrg1/x31jrg1.m3u8',
      type: 'HLS',
    };

    this.state = {
      videoSource,
      formattedTime: '00:00',
      focusable: true,
      paused: true,
    };

  }

  componentDidUpdate(prevProps) {
    if (this.props.source !== prevProps.source) {
      const video = this.props.source;
      console.log('VIDEO', video);
      if (video && video.formats) {
        const format = video.formats
          .find(fmt => fmt.type.indexOf('mp4') > 0 && fmt.quality === 'hd720');
        if (format) {
          this.setState({
            videoSource: {
              uri: format.url,
              type: 'MP4',
            },
          });
        }
      }
    }
  }

  playPause = () => {
    if (!this.videoPlayer) return;
    this.state.paused ? this.videoPlayer.play() : this.videoPlayer.pause();
  }

  navigateBack = () => {
    if (!this.videoPlayer) return;
    this.videoPlayer.stop();
  }

  render = () =>
    <ViewRef name="Video">
      <VideoRef
        name="VideoSurface"
        ref={ref => {
          this.videoPlayer = ref;
        }}
        onPaused={() => {
this.setState({ paused: true });
}}
        onPlaying={() => {
this.setState({ paused: false });
}}
        source={this.state.videoSource}
        onCurrentTimeUpdated={currentTime => {
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
          });
        }}
        onDurationChanged={duration => {
          this.setState({ duration: duration.nativeEvent });
        }}
      />
      <Timeline name="Show" onLoad={timeline => timeline.play()} />
      <ViewRef name="Player-Controls">
        <Timeline name="Show"
          ref={ref => this.controlsShowTimeline = ref}
          onLoad={timeline => timeline.play()}
        />
        <Timeline name="Hide"
          ref={ref => this.controlsHideTimeline = ref}
        />
        <ToggleButton name="Btn-PlayPause" onPress={this.playPause} toggle={true}/>
        <ViewRef name="Video-TextDetails">
          <TextRef name="title" text={this.props.title}/>
          <TextRef name="details" text={this.props.details}/>
        </ViewRef>
      </ViewRef>
    </ViewRef>
}
