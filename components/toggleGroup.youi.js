import React from 'react';
import ToggleButton from './toggleButton.youi';

export default class ToggleGroup extends React.Component {
  constructor(props) {
    super(props);
    const toggles = new Array(this.props.buttons.length).fill(false);
    toggles[0] = true;
    this.state = {
      toggles,
    };
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(index) {
    const toggles = new Array(this.props.buttons.length).fill(false);
    toggles[index] = true;
    this.setState({
      toggles,
    });
  }

  render = () =>
    this.props.buttons.map((button, index) =>
      <ToggleButton
        key={index}
        focusable={this.props.focusable}
        index={index}
        onToggle={this.onToggle}
        name={button.name}
        onPress={button.action}
        toggled={this.state.toggles[index]}
      />)
}
