import React, { Component } from 'react';
import {
  ButtonRef,
  TimelineRef
} from '@youi/react-native-youi';

export default class ToggleButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toggled: props.index == 0
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.props.toggled !== prevProps.toggled) {
      if (this.props.toggled)
        this.toggleOnTimeline.play()
      else
        this.toggleOffTimeline.play()
    }
  }

  render() {
    return (
      <ButtonRef
        name={this.props.name}
        ref={ref => this.ref = ref}
        onPress={() => {
          this.props.onToggle(this.props.index);
          this.setState({
            toggled: !this.state.toggled
          })
          if (this.state.toggled) {
            this.toggleOffTimeline.play()
          } else {
            this.toggleOnTimeline.play()
          }
        }}
      >
        <TimelineRef name="Toggle-On" ref={ref => this.toggleOnTimeline = ref} onLoad={() => {
          if (this.state.toggled) {
            this.toggleOnTimeline.play();
          }
        }}/>
        <TimelineRef name="Toggle-Off" ref={ref => this.toggleOffTimeline = ref} />

      </ButtonRef>
    )
  }

}
