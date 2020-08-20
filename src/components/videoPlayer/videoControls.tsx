/* eslint-disable max-lines-per-function */

import React, { RefObject } from 'react';
import {
  ViewRef,
  TextRef,
  SliderRef,
  FocusManager,
  Input,
  InputEventObject,
  ButtonRef,
  VideoRef,
  FormFactor,
} from '@youi/react-native-youi';
import { BackButton, Timeline, ToggleButton } from './../index';
import { debounce } from 'lodash';
import { Asset } from './../../adapters/asset';
import { VideoContext, VideoContextType } from './context';
import { MiniGuide } from './miniGuide';
import { LiveListItem } from '../liveListitem';
import { connect } from 'react-redux';
import { AurynAppState } from '../../reducers';

interface PlayerControlProps {
  liveData: Asset[];
  isFocused?: boolean;
  isLive?: boolean;
  asset: Asset;
  videoPlayerRef: RefObject<VideoRef>;
  onBackButton: () => void;
}

interface PlayerControlState {
  controlsActive: boolean;
  pausedByScrubbing: boolean;
}

const mediaKeys = ['Space', 'Play', 'MediaPlay', 'MediaPlayPause'];

const keys = [
  'Enter',
  'Select',
  'PageDown',
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUpLeft',
  'ArrowUpRight',
  'ArrowDownLeft',
  'ArrowUpRight',
];

const MIN_DURATION = 3000;

class VideoControlsComponent extends React.Component<PlayerControlProps, PlayerControlState> {
  static contextType = VideoContext;
  context!: VideoContextType;

  state = {
    controlsActive: false,
    pausedByScrubbing: false,
  };

  private controlsHideTimeline = React.createRef<Timeline>();

  private controlsShowTimeline = React.createRef<Timeline>();

  private playButton = React.createRef<ToggleButton>();

  componentDidMount() {
    keys.concat(mediaKeys).forEach((key) => Input.addEventListener(key, this.registerUserActivity));
  }

  componentWillUnmount() {
    this.onScrub.cancel();
    this.debounceHidingControls.cancel();
    keys.concat(mediaKeys).forEach((key) => Input.removeEventListener(key, this.registerUserActivity));
  }

  componentDidUpdate() {
    if (this.context.miniGuideOpen && this.state.controlsActive) {
      this.debounceHidingControls.cancel();
      this.hideControls();
    }
  }

  playPause = () => {
    if (this.context.isLive) return;

    this.context.paused ? this.props.videoPlayerRef.current?.play() : this.props.videoPlayerRef.current?.pause();

    if (!this.context.paused) {
      this.context.setScrubbingEngaged(false);
    }
  };

  showControls = () => {
    this.setState({ controlsActive: true });

    if (this.playButton.current) FocusManager.focus(this.playButton.current);

    this.controlsShowTimeline.current?.play();
  };

  hideControls = () => {
    if (!this.context.isLive && this.playButton.current) FocusManager.focus(this.playButton.current);

    this.controlsHideTimeline.current?.play();
    this.setState({ controlsActive: false });
  };

  registerUserActivity = (keyEvent?: InputEventObject) => {
    if (keyEvent) {
      if (mediaKeys.includes(keyEvent.keyCode) && keyEvent.eventType === 'up') this.playPause();
    }

    if (!this.state.controlsActive && !this.context.miniGuideOpen) {
      this.showControls();
      this.debounceHidingControls();
    }
  };

  seekAndResume = (time: number) => {
    if (this.context.mediaState !== 'ready') return;
    this.props.videoPlayerRef.current?.seek(time);

    if (!this.state.pausedByScrubbing) return;

    this.props.videoPlayerRef.current?.play();

    this.setState({ pausedByScrubbing: false });
  };

  onScrub = debounce((value: number) => {
    if (value === this.context.currentTime) return;

    this.context.setScrubbingEngaged(true);

    if (!this.context.paused) {
      this.setState({ pausedByScrubbing: true });
      this.props.videoPlayerRef.current?.pause();
    }

    this.seekAndResume(value);

    this.debounceHidingControls();
  }, 100);

  onSlidingComplete = (value: number) => {
    this.context.setScrubbingEngaged(false);

    if (this.context.duration && this.context.duration <= MIN_DURATION) return;

    this.props.videoPlayerRef.current?.seek(value);
  };

  debounceHidingControls = debounce(this.hideControls, 5000);

  render() {
    const { asset, isFocused } = this.props;
    const { duration } = this.context;

    const isSliderVisible = duration && duration > MIN_DURATION ? true : false;

    return (
      <ButtonRef name="Video" onPress={this.registerUserActivity} visible={isFocused}>
        {this.props.children}
        <ViewRef name="Player-Controls">
          <BackButton focusable={isFocused} onPress={this.props.onBackButton} />
          <Timeline name="Show" ref={this.controlsShowTimeline} />
          <Timeline name="Hide" ref={this.controlsHideTimeline} />
          <Timeline name="Set-Live" playOnTrue={this.state.controlsActive && this.context.isLive} />

          <ToggleButton
            name="Btn-PlayPause"
            onPress={this.playPause}
            toggled={!this.context.paused || this.state.pausedByScrubbing}
            focusable={!this.context.isLive}
            ref={this.playButton}
            visible={this.state.controlsActive && !this.context.isLive}
          />
          <ViewRef name="Player-Scrubber-Container">
            <TextRef name="Duration" text={this.context.formattedTime} visible={!this.context.isLive} />
            <SliderRef
              visible={isSliderVisible}
              name="Bar"
              minimumTrackTintColor="#DA1B5B"
              maximumValue={this.context.duration}
              value={this.context.currentTime}
              thumbImage={{ uri: 'res://drawable/default/Player-Thumb.png' }}
              onSlidingComplete={this.onSlidingComplete}
              onValueChange={this.onScrub}
              step={1}
            />
          </ViewRef>
          <MiniGuide asset={this.props.asset} />

          <ButtonRef name="Btn-MiniGuide" visible={this.context.isLive} />
          {FormFactor.isHandset ? <TextRef name="Title" text={asset.title} /> : null}
          <ViewRef name="Video-TextDetails">
            {!FormFactor.isHandset ? <TextRef name="Title" text={asset.title} /> : null}
            <ViewRef name="Live-Metadata" visible={this.context.isLive}>
              <TextRef
                name="Text-Detail-1"
                text={LiveListItem.getRemainingString(this.props.liveData.find((it) => it.id === this.props.asset.id))}
              />
              <TextRef name="Text-Detail-2" text={this.props.asset.genres?.map((genre) => genre?.name).join(', ')} />
            </ViewRef>
            <TextRef name="Details" visible={false} text={asset.details} />
          </ViewRef>
        </ViewRef>
      </ButtonRef>
    );
  }
}

const mapStateToProps = (store: AurynAppState) => ({
  liveData: store.tmdbReducer.live.data,
});

export const VideoControls = connect(mapStateToProps)(VideoControlsComponent as any);
