import React, { PureComponent } from 'react';
import { Composition, BackHandler, ButtonRef, ViewRef, FocusManager, View } from '@youi/react-native-youi';
import { Timeline } from '../components';
import { withNavigationFocus } from 'react-navigation';

class AdOverlay extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    });
    this.props.navigation.addListener('didBlur', () => this.backHandler.remove());
  }

  navigateBack = () => {
    this.outTimeline.play().then(() => this.props.navigation.goBack(null));
    return true;
  }

  render = () => {
    if (!this.props.isFocused) return <View/>;

    return (
      <Composition source="Auryn_Ad-Coke">
        <Timeline name="In" onLoad={timeline => timeline.play()} />
        <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />
        <ButtonRef
          name="Btn-Cap"
          onPress={this.navigateBack}
          focusable={this.props.isFocused}
          ref={ref => this.closeButton = ref}
          onLoad={() => FocusManager.focus(this.closeButton)}
        />

        <ViewRef name="Looper">
          <Timeline name="Loop" onLoad={ref => ref.play()}/>
        </ViewRef>
      </Composition>
    );
  }
}

export default withNavigationFocus(AdOverlay);
