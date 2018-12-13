import React from 'react';
import { View } from '@youi/react-native-youi';
import ListItem from './listitem.youi';
import { AdListItem } from '../ces2018';

export default class DiscoverContainer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() { // eslint-disable-line max-lines-per-function
    if (this.props.data.length !== 3) return null;

    // CES
    if (this.props.index === 1) {
      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <ListItem
              focusable={this.props.focusable}
              onPress={this.props.onPress}
              onFocus={this.props.onFocus}
              imageType="Backdrop" size="Small"
              data={this.props.data[0]}
            />
            <AdListItem
              focusable={this.props.focusable}
              onPress={this.props.onPress}
              onFocus={this.props.onFocus}
              imageType="Backdrop" size="Small"
              data={this.props.data[1]}
            />
          </View>
          <ListItem
            focusable={this.props.focusable}
            onPress={this.props.onPress}
            imageType="Backdrop" size="Large"
            data={this.props.data[2]}
          />
        </View>
      );
    }
    // END CES
    if (this.props.index % 2) {
      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <ListItem
              focusable={this.props.focusable}
              onPress={this.props.onPress}
              onFocus={this.props.onFocus}
              imageType="Backdrop" size="Small"
              data={this.props.data[0]}
            />
            <ListItem
              focusable={this.props.focusable}
              onPress={this.props.onPressItem}
              onFocus={this.props.onFocus}
              imageType="Backdrop" size="Small"
              data={this.props.data[1]}
            />
          </View>
          <ListItem
            focusable={this.props.focusable}
            onPress={this.props.onPressItem}
            imageType="Backdrop" size="Large"
            data={this.props.data[2]}
          />
        </View>
      );
    }

    return (
      <View>
        <ListItem
          focusable={this.props.focusable} onPress={this.props.onPressItem}
          imageType="Backdrop" size="Large"
          onFocus={this.props.onFocus}
          data={this.props.data[0]}
        />
        <View style={{ flexDirection: 'row' }}>
          <ListItem
            focusable={this.props.focusable} onPress={this.props.onPressItem}
            imageType="Backdrop" size="Small"
            data={this.props.data[1]}
          />
          <ListItem
            focusable={this.props.focusable} onPress={this.props.onPressItem}
            imageType="Backdrop" size="Small"
            data={this.props.data[2]}
          />
        </View>
      </View>
    );
  }
}
