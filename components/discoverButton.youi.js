import React from 'react';
import { Composition, TextRef, ButtonRef, ImageRef } from '@youi/react-native-youi';

export default DiscoverButton = props => (
  <Composition source={"Auryn_Container-Btn-Main-" + props.type}>
    <ButtonRef name={"Btn-Main-" + props.type}>
      <ImageRef name="Image-Dynamic" source={{ uri: props.type == "Half" ? "http://image.tmdb.org/t/p/w500" + props.data.backdrop_path : "http://image.tmdb.org/t/p/w1280" + props.data.backdrop_path }} />
      <TextRef name="Text-Details" text={props.data.overview}/>
      <TextRef name="Text-Title" text={props.data.title}/>
    </ButtonRef>
  </Composition>
);


//"http://image.tmdb.org/t/p/w500" + props.data.backdrop_path
