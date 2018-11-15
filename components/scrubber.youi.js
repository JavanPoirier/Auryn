import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default class Scrubber extends Component {
  render = () =>
    <View style={styles.container}>
      <View style={[
        styles.track,
        { flex: this.props.currentTime / this.props.duration },
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
