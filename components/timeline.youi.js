import React, { PureComponent } from 'react';
import { TimelineRef } from '@youi/react-native-youi';

export default class Timeline extends PureComponent {
  static defaultProps = {
    onLoad: () => {},
    onCompleted: () => {},
  }

  render() {
    return (
      <TimelineRef
        {...this.props}
        onLoad={timeline => {
          this.ref = timeline;
          this.props.onLoad(this);
        }}
        loop={this.props.loop || this.props.name.toLowerCase() === 'loop'}
        onCompleted={() => {
          if (this.resolve && !this.props.loop)
            this.resolve('onCompleted');

          this.props.onCompleted();
        }}
      />
    );
  }

  play = (seek = 0) => new Promise(resolve => {
    this.resolve = resolve;
    if (seek)
      this.ref.seek(seek);
    else
      this.ref.play();
  });

  stop = () => new Promise(resolve => {
    this.resolve = resolve;
    this.ref.stop();
  });
}
