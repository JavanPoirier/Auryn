import React, { Component } from 'react';
import { TimelineRef } from '@youi/react-native-youi';

export default class Timeline extends Component {
  render = () => (
    <TimelineRef
      name={this.props.name}
      onLoad={(timeline) => { this.ref = timeline; if (this.props.onLoad) this.props.onLoad(timeline); }}
      onCompleted={() => { if (this.resolve) this.resolve("onCompleted"); }}
    />
  );

  play = () => new Promise((resolve, reject) => { this.resolve = resolve; this.ref.play(); });
}
