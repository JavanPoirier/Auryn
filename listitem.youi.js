import React from 'react';
import {
  ButtonRef,
  ImageRef,
} from 'react-native-youi';

export default ListItem = props => (
  <ButtonRef name={props.name} onClick={() => props.onClick()}>
    <ImageRef name={props.image} source={{ uri: "http://image.tmdb.org/t/p/w500" + props.asset.poster_path }} />
  </ButtonRef>
);
