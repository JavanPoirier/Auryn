import React from 'react';
import { Composition, TextRef, ButtonRef, ImageRef } from '@youi/react-native-youi';

export default function ListItem(props) {
  const buttonName = `Btn-${props.imageType}-${props.size}`;
  const compositionName = `Auryn_Container-${buttonName}`;
  let imageUri = props.size === 'Small' ? 'http://image.tmdb.org/t/p/w500/' : 'http://image.tmdb.org/t/p/w1280/';
  imageUri += props.imageType === 'Poster' ? props.data.poster_path : props.data.backdrop_path;
  const type = 'name' in props.data ? 'tv' : 'movie';
  const titlePropName = type === 'tv' ? 'name' : 'title';

  return (
    <Composition source={compositionName}>
      <ButtonRef focusable={props.focusable} onPress={() => props.onPress(props.data.id, type)} name={buttonName}>
        <ImageRef name="Image-Dynamic" source={{ uri: imageUri }} />
        <TextRef name="Text-Details" text={props.data.overview} />
        <TextRef name="Text-Title" text={props.data[titlePropName]} />
      </ButtonRef>
    </Composition>
  );
}
