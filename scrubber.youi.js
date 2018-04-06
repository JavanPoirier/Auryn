import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

export default class Scrubber extends Component {

  constructor(props) {
    super(props);
    this.state = {
      thumbPos: (this.props.currentTime / this.props.duration),
      thumbOpacity: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      thumbPos: (nextProps.currentTime / nextProps.duration),
    })
  }

  render() {
    return (
      <View style={[styles.container, { opacity: this.state.thumbOpacity }]}>
        <View style={[styles.track, { flex: this.state.thumbPos }]} />
        <Image source={{ uri: "res://drawable/default/Scrubber-Thumb.png" }}
          style={[styles.thumb, { opacity: this.props.currentTime == 0 ? 0 : 1 }]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 920,
    height: 8,
    top: -241,
  },
  track: {
    backgroundColor: '#D5A23E',
  },
  thumb: {
    width: 24,
    height: 24,
    top: -8,
  },
});
