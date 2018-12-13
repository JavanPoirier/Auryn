import React from 'react';
import ToggleButton from './toggleButton.youi';

export default class ToggleGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggles: [true].concat(new Array(this.props.buttons.length - 1).fill(false)),
    };
    this.buttonRefs = [];
  }

  onToggle = index =>
    this.setState({
      toggles: this.props.buttons.map((_, i) => i === index),
    })

  getButtonRef = index => this.buttonRefs[index]

  render = () =>
    this.props.buttons.map((button, index) =>
      <ToggleButton
        key={index}
        focusable={this.props.focusable}
        index={index}
        onToggle={this.onToggle}
        name={button.name}
        onPress={button.onPress}
        toggled={this.state.toggles[index]}
        isRadio={true}
        buttonRef={ref => this.buttonRefs[index] = ref}
      />)
}
