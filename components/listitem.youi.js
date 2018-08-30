import React from 'react';
import { ButtonRef, ImageRef } from '@youi/react-native-youi';

export default ListItem = props => (
  <ButtonRef name={props.name} onClick={() => props.onClick()} focusable={props.focusable} onLoad={props.onLoad}>
  {/* This image ref is causing the app to crash on refresh */}
    <ImageRef name={props.image} source={{ uri: "http://image.tmdb.org/t/p/w500" + props.asset.poster_path }} />
  </ButtonRef>
);
