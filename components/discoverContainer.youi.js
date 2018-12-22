import React from 'react';
import { View } from '@youi/react-native-youi';
import ListItem from './listitem.youi';
import { AdListItem } from '../ces2018';
import PropTypes from 'prop-types';

export default class DiscoverContainer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() { // eslint-disable-line max-lines-per-function
    const { data, onPress, onFocus, focusable, index } = this.props;
    if (data.length !== 3) return null;

    // CES
    if (index === 1) {
      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <ListItem
              focusable={focusable}
              onPress={onPress}
              onFocus={onFocus}
              imageType="Backdrop" size="Small"
              data={data[0]}
            />
            <AdListItem
              focusable={focusable}
              onPress={onPress}
              onFocus={onFocus}
              imageType="Backdrop" size="Small"
              data={data[1]}
            />
          </View>
          <ListItem
            focusable={focusable}
            onPress={onPress}
            onFocus={onFocus}
            shouldChangeFocus={false}
            imageType="Backdrop" size="Large"
            data={data[2]}
          />
        </View>
      );
    }
    // END CES
    if (index % 2) {
      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <ListItem
              focusable={focusable}
              onPress={onPress}
              onFocus={onFocus}
              imageType="Backdrop" size="Small"
              data={data[0]}
            />
            <ListItem
              focusable={focusable}
              onPress={onPress}
              onFocus={onFocus}
              imageType="Backdrop" size="Small"
              data={data[1]}
            />
          </View>
          <ListItem
            focusable={focusable}
            onPress={onPress}
            onFocus={onFocus}
            shouldChangeFocus={false}
            imageType="Backdrop" size="Large"
            data={data[2]}
          />
        </View>
      );
    }

    return (
      <View>
        <ListItem
          focusable={focusable}
          onPress={onPress}
          imageType="Backdrop" size="Large"
          onFocus={onFocus}
          data={data[0]}
        />
        <View style={{ flexDirection: 'row' }}>
          <ListItem
            focusable={focusable}
            onPress={onPress}
            onFocus={onFocus}
            shouldChangeFocus={false}
            imageType="Backdrop" size="Small"
            data={data[1]}
          />
          <ListItem
            focusable={focusable}
            onPress={onPress}
            onFocus={onFocus}
            shouldChangeFocus={false}
            imageType="Backdrop" size="Small"
            data={data[2]}
          />
        </View>
      </View>
    );
  }
}

DiscoverContainer.propTypes = {
  data: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  onFocus: PropTypes.func,
  index: PropTypes.number,
  focusable: PropTypes.bool,
};
