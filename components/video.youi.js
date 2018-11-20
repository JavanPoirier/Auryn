import React, { Component } from 'react';
import { ViewRef, VideoRef, BackHandler } from '@youi/react-native-youi';
import { Timeline } from '../components';

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

  play = () => {
    if (this.videoPlayer)
      this.videoPlayer.play();
  }

  pause = () => {
    if (this.videoPlayer)
      this.videoPlayer.pause();
  }

  navigateBack = () => {
    this.pause();
  }

  render = () =>
    <ViewRef name="Video">
      <VideoRef
        name="VideoSurface"
        ref={ref => {
          this.videoPlayer = ref;
        }}
        paused={this.state.paused}
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
    </ViewRef>
}
