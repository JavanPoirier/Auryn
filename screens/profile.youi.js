import React, { Component } from 'react';
import { Composition, BackHandler, ButtonRef, TextRef } from '@youi/react-native-youi';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {activeButton: 1}
    BackHandler.addEventListener("onBackButtonPressed", this.navigateBack);
  }
  navigateBack = () => {
    this.props.navigation.goBack(null);
  }

  onPress = (i) => {
    this.setState({activeButton: i});
  }

  render() {
    console.log(this.buttons)
    return (
      <Composition source="Auryn_Profile">
        {this.buttons}

        <ButtonRef name={"Btn-Profile1"} onPress={() => this.onPress(1)} >
          <TextRef name="Active User" text={this.state.activeButton == 1 ? "Active User" : ""}/>
        </ButtonRef>

        <ButtonRef name={"Btn-Profile2"} onPress={() => this.onPress(2)} >
          <TextRef name="Active User" text={this.state.activeButton == 2 ? "Active User" : ""}/>
        </ButtonRef>

        <ButtonRef name={"Btn-Profile3"} onPress={() => this.onPress(3)} >
          <TextRef name="Active User" text={this.state.activeButton == 3 ? "Active User" : ""}/>
        </ButtonRef>

      </Composition>
    );
  }
}
