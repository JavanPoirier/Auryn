import React, { Fragment } from 'react';

import { View, BackHandler } from 'react-native';
import { ListRef, ListItem, ViewRef, FocusManager, ButtonRef, VideoUriSource } from '@youi/react-native-youi';
import { connect } from 'react-redux';
import { Timeline, LiveListItem } from '..';
import { AurynAppState } from '../../reducers';
import { ListItemPressEvent } from '../listitem';
import { VideoContext, VideoContextType } from './context';
import { Asset } from '../../adapters/asset';
import { getDetailsByIdAndType } from '../../actions/tmdbActions';
import { getVideoSourceByYoutubeId } from '../../actions/youtubeActions';
import { AurynHelper } from '../../aurynHelper';

type MiniGuideDispatchProps = typeof mapDispatchToProps;

interface MiniGuideProps extends MiniGuideDispatchProps {
  liveData: Asset[];
  asset: Asset;
  visible: boolean;
  onPressItem: ListItemPressEvent;
  onOpen: () => void;
  onClose: () => void;
}

const initialState = {
  channelId: 'weather1',
  isOpen: false,
};

class MiniGuideComponent extends React.Component<MiniGuideProps> {
  static contextType = VideoContext;
  context!: VideoContextType;

  miniGuideCloseButtonRef = React.createRef<ButtonRef>();

  showGuideTimeline = React.createRef<Timeline>();

  hideGuideTimeline = React.createRef<Timeline>();

  firstListItem = React.createRef<LiveListItem>();

  state = initialState;

  componentDidMount() {
    if (this.miniGuideCloseButtonRef.current) {
      AurynHelper.togglePointerEvents(this.miniGuideCloseButtonRef.current, false);
    }
  }

  componentWillUnmount() {
    if (this.state.isOpen) this.hide();
  }

  navigateBack = () => {
    if (this.state.isOpen) {
      this.hide();
      return true;
    }

    return false;
  };

  show = async () => {
    if (this.state.isOpen) return;
    BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    this.setState({ isOpen: true });
    this.context.setMiniGuideOpen(true);
    AurynHelper.togglePointerEvents(this.miniGuideCloseButtonRef.current, true);
    await this.showGuideTimeline.current?.play();
    this.props.onOpen?.();
    if (this.firstListItem.current) FocusManager.focus(this.firstListItem.current);
  };

  hide = async () => {
    if (!this.state.isOpen) return;
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack);
    this.props.onClose?.();
    this.setState({ isOpen: false });
    this.context.setMiniGuideOpen(false);
    AurynHelper.togglePointerEvents(this.miniGuideCloseButtonRef.current, false);
    await this.hideGuideTimeline.current?.play();
  };

  openMiniGuide = () => {
    this.state.isOpen ? this.hide() : this.show();
  };

  onPressItem: ListItemPressEvent = (asset: Asset) => {
    this.props.onPressItem?.(asset);

    if (asset.id === this.props.asset.id) return;

    const source =
      asset.live?.streams[0].uri === this.context.videoSource?.uri ? asset.live?.streams[1] : asset.live?.streams[0];
    this.props.getDetailsByIdAndType(asset.id, asset.type);
    this.props.getVideoSourceByYoutubeId(asset.youtubeId);
    this.context.setVideoSource(source as VideoUriSource);

    this.hide();
  };

  renderLiveItem = ({ item, index }: ListItem<Asset>) => (
    <View style={{ marginBottom: 20 }}>
      <LiveListItem
        onPress={this.onPressItem}
        data={item}
        focusable={this.state.isOpen}
        ref={index === 0 ? this.firstListItem : null}
        shouldChangeFocus={false}
        style={{ marginTop: index === 0 ? 60 : 0 }}
      />
    </View>
  );

  render() {
    return (
      <Fragment>
        <ButtonRef
          name="Btn-MiniGuide"
          onPress={this.openMiniGuide}
          visible={this.context.isLive}
          focusable={!this.context.miniGuideOpen}
        />

        <ViewRef name="Live-MiniGuide" visible={this.context.isLive}>
          <Timeline name="ShowGuide" ref={this.showGuideTimeline} />
          <Timeline name="HideGuide" ref={this.hideGuideTimeline} />
          <ListRef
            name="Live-MiniGuide-List"
            data={this.props.liveData}
            renderItem={this.renderLiveItem}
            extraData={this.state.isOpen}
          />
          <ButtonRef name="Btn-MiniGuide-Close" onPress={this.hide} ref={this.miniGuideCloseButtonRef} />
        </ViewRef>
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  getDetailsByIdAndType,
  getVideoSourceByYoutubeId,
};

const mapStateToProps = (store: AurynAppState) => ({
  liveData: store.tmdbReducer.live.data,
});

export const MiniGuide = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  MiniGuideComponent as any,
);
