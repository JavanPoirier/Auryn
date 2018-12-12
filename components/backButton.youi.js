import React, { PureComponent } from 'react';
import { ButtonRef } from '@youi/react-native-youi';

export default class BackButton extends PureComponent {
  constructor(props) {
    super(props);
  }

  render = () =>
    <ButtonRef
      {...this.props}
      name="Btn-Back"
      visible={!this.props.hasBackButton}
      focusable={this.props.focusable && !this.props.hasBackButton}
    />
}
