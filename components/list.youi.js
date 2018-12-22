import React, { PureComponent } from 'react';
import { ListRef } from '@youi/react-native-youi';
import { DiscoverContainer, ListItem } from '.';
import PropTypes from 'prop-types';

export default class List extends PureComponent {
  constructor(props) {
    super(props);
    this.imageSettings = this.getImageSettings();
  }

  getImageSettings = () => {
    switch (this.props.type) {
      case 'Movies':
        return { type: 'Poster', size: 'Small', length: 400 };
      case 'Shows':
        return { type: 'Backdrop', size: 'Small', length: 534 };
      case 'Live':
      case 'Discover':
        return { type: 'Backdrop', size: 'Large', length: 1068 };
      default:
        return { type: 'Backdrop', size: 'Small', length: 534 };
    }
  }

  getItemLayout = (data, index) => ({
    index,
    length: this.imageSettings.length,
    offset: this.imageSettings.length * index,
  })

  renderItem = ({ item, index }) => {
    if (this.props.type === 'Discover') {
      return (
        <DiscoverContainer
          focusable={this.props.focusable}
          onPress={this.props.onPressItem}
          onFocus={this.props.onFocusItem}
          data={item.data}
          index={index}
        />
      );
    }

    return (
      <ListItem
        imageType={this.imageSettings.type}
        size={this.imageSettings.size}
        focusable={this.props.focusable}
        onFocus={this.props.onFocusItem}
        onPress={this.props.onPressItem}
        data={item}
        index={index}
      />
     );
  }

  render() {
    return (
      <ListRef
        name={this.props.name}
        data={this.props.data}
        ref={ref => {
          if (this.ref)
            this.ref(ref);
        }}
        horizontal={true}
        getItemLayout={this.getItemLayout}
        renderItem={this.renderItem}
      />
    );
  }
}

List.propTypes = {
  type: PropTypes.oneOf(['Discover', 'Movies', 'Shows']).isRequired,
  name: PropTypes.string,
  focusable: PropTypes.bool,
  onPressItem: PropTypes.func,
  onFocusItem: PropTypes.func,
  data: PropTypes.array.isRequired,
  ref: PropTypes.func,
};
