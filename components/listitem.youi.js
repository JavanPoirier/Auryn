import React, { PureComponent, Fragment } from 'react';
import { Composition, TextRef, ButtonRef, ImageRef, View, Image, StyleSheet, TouchableHighlight } from '@youi/react-native-youi';

export default class ListItem extends PureComponent {
  static defaultProps = {
    onFocus: () => {},
    onPress: () => {},
  }

  constructor(props) {
    super(props);
    this.buttonName = `Btn-${this.props.imageType}-${this.props.size}`;
    this.compositionName = `Auryn_Container-${this.buttonName}`;
    this.imageUri = this.props.size === 'Small' ? 'http://image.tmdb.org/t/p/w500/' : 'http://image.tmdb.org/t/p/w1280/';
    this.imageUri += this.props.imageType === 'Poster' ? this.props.data.poster_path : this.props.data.backdrop_path;
    this.title = this.props.data.name || this.props.data.title;
    this.type = 'name' in this.props.data ? 'tv' : 'movie';
    this.state = { focused: false };
    this.imageStyle = styles[this.buttonName];
    this.mode = 'comp';
  }

  metadata = () =>
    <Fragment>
      <ImageRef
        name="Image-Dynamic"
        source={ { uri: this.imageUri } } />
      <TextRef name="Text-Details" text={this.props.data.overview} />
      <TextRef name="Text-Title" text={this.title} />
    </Fragment>


  render() {
    if (this.mode !== 'comp') {
      return (
        <TouchableHighlight
          onShowUnderlay={() => this.setState({ focused: true })}
          onHideUnderlay={() => this.setState({ focused: false })}
          focusable={this.props.focusable}
          ref={ref => this.ref = ref}
          onPress={() => this.props.onPress(this.props.data.id, this.type, this.ref)} name={this.buttonName}>
          <View style={this.state.focused ? styles.border : null} focusable={this.props.focusable}>
            <Image style={this.imageStyle}
              source={this.props.focusable ? { uri: this.imageUri } : null } />
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <Composition source={this.compositionName} loadSync={true}>
        <ButtonRef
          focusable={this.props.focusable}
          ref={ref => this.ref = ref}
          onFocus={() => this.props.onFocus(this.ref, this.props.data.id, this.type)}
          onPress={() => this.props.onPress(this.props.data.id, this.type, this.ref)}
          name={this.buttonName}
          visible={this.state.focusable}
          shouldChangeFocus={this.props.shouldChangeFocus}
        >
        {this.props.focusable ? this.metadata() : null }
        </ButtonRef>
      </Composition>
    );


  }
}

const styles = StyleSheet.create({
  'Btn-Backdrop-Small': {
    width: 534,
    height: 300,
  },
  'Btn-Backdrop-Large': {
    width: 1068,
    height: 600,
  },
  'Btn-Poster-Small': {
    width: 400,
    height: 600,
  },
  border : {
    borderWidth: '4',
    borderStyle: 'solid',
    borderColor: '#E7333C',
  },
});
