import React, { RefObject, createRef, Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { ImageRef, ViewRef, TextRef, ButtonRef } from '@youi/react-native-youi';

import { getDetailsByIdAndType } from './../../actions/tmdbActions';
import { VideoContext, VideoContextType } from './context';
import { Asset, AssetType } from './../../adapters/asset';
import { Timeline } from './../timeline';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { getVideoSourceByYoutubeId } from '../../actions/youtubeActions';
import { AdContextConsumer, AdState, AdContextType } from '../adManager/context';

interface PauseScreenManagerProps extends NavigationInjectedProps {
  related: Asset[];
  getDetailsByIdAndType: (id: string, type: AssetType) => void;
  getVideoSourceByYoutubeId: (youtubeId: string) => void;
  onClosed: () => void;
}

class PauseScreenManager extends Component<PauseScreenManagerProps> {
  static contextType = VideoContext;
  context!: VideoContextType;
  adContext!: AdContextType;

  private END_SQUEEZE_MS = 15 * 1000;

  private endSqueezeCompressTimeline: RefObject<Timeline> = createRef();

  private endSqueezeExpandTimeline: RefObject<Timeline> = createRef();

  constructor(props: PauseScreenManagerProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: PauseScreenManagerProps) {
    if (nextProps.related !== this.props.related) return true;

    return false;
  }

  componentDidUpdate() {
    const { currentTime, duration, isLive, paused, scrubbingEngaged } = this.context;

    if (isLive) return;

    if (paused && scrubbingEngaged) return;

    if (duration && currentTime && duration - currentTime < this.END_SQUEEZE_MS) {
      this.context.setIsEnding(true);
      this.compressVideo();
    } else if (this.context.paused) {
      this.context.setIsEnding(true);
      this.compressVideo();
    } else {
      this.context.setIsEnding(false);
      this.expandVideo();
    }
  }

  compressVideo = () => {
    if (this.context.isCompressed || this.adContext.takeLowerAdState() === AdState.shown) return;

    this.context.setIsCompressed(true);
    this.endSqueezeCompressTimeline.current?.play();
  };

  expandVideo = async () => {
    if (!this.context.isCompressed || this.adContext.getIsAdCaptivated()) return;

    await this.endSqueezeExpandTimeline.current?.play();

    this.context.setIsCompressed(false);
  };

  playOnNext = async (asset: Asset) => {
    this.props.getDetailsByIdAndType(asset.id.toString(), asset.type);

    this.props.getVideoSourceByYoutubeId(asset.youtubeId);
  };

  renderUpNextButton = (upNext: Asset) => {
    if (upNext == null) {
      return <ButtonRef name="Button-UpNext-Primary" visible={false} focusable={false} />;
    }

    const backdropImage =
      upNext.thumbs && upNext.thumbs.Backdrop ? (
        <ImageRef name="Image-UpNext-Primary" source={{ uri: upNext.thumbs.Backdrop }} />
      ) : null;

    return (
      <ButtonRef
        name="Button-UpNext-Primary"
        onPress={() => this.playOnNext(upNext)}
        focusable={this.context.isCompressed}
      >
        {backdropImage}
        <TextRef name="Title" text={upNext.title} />
        <TextRef name="Subhead" text={upNext.releaseDate} />
        <TextRef name="Duration" text={'45m'} />
      </ButtonRef>
    );
  };

  render() {
    const { related } = this.props;
    const { currentTime, duration } = this.context;

    const upnext = related[0];
    const timerText = duration && currentTime ? Math.floor((duration - currentTime) / 1000) : '';
    const isTimerVisible = duration && currentTime ? duration - currentTime < this.END_SQUEEZE_MS : false;

    return (
      <AdContextConsumer>
        {(adContext) => {
          this.adContext = adContext;
          if (adContext.takePauseAdState() === AdState.closed) {
            this.props.onClosed();
          }

          return (
            <Fragment>
              <ImageRef name="Image-Background" visible={!adContext.pauseAdEnabled} />
              <Timeline name="EndSqueeze-Compress" ref={this.endSqueezeCompressTimeline} />
              <Timeline name="EndSqueeze-Expand" ref={this.endSqueezeExpandTimeline} />

              <ViewRef name="UpNext-Countdown" visible={upnext != null}>
                <TextRef visible={isTimerVisible} name="Timer" text={timerText.toString()} />
              </ViewRef>

              {this.renderUpNextButton(upnext)}
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(PauseScreenManager));
