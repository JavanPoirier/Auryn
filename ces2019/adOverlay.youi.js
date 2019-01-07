import React, { PureComponent } from 'react';
import { BackHandler, ButtonRef, Composition, FocusManager, TextRef, View, ViewRef } from '@youi/react-native-youi';
import { Timeline } from '../components';
import { withNavigationFocus } from 'react-navigation';
import PropTypes from 'prop-types';

class AdOverlay extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    });
    this.blurListener = this.props.navigation.addListener('didBlur', () => this.backHandlerListener.remove());
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
    this.backHandlerListener.remove();
  }

  navigateBack = () => {
    this.inTimeline.play(1);
    this.outPromise = this.outTimeline ? this.outTimeline.play : Promise.resolve;
    this.outPromise().then(() => {
      if (global.isRoku)
        this.props.navigation.navigate({ routeName: 'Lander' });
      else
        this.props.navigation.goBack(null);
    });
    return true;
  }

  render = () => {
    if (!this.props.isFocused) return <View/>;

    return (
      <Composition source="Auryn_Ad-Coke">
        <Timeline name="In"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()} />
        <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />
        <ButtonRef
          name="Btn-Cap"
          onPress={this.navigateBack}
          focusable={this.props.isFocused}
          ref={ref => this.closeButton = ref}
          onLoad={() => FocusManager.focus(this.closeButton)}
        />

        <ViewRef name="Looper">
          <Timeline name="Loop" onLoad={ref => {
            if (!global.isRoku) ref.play();
          }}/>
        </ViewRef>
        <TextRef
          name="TM"
          visible={!global.isRoku}
        />
      </Composition>
    );
  }
}

export default withNavigationFocus(AdOverlay);

AdOverlay.propTypes = {
  isFocused: PropTypes.bool,
  navigation: PropTypes.object,
};
