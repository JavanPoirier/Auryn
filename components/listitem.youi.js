import React from 'react';
import { Composition, TextRef, ButtonRef, ImageRef } from '@youi/react-native-youi';

export default ListItem = props => {
  let buttonName = "Btn-" + props.imageType + "-" + props.size
  let compositionName = "Auryn_Container-" + buttonName
  let imageUri = props.size == "Small" ? "http://image.tmdb.org/t/p/w500/" : "http://image.tmdb.org/t/p/w1280/";
      imageUri += props.imageType == "Poster" ? props.data.poster_path : props.data.backdrop_path;
  let titlePropName = props.data.hasOwnProperty('name') ? "name" : "title"
  return (
    <Composition source={compositionName}>
      <ButtonRef focusable={props.focusable} onPress={() => props.onPress(props.data.id)} name={buttonName}>
        <ImageRef name="Image-Dynamic" source={{ uri: imageUri }} />
        <TextRef name="Text-Details" text={props.data.overview}/>
        <TextRef name="Text-Title" text={props.data[titlePropName]}/>
      </ButtonRef>
    </Composition>
  );
}
