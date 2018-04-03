import React, { Component } from 'react';
import {
  View
} from 'react-native';
import {
  TimelineRef,
} from 'react-native-youi';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.resolve;
    this.ref;
  }

  render() {
    return (
      <TimelineRef
        name={this.props.name}
        onLoad={(timeline) => { this.ref = timeline }}
        onCompleted={() => { this.resolve("onCompleted"); console.log(this.props.name + " timeline finished") }} />
    )
  }

  play = () => new Promise((resolve, reject) => { this.resolve = resolve; console.log(this.props.name + " timeline started"); this.ref.play() });
}

export default Timeline
