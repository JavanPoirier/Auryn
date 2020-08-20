import React, { RefObject, createRef, PureComponent, Component } from 'react';
import { Composition, ButtonRef, FocusManager, FormFactor, VideoRef, ViewRef } from '@youi/react-native-youi';
import { BackHandler, View } from 'react-native';
import {
  NavigationFocusInjectedProps,
  withNavigationFocus,
  NavigationInjectedProps,
  withNavigation,
} from 'react-navigation';

import { Timeline } from '../timeline';
import { AurynHelper } from '../../aurynHelper';
import { fromApi } from '../../adapters/dummyAdapter';
import { ListItemFocusEvent } from '../listitem';
import { RotationMode, withOrientation, OrientationLock } from '../withOrientation';

const dummyAsset = fromApi(false);

interface AdListItemProps extends NavigationInjectedProps {
  onFocus?: ListItemFocusEvent;
  focusable?: boolean;
}

interface AdListItemState {
  ad: TileAd;
}

type TileAd = {
  campaign: string;
  tileCompositionName: string;
  tileButtonName: string;
  overlayCompositionName: string;
};

class AdListItemComponent extends Component<AdListItemProps, AdListItemState> {
  static defaultProps = {
    onFocus: () => {},
    focusable: true,
  };

  availableAds: Array<TileAd> = [
    {
      campaign: 'VAWAA',
      tileCompositionName: 'Example-ListEmbeddedAd_Container-Btn-Ad-Small-VAWAA',
      tileButtonName: 'Btn-Backdrop-Ad-VAWAA',
      overlayCompositionName: 'Example-ListEmbeddedAd_Ad-VAWAA',
    },
  ];

  buttonRef: RefObject<ButtonRef> = createRef();

  constructor(props: AdListItemProps) {
    super(props);

    this.state = {
      ad: this.availableAds[Math.floor(Math.random() * this.availableAds.length)],
    };
  }

  handleOnFocus = () => this.props.onFocus && this.props.onFocus(dummyAsset, this.buttonRef);
  handleOnPress = () => this.props.navigation.navigate('AdOverlay', { name: this.state.ad.overlayCompositionName });

  render() {
    const { focusable } = this.props;
    const { tileCompositionName, tileButtonName } = this.state.ad;

    return (
      <Composition source={tileCompositionName}>
        <ButtonRef
          ref={this.buttonRef}
          name={tileButtonName}
          focusable={focusable}
          onFocus={this.handleOnFocus}
          onPress={this.handleOnPress}
        />
      </Composition>
    );
  }
}

interface AdOverlayScreenProps extends NavigationFocusInjectedProps, OrientationLock {}

class AdOverlayScreen extends PureComponent<AdOverlayScreenProps> {
  private focusListener: any;
  private blurListener: any;

  private inTimeline = React.createRef<Timeline>();
  private outTimeline = React.createRef<Timeline>();
  private closeButton = React.createRef<ButtonRef>();
  private video = React.createRef<VideoRef>();
  private imageToVideoTimeline = React.createRef<Timeline>();

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    });
    this.blurListener = this.props.navigation.addListener('didBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', this.navigateBack),
    );

    FocusManager.focus(this.closeButton.current);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack);
  }

  navigateBack = async () => {
    this.inTimeline.current?.play(1);

    await this.outTimeline.current?.play();

    this.video.current?.stop();

    AurynHelper.isRoku ? this.props.navigation.navigate({ routeName: 'Lander' }) : this.props.navigation.goBack(null);

    if (FormFactor.isHandset) this.props.setRotationMode(RotationMode.Portrait);

    return true;
  };

  onVideoReady = () => {
    this.video.current?.play();
    // setTimeout(this.imageToVideoTimeline.current?.play, 3000);
  };

  render = () => {
    if (!this.props.isFocused) return <View />;

    const name = this.props.navigation.getParam('name');

    return (
      <Composition source={name}>
        <Timeline name="In" ref={this.inTimeline} autoplay />
        <Timeline name="Out" ref={this.outTimeline} />
        <ViewRef name="Video-Surface-Container">
          <Timeline name="ImageToVideo" ref={this.imageToVideoTimeline} />
        </ViewRef>
        <ViewRef name="Image-Video-Placeholder" visible={false}></ViewRef>
        <ViewRef name="White Solid 25" visible={AurynHelper.isRoku} />
        <ButtonRef
          name="Btn-Close"
          onPress={this.navigateBack}
          focusable={this.props.isFocused}
          ref={this.closeButton}
        />
        <VideoRef
          name="Video-Surface"
          ref={this.video}
          onReady={this.onVideoReady}
          source={{
            type: 'HLS',
            uri: 'https://stream.mux.com/pnujyskTQ02jB9TqZ4RAw1zkcuDAPJa6t.m3u8',
            startTimeMs: 9000,
          }}
          muted
          metadata={{ mute: true }}
        />
      </Composition>
    );
  };
}

const AdOverlay = withOrientation(withNavigationFocus(AdOverlayScreen), RotationMode.Landscape);
const AdListItem = withNavigation(AdListItemComponent);

export { AdListItem, AdOverlay };
