import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Button
  } from 'react-native';
  import {
    ButtonRef,
    Animated,
    Composition,
    ImageRef,
    TextRef,
    TimelineRef,
    Fragment,
    ViewRef,
    Video,
    TouchableHighlight,
    Image
  } from 'react-native-youi';

class Scrubber extends Component {
    constructor(props) {
        super(props);
        this.state = {
          thumbPos: (this.props.currentTime/this.props.duration)
        };

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            thumbPos: (nextProps.currentTime/nextProps.duration)
        })
    }

    render() {
        return(
            <View style={{width: 920, height: 8, top: -250}}>
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'gray'}}>
                <Animated.View style={{ flex: this.state.thumbPos, flexDirection: 'column', height: 8, backgroundColor: '#DF1D46'}}/>
                <TouchableHighlight
                    style={styles.thumb}
                    underlayColor='#fff'>
                    <Image source={{uri: "res://drawable/default/Scrubber-Thumb.png"}}
                    style={styles.thumb}/>
                </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    thumb: {
        width:23,
        height:23,
        top: -4
      },
})

export default Scrubber
