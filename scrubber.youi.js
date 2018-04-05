import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import {
  Fragment,
  Image,
} from 'react-native-youi';

export default class Scrubber extends Component {

  constructor(props) {
    super(props);
    this.state = {
      thumbPos: (this.props.currentTime / this.props.duration),
      thumbOpacity: 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      thumbPos: (nextProps.currentTime / nextProps.duration),
    })
  }

  render() {
    return (
      <Fragment>
        <View style={[styles.container, { opacity: this.state.thumbOpacity }]}>
          <View style={[{ flex: this.state.thumbPos }, styles.track]} />
          <Image source={{ uri: "res://drawable/default/Scrubber-Thumb.png" }}
            style={[styles.thumb, { opacity: this.props.currentTime == 0 ? 0 : 1 }]} />
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  thumb: {
    width: 24,
    height: 24,
    top: -8,
  },
  container: {
    width: 920,
    height: 8,
    top: -241,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  track: {
    flexDirection: 'column',
    height: 8,
    backgroundColor: '#D5A23E',
  },
});
