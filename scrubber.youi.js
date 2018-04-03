import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import {
  Animated,
  Image,
  TouchableHighlight,
} from 'react-native-youi';

class Scrubber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbPos: (this.props.currentTime / this.props.duration)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      thumbPos: (nextProps.currentTime / nextProps.duration)
    })
  }

  render() {
    return (
      <Fragment>
        <View style={{ width: 920, height: 8, top: -241 }}>
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent' }}>
            <View style={{ flex: this.state.thumbPos, flexDirection: 'column', height: 8, backgroundColor: '#DF1D46' }} />
            <Image source={{ uri: "res://drawable/default/Scrubber-Thumb.png" }}
              style={[styles.thumb, { opacity: this.props.currentTime == 0 ? 0 : 1 }]} />
          </View>
        </View>
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  thumb: {
    width: 24,
    height: 24,
    top: -8
  },
})

export default Scrubber
