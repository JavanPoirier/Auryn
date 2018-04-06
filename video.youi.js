import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Composition,
  TextRef,
  Video,
  ViewRef,
} from 'react-native-youi';

import Scrubber from './scrubber.youi.js'
import Timeline from './timeline.youi.js'
import Button from './button.youi.js'
import Navigation from './navigation.youi.js'

export default class VideoPlayer extends Component {

  constructor(props) {
    super(props);
    var videoSource = {
      uri: "http://www.streambox.fr/playlists/x31jrg1/x31jrg1.m3u8",
      type: "HLS"
    }

    if (this.props.video && this.props.video.formats) {
      let format = this.props.video.formats.find(format => format.type.indexOf('mp4') > 0 && format.quality == 'hd720')
      if (format) {
        videoSource = { uri: format.url, type: 'MP4' }
      }
    }

    this.state = {
      videoSource: videoSource,
      formattedTime: "00:00",
      paused: true
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Video
          style={styles.video}
          ref={(ref) => { this.video = ref }}
          paused={this.state.paused}
          source={this.state.videoSource}
          onReady={() => this.setState({ paused: false })}
          onPlaybackComplete={() => {
            this.scrubber.setState({ thumbOpacity: 0 });
            this.outTimeline.play()
              .then(() => {
                Navigation.popScreen();
              });
          }}
          onCurrentTimeUpdated={(currentTime) => {
            var s = Math.floor(currentTime.nativeEvent.currentTime / 1000);
            var m = Math.floor(s / 60);
            var h = Math.floor(s / 3600);
            h = h < 1 ? '' : h + ':';
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;

            var time = h + m + ':' + s;
            this.setState({
              currentTime: currentTime.nativeEvent.currentTime,
              formattedTime: time
            });
          }}
          onDurationChanged={(duration) => {
            this.setState({
              duration: duration.nativeEvent.duration
            });
          }}
        />

        <Composition source="Player_Main">
          <ViewRef name="Playback-Controls">

            <Timeline name="In"
              ref={(timeline) => this.inTimeline = timeline}
              onLoad={() => {
              this.inTimeline.play()
              .then(() => this.scrubber.setState({ thumbOpacity: 1 }))
              }}
            />
            <Timeline name="Out" ref={(timeline) => this.outTimeline = timeline} />

            <TextRef name="Placeholder-Time" text={this.state.formattedTime} />

            <Button
              container="PlayPause-Container"
              name="Btn-PlayPause"
              toggle={true}
              onClick={() => { this.setState({ paused: !this.state.paused }) }}
            />

            <Button
              container="Btn-Back-Container"
              name="Btn-Back"
              toggle={false}
              onClick={() => {
                this.scrubber.setState({ thumbOpacity: 0 });
                this.outTimeline.play()
                  .then(() => {
                    Navigation.popScreen();
                  });
                this.video.seek(this.state.duration);
              }}
            />
          </ViewRef>
        </Composition>

        <Scrubber ref={(ref) => this.scrubber = ref} style={styles.scrubber} duration={this.state.duration} currentTime={this.state.currentTime} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: 1280,
    height: 720
  },
});
