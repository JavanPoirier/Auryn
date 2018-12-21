import React, { PureComponent } from 'react';
import { ButtonRef } from '@youi/react-native-youi';

export default class BackButton extends PureComponent {
  constructor(props) {
    super(props);
    this.hasHardwareBackButton = global.hasHardwareBackButton;
  }

  render = () =>
    <ButtonRef
      {...this.props}
      name="Btn-Back"
      visible={!this.hasHardwareBackButton}
      focusable={this.props.focusable && !this.hasHardwareBackButton}
    />
}
