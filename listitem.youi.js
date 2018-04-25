import React, { Component, Fragment } from 'react';
import {
  ButtonRef,
  ImageRef,
} from 'react-native-youi';

export default function ListItem(props) {
  return (
    <Fragment>
      <ButtonRef name={props.name} onClick={() => props.onClick()}>
        <ImageRef name={props.image} source={{ uri: "https://image.tmdb.org/t/p/w500" + props.asset.poster_path }} />
      </ButtonRef>
    </Fragment>
  );
}
