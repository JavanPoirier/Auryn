import React, { Component } from 'react';
import ToggleButton from './toggleButton.youi';

export default class ToggleGroup extends React.Component {
  constructor(props) {
    super(props)
    let toggles = new Array(this.props.names.length).fill(false)
    toggles[0] = true;
    this.state = {
      toggles: toggles
    }
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle(index) {
    let toggles = new Array(this.props.names.length).fill(false)
    toggles[index] = true;
    this.setState({
      toggles: toggles
    })
  }

  render() {
    let nav = []
    this.props.names.forEach((it, index) => nav.push(<ToggleButton index={index} onToggle={this.onToggle} name={it} toggled={this.state.toggles[index]} />))
    return (
      [nav]
    )
  }

}
