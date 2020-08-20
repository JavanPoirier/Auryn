import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { getDetailsByIdAndType } from './../../actions/tmdbActions';
import { VideoContext, VideoContextType } from './context';
import { Asset, AssetType } from './../../adapters/asset';
import { Timeline } from './../timeline';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { getVideoSourceByYoutubeId } from '../../actions/youtubeActions';
import { AdContextConsumer, AdState } from '../adManager/context';

interface LowerThirdManagerProps extends NavigationInjectedProps {
  related: Asset[];
  getDetailsByIdAndType: (id: string, type: AssetType) => void;
  getVideoSourceByYoutubeId: (youtubeId: string) => void;
  onClosed: () => void;
}

class LowerThirdManager extends Component<LowerThirdManagerProps> {
  static contextType = VideoContext;
  context!: VideoContextType;

  private lowerThirdInTimeline = React.createRef<Timeline>();

  private lowerThirdOutTimeline = React.createRef<Timeline>();

  compressVideo = () => {
    if (this.context.isCompressed || this.context.isLive) return;

    this.context.setIsCompressed(true);
    this.lowerThirdInTimeline.current?.play();
  };

  expandVideo = async () => {
    if (!this.context.isCompressed || this.context.isLive) return;

    await this.lowerThirdOutTimeline.current?.play();

    this.context.setIsCompressed(false);
  };

  render() {
    return (
      <AdContextConsumer>
        {(adContext) => {
          if (adContext.takeLowerAdState() === AdState.closed) {
            this.expandVideo();
          }

          if (adContext.takeLowerAdState() === AdState.shown) {
            this.compressVideo();
          }

          return (
            <Fragment>
              <Timeline name="Squeeze" ref={this.lowerThirdInTimeline} />
              <Timeline name="Stretch" ref={this.lowerThirdOutTimeline} />
            </Fragment>
          );
        }}
      </AdContextConsumer>
    );
  }
}

const mapStateToProps = () => {};

const mapDispatchToProps = {
  getDetailsByIdAndType,
  getVideoSourceByYoutubeId,
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(LowerThirdManager));
