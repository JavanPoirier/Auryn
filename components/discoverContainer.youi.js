import React from 'react';
import { View } from '@youi/react-native-youi';
import ListItem from './listItem.youi'

export default DiscoverContainer = (props) => {
  if (props.index % 2) {
    return (
      <View>
        <View style={{flexDirection: "row"}}>
          <ListItem focusable={props.focusable} onPress={props.onPressItem} imageType="Backdrop" size="Small" data={props.data[0]}/>
          <ListItem focusable={props.focusable} onPress={props.onPressItem} imageType="Backdrop" size="Small" data={props.data[1]}/>
        </View>
        <ListItem focusable={props.focusable} onPress={props.onPressItem} imageType="Backdrop" size="Large" data={props.data[2]}/>
      </View>
    );
  }
  else {
    return (
      <View>
        <ListItem focusable={props.focusable} onPress={props.onPressItem} imageType="Backdrop" size="Large" data={props.data[0]}/>
        <View style={{flexDirection: "row"}}>
          <ListItem focusable={props.focusable} onPress={props.onPressItem} imageType="Backdrop" size="Small"data={props.data[1]}/>
          <ListItem focusable={props.focusable} onPress={props.onPressItem} imageType="Backdrop" size="Small" data={props.data[2]}/>
        </View>
      </View>
    );
  }
}
