import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Button,
    BackHandler
  } from 'react-native';
  import {
    ButtonRef,
    Composition,
    TextRef,
    TimelineRef,
    ViewRef,
    TouchableHighlight,
    Image
  } from 'react-native-youi';

class VideoButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
          container: props.container,
          button: props.button,
          click: props.onClick
        };
    }

    render() {
        return (
            <ViewRef name={this.state.container}>
                <TimelineRef name="In"
                    onLoad={(timeline) => {
                    this.inTimeline = timeline;
                    timeline.play();
                }}/>
                <ButtonRef
                    name={this.state.button}
                    onClick={() => {
                    this.setState({paused: !this.state.paused})
                    this.focusInTimeline.play();
                    if (this.state.paused)
                        this.toggleOnTimeline.play();
                    else
                    this.toggleOffTimeline.play();
                    }}>
                    <TimelineRef name="Toggle-On"
                    onLoad={(timeline) => {
                        this.toggleOnTimeline=timeline;
                        if (this.state.paused)
                        timeline.play();
                    }}/>
                    <TimelineRef name="FocusIn"
                    onLoad={(timeline) => {
                        this.focusInTimeline=timeline;
                        if (!this.state.paused)
                        timeline.play();
                    }}/>
                    <TimelineRef name="Toggle-Off"
                    onLoad={(timeline) => {
                        this.toggleOffTimeline=timeline;
                    }}/>
                </ButtonRef>
            </ViewRef>
        )
    }
}

export default VideoButton
