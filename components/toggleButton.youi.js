import React, { PureComponent } from 'react';
import { ButtonRef } from '@youi/react-native-youi';
import { Timeline } from '.';

export default class ToggleButton extends PureComponent {
  static defaultProps = {
    buttonRef: () => {},
    onFocus: () => {},
    onToggle: () => {},
    onPress: () => {},
  }

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
        this.props.buttonRef(ref);
        this.ref = ref;
      }}
      onFocus={() => this.props.onFocus(this.ref)}
      onPress={() => {
        if (this.state.toggled && this.props.isRadio) return;

        this.props.onPress();
        this.props.onToggle(this.props.index);

        this.setState({
          toggled: !this.state.toggled,
        });
      }}
    >
      <Timeline
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
