import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ButtonRef,
  Composition,
  Fragment,
  ImageRef,
  TextRef,
  ViewRef,
} from 'react-native-youi';

import Timeline from './timeline.youi.js'
import Button from './button.youi.js'

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.id = props.asset.id
  }

  render() {
   return (
      <Fragment>
        <ButtonRef name={this.props.name} onClick={() => this.props.onClick()}>
          <ImageRef name="Image-2x3" source={{ uri: "https://image.tmdb.org/t/p/w500" + this.props.asset.poster_path }} />
        </ButtonRef>
      </Fragment>
    )
  }
}

export default ListItem
