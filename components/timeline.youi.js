import React, { Component } from 'react';
import { TimelineRef } from '@youi/react-native-youi';

export default class Timeline extends Component {
  render = () => (
    <TimelineRef
      {...this.props}
      onLoad={(timeline) => { this.ref = timeline; if (this.props.onLoad) this.props.onLoad(timeline); }}
      loop={this.props.loop || this.props.name.toLowerCase() == 'loop'}
      onCompleted={() => {
        if (this.resolve && !this.props.loop) {
          this.resolve("onCompleted");
        }

        if (this.props.loop) {
          this.timeline.play();
        }

        if (this.props.onCompleted) {
          this.props.onCompleted();
        }
      }}
    />
  );

  play = () => new Promise((resolve, reject) => { this.resolve = resolve; this.ref.play(); });
}
