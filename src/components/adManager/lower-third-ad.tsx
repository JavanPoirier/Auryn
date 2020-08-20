import React, { Component, RefObject } from 'react';
import { Composition } from '@youi/react-native-youi';

import { Timeline } from './../timeline';
import { VideoContext } from './../videoPlayer/index';
import { VideoContextType } from '../videoPlayer/context';
import { View } from 'react-native';
import { AurynHelper } from '../../aurynHelper';
import { AdContextConsumer, AdState, AdContextType } from './context';

interface Props {
  name: string;
  onClose: () => void;
}

export interface LowerThirdAdsTimelines {
  in: RefObject<Timeline>;
  out: RefObject<Timeline>;
}

const initialState = {
  isShowing: false,
  hasShown: false,
};

const ads = [
  {
    name: 'Example-PlayerLowerThirdAd_Ad6',
    duration: 6000,
  },
];

class LowerThirdAd extends Component<Props> {
  static contextType = VideoContext;
  context!: VideoContextType;
  adContext!: AdContextType;

  static defaultProps = {
    name: '',
  };

  composition = ads[Math.floor(Math.random() * ads.length)];

  private adTimeline = React.createRef<Timeline>();

  state = initialState;

  delayTimeout!: NodeJS.Timeout;

  shouldComponentUpdate() {
    return false;
  }

  public getIsShowing = () => this.state.isShowing;

  public showAd = async () => {
    if (!this.canShowAd()) return;

    if (this.context.paused) {
      this.delayTimeout = setTimeout(this.showAd, 5000);
      return;
    }

    this.setState({ isShowing: true });
    this.adContext.setLowerAdState(AdState.shown);
    if (AurynHelper.isRoku) {
      this.adTimeline.current?.play();
      setTimeout(this.stopAd, this.composition.duration + 300);
    } else {
      await this.adTimeline.current?.play();
      this.stopAd();
    }
  };

  componentDidMount() {
    const timeout = AurynHelper.isRoku ? 15000 : 10000;
    this.delayTimeout = setTimeout(this.showAd, timeout);
  }

  componentWillUnmount() {
    clearTimeout(this.delayTimeout);
  }

  canShowAd = () => {
    if (this.adContext.getIsAdCaptivated()) return false;

    return !this.context.isLive || !this.context.paused || !this.state.isShowing;
  };

  stopAd = () => {
    this.setState({ showing: false, hasShown: true });
    this.adContext.setLowerAdState(AdState.closed);
  };

  render() {
    return (
      <AdContextConsumer>
        {(adContext) => {
          this.adContext = adContext;
          return (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                opacity: this.context.isLive || !this.state.isShowing ? 0 : 1,
              }}
            >
              {!this.state.hasShown ? (
                <Composition source={this.composition.name}>
                  <Timeline name="Animation" ref={this.adTimeline} />
                </Composition>
              ) : null}
            </View>
          );
        }}
      </AdContextConsumer>
    );
  }
}

export default LowerThirdAd;
