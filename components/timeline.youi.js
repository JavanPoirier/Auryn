import React, { Component } from 'react';
import { TimelineRef } from '@youi/react-native-youi';

export default class Timeline extends Component {
  render = () => (
    <TimelineRef
      name={this.props.name}
      onLoad={(timeline) => { this.ref = timeline; if (this.props.onLoad) this.props.onLoad(timeline); }}
      loop={this.props.loop || this.props.name.toLowerCase() == 'loop'}
      onCompleted={() => {
        if (this.resolve && !this.props.loop) {
          this.resolve("onCompleted");
        }

        if (this.props.loop) {
          this.timeline.play();
        }
      }}
    />
  );

  play = () => new Promise((resolve, reject) => { this.resolve = resolve; this.ref.play(); });
}
