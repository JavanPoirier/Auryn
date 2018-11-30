import React, { Component } from 'react';
import {
  ButtonRef,
  TimelineRef,
} from '@youi/react-native-youi';

export default class ToggleButton extends React.PureComponent {
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
      ref={ref => {
        if (this.props.ref)
          this.props.ref(ref);
        this.ref = ref;
      }}
      onPress={() => {
        if (this.state.toggled && this.props.isRadio) return;

        if (this.props.onPress)
          this.props.onPress();

        if (this.props.onToggle)
          this.props.onToggle(this.props.index);

        this.setState({
          toggled: !this.state.toggled,
        });
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
