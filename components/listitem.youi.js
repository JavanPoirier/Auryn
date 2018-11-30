import React from 'react';
import { Composition, TextRef, ButtonRef, ImageRef } from '@youi/react-native-youi';

export default class ListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.buttonName = `Btn-${this.props.imageType}-${this.props.size}`;
    this.compositionName = `Auryn_Container-${this.buttonName}`;
    this.imageUri = this.props.size === 'Small' ? 'http://image.tmdb.org/t/p/w500/' : 'http://image.tmdb.org/t/p/w1280/';
    this.imageUri += this.props.imageType === 'Poster' ? this.props.data.poster_path : this.props.data.backdrop_path;
    this.title = this.props.data.name || this.props.data.title;
    this.type = 'name' in this.props.data ? 'tv' : 'movie';
  }

  render() {
    return (
      <Composition source={this.compositionName}>
        <ButtonRef
          focusable={this.props.focusable}
          onPress={() => this.props.onPress(this.props.data.id, this.type)} name={this.buttonName}>
          <ImageRef name="Image-Dynamic" source={{ uri: this.imageUri }} />
          <TextRef name="Text-Details" text={this.props.data.overview} />
          <TextRef name="Text-Title" text={this.title} />
        </ButtonRef>
      </Composition>
    );
  }
}
