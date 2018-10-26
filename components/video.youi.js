import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ViewRef, VideoRef, BackHandler } from '@youi/react-native-youi';
import { Timeline } from '../components'
export default class Video extends Component {
  constructor(props) {
    super(props);
    var videoSource = {
      uri: "http://www.streambox.fr/playlists/x31jrg1/x31jrg1.m3u8",
      type: "HLS"
    }

    this.state = {
      videoSource: videoSource,
      formattedTime: "00:00",
      focusable: true,
      paused: true
    };

    BackHandler.addEventListener("onBackButtonPressed", this.navigateBack);
  }

  componentDidUpdate(prevProps) {
    if (this.props.source != prevProps.source) {
      let video = this.props.source;
      console.log('VIDEO', video)
      if (video && video.formats) {
        let format = video.formats
        .find(format => format.type.indexOf('mp4') > 0 && format.quality === 'hd720');
        if (format) {
          this.setState({
            "videoSource": {
            uri: format.url,
            type: 'MP4'
            }
          })
        }
      }
    }
  }
  play = () => {
    this.videoPlayer.play()
  }

  navigateBack = () => {
    this.videoPlayer.pause();
  }

  render() {
    return (
      <ViewRef name="Video">
        <VideoRef
          name="VideoSurface"
          ref={(ref) => {
            this.videoPlayer = ref;
          }}
          paused={this.state.paused}
          source={this.state.videoSource}
          onPlaybackComplete={() => this.navigateBack}
          onCurrentTimeUpdated={currentTime => {
            var s = Math.floor(currentTime.nativeEvent / 1000);
            var m = Math.floor(s / 60);
            var h = Math.floor(s / 3600);
            s = s % 60;
            m = m % 60;
            h = h < 1 ? '' : h + ':';
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            var time = h + m + ':' + s;
            this.setState({ currentTime: currentTime.nativeEvent, formattedTime: time });
          }}
          onDurationChanged={duration => {
            this.setState({ duration: duration.nativeEvent });
          }}
        />
        <Timeline name="Show" onLoad={t => t.play()}/>
      </ViewRef>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    flex: 1,
  },
  scrubber: {
    position: 'absolute',
    width: 1920,
    height: 1080
  }
});
