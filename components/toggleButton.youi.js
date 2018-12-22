import React, { PureComponent } from 'react';
import { ButtonRef } from '@youi/react-native-youi';
import { Timeline } from '.';
import PropTypes from 'prop-types';

export default class ToggleButton extends PureComponent {
  static defaultProps = {
    ref: () => {},
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
        this.props.ref(ref);
        this.ref = ref;
      }}
      onFocus={() => this.props.onFocus(this.ref)}
      onPress={() => {
        if (this.state.toggled && this.props.isRadio) return;

        this.props.onPress(this.props.index);
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

ToggleButton.propTypes = {
  name: PropTypes.string.isRequired,
  focusable: PropTypes.bool,
  toggled: PropTypes.bool,
  isRadio: PropTypes.bool,
  onFocus: PropTypes.func,
  onPress: PropTypes.func,
  onToggle: PropTypes.func,
  ref: PropTypes.func,
  index: PropTypes.number,
};
