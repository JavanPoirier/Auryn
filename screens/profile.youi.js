import React, { Component } from 'react';
import { Composition, BackHandler, ButtonRef, TextRef, FocusManager } from '@youi/react-native-youi';
import { Timeline } from '../components';
import { withNavigationFocus } from 'react-navigation';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { activeButtonIndex: 1 };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      BackHandler.addEventListener('onBackButtonPressed', this.navigateBack);
    });
    this.props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('onBackButtonPressed', this.navigateBack);
    });
  }

  navigateBack = () => {
    this.outTimeline.play().then(() => this.props.navigation.goBack(null));
  }

  onPress = i => this.setState({ activeButtonIndex: i })

  render = () => {
    const buttons = new Array(3).fill().map((_, i) =>
      <ButtonRef
        key={i}
        name={`Btn-Profile${i + 1}`}
        onLoad={() => FocusManager.focus(this.activeButton)}
        onPress={() => this.onPress(i + 1)}
        ref={ref => {
          if (i + 1 === this.state.activeButtonIndex) this.activeButton = ref;
        }}
      >
        <TextRef name="Active User" text={this.state.activeButtonIndex === i + 1 ? 'Active User' : ''} />
      </ButtonRef>);

    return (
      <Composition source="Auryn_Profile">
        <Timeline name="ProfileIn" onLoad={timeline => timeline.play()} />
        <Timeline name="ProfileOut" ref={timeline => this.outTimeline = timeline} />
        {buttons}
      </Composition>
    );
  }
}

export default withNavigationFocus(Profile);
