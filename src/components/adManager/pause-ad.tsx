import React, { Component, createRef, RefObject } from 'react';
import { Composition, ButtonRef } from '@youi/react-native-youi';

import { Timeline } from './../timeline';
import { VideoContext } from './../videoPlayer/index';
import { VideoContextType } from '../videoPlayer/context';
import { View } from 'react-native';
import { AdContextType, AdContextConsumer, AdState } from './context';

interface Props {
  name: string;
  onClose: () => void;
}

interface State {
  isShowing: boolean;
}

class PauseAd extends Component<Props, State> {
  static contextType = VideoContext;
  context!: VideoContextType;
  adContext!: AdContextType;

  static defaultProps = {
    name: '',
  };

  private adInTimeline: RefObject<Timeline> = createRef();
  private adOutTimeline: RefObject<Timeline> = createRef();

  constructor(props: Props) {
    super(props);

    this.state = { isShowing: false };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate() {
    const { mediaState, playbackState, scrubbingEngaged, isEnding } = this.context;

    if (mediaState !== 'ready') return;

    if (scrubbingEngaged) return;

    if (isEnding) {
      this.showAd();
    } else if (playbackState === 'paused') {
      this.showAd();
    } else if (playbackState === 'playing') {
      this.hideAd();
    }
  }

  public getIsShowing = () => this.state.isShowing;

  public showAd = () => {
    if (this.state.isShowing || this.adContext.takeLowerAdState() === AdState.shown) return;

    this.setState({ isShowing: true });
    this.adContext.setPauseAdState(AdState.shown);
    this.adInTimeline.current?.play();
  };

  public hideAd = (adState: AdState = AdState.hidden) => {
    if (!this.state.isShowing) return;

    this.setState({ isShowing: false });
    this.adOutTimeline.current?.play();
    this.adContext.setPauseAdState(adState);
  };

  onCloseClick = () => {
    this.hideAd(AdState.closed);

    this.props.onClose();
  };

  render() {
    const { name } = this.props;

    return (
      <AdContextConsumer>
        {(adContext) => {
          this.adContext = adContext;

          return (
            <View style={{ position: 'absolute', opacity: this.context.isLive || !this.state.isShowing ? 0 : 1 }}>
              <Composition source={name}>
                <Timeline name="Animation" ref={this.adInTimeline} />
                <Timeline name="Out" ref={this.adOutTimeline} />
                <ButtonRef
                  name="Btn-Close"
                  onPress={this.onCloseClick}
                  focusable={this.state.isShowing && !this.context.isLive}
                />
              </Composition>
            </View>
          );
        }}
      </AdContextConsumer>
    );
  }
}

export default PauseAd;
