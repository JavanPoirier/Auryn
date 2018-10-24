
import React from 'react';
import { Composition, TextRef, ButtonRef, ImageRef } from '@youi/react-native-youi';

export default ListItemMovie = props => (
  <Composition source={"Auryn_ListItem-Movies"}>
    <ButtonRef focusable={props.focusable} onPress={() => props.onPress(props.data.id)} name={"Btn-2x3-Movies"}>
      <ImageRef name="Image-Dynamic-2x3" source={{ uri:  "http://image.tmdb.org/t/p/w500" + props.data.poster_path }} />
      <TextRef name="Text-Details" text={props.data.overview}/>
      {/* <TextRef name="Text-Title" text={props.data.title}/> */}
    </ButtonRef>
  </Composition>
);
