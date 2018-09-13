import React, { Component } from 'react';
import ToggleButton from './toggleButton.youi';

export default class ToggleGroup extends React.Component {
  constructor(props) {
    super(props)
    let toggles = new Array(this.props.buttons.length).fill(false)
    toggles[0] = true;
    this.state = {
      toggles: toggles
    }
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle(index) {
    let toggles = new Array(this.props.buttons.length).fill(false)
    toggles[index] = true;
    this.setState({
      toggles: toggles
    })
  }

  render() {
    let nav = []
    this.props.buttons.forEach((it, index) => nav.push(<ToggleButton focusable={this.props.focusable} index={index} onToggle={this.onToggle} name={it.name} onPress={it.action} toggled={this.state.toggles[index]} />))
    return (
      [nav]
    )
  }

}
