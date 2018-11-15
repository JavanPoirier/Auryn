import React, { Component } from 'react';
import {
  ButtonRef,
  TimelineRef,
} from '@youi/react-native-youi';

export default class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: props.index === 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.toggled !== prevProps.toggled) {
      this.setState({
        toggled: this.props.toggled,
      }, this.toggleOnTimeline.play);
    }
  }

  render = () =>
    <ButtonRef
      focusable={this.props.focusable}
      name={this.props.name}
      ref={ref => this.ref = ref}
      onPress={() => {
        if (this.state.toggled) return;
        console.log(this.props.onPress);
        this.props.onPress();
        this.props.onToggle(this.props.index);
        this.setState({
          toggled: !this.state.toggled,
        }, this.toggleOnTimeline.play);
      }}
    >
      <TimelineRef
        name="Toggle-On"
        direction={this.state.toggled ? 'forward' : 'reverse'}
        ref={ref => this.toggleOnTimeline = ref}
        onLoad={() => {
          if (this.state.toggled)
            this.toggleOnTimeline.play();
        }}
      />

    </ButtonRef>
}
