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
      uri: "https://r3---sn-ab5l6nzs.googlevideo.com/videoplayback?dur=181.603&initcwndbps=1106250&c=WEB&mime=video%2Fmp4&expire=1523033560&lmt=1521236703261807&key=yt6&requiressl=yes&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&mn=sn-ab5l6nzs%2Csn-ab5sznlk&mm=31%2C29&source=youtube&ratebypass=yes&ipbits=0&ip=184.153.7.51&fvip=3&mt=1523011862&signature=5728F405C89C5903D6A64A4605BA925F0172BF8B.B9EEF9F60A975F6CBA0EBEED330D9D2CF776CEBC&ms=au%2Crdu&ei=eFHHWsbwIYm38wTg3a7ACg&id=o-AM5D2DVee3x-Fqo8QCgp1E7UvZG5d5httZRQJJ2U9YOK&pl=17&mv=m&itag=22",
      type: "MP4"
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
