import React, { Component, Fragment } from 'react';
import { View, ButtonRef, Composition, ImageRef, TextRef, BackHandler, FocusManager, ViewRef } from '@youi/react-native-youi';
import { connect } from "react-redux";
@connect((store) => {
  return {
    asset: store.tmdbReducer.details.data,
    fetched: store.tmdbReducer.details.fetched,
  }
})
export default class PDP extends Component {

  renderItem = (item) => {
    return (
      <Composition source="Auryn_ListItem-PDP">
        <ButtonRef name="Btn-Main-Half">
          <ImageRef
            name="Image-Dyanmic"
            source={{uri: "http://image.tmdb.org/t/p/w500" + item.backdrop_path}}
          />
          <TextRef name="Text-Title" text={item.title}/>
          <TextRef name="Text-Details" text={item.overview}/>
        </ButtonRef>
      </Composition>
    )
  }

  render() {
    const { asset, fetched } = this.props
    if (!fetched) {
      return(<View/>)
    }
    return (
      <Composition source="Auryn_PDP">
        <ViewRef name="PDP-Scroller">
          <ListRef
            name="List-PDP"
            data={asset.similar.results}
            renderItem={this.renderItem}
            key={(item) => item.id}
          />
          <ButtonRef name="Btn-2x3-Full">
            <ImageRef
              name="Image-Dynamic-2x3"
              source={{uri: "http://image.tmdb.org/t/p/w500" + asset.poster_path}}
            />
          </ButtonRef>
          <ImageRef
            name="Image-Dynamic-Background"
            source={{uri: "http://image.tmdb.org/t/p/w1280" + asset.backdrop_path}}
          />
          <ViewRef name="Layout-PDP-Meta">
            <TextRef name="Text-Title" text={asset.title} />
            <TextRef name="Text-Overview" text={asset.overview} />
            <TextRef name="Text-Featured" text="I don't know" />
          </ViewRef>
        </ViewRef>
      </Composition>
    );
  }
}
