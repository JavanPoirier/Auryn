import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default class Scrubber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbPos: this.props.currentTime / this.props.duration,
      thumbOpacity: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    this.setState({
      thumbPos: nextProps.currentTime / nextProps.duration,
    });
  }

  render = () =>
    <View style={[
      styles.container,
      { opacity: this.state.thumbOpacity },
    ]}>
      <View style={[
        styles.track,
        { flex: this.state.thumbPos },
      ]} />
      <Image
        source={{ uri: 'res://drawable/default/Scrubber-Thumb.png' }}
        style={[
          styles.thumb,
          { opacity: this.props.currentTime === 0 ? 0 : 1 },
        ]} />
    </View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 1380,
    height: 12,
    top: 719,
    left: 270,
  },
  track: {
    backgroundColor: '#EDA238',
  },
  thumb: {
    width: 36,
    height: 36,
    top: -12,
  },
});
