import React from 'react';
import { View, StyleSheet} from '@youi/react-native-youi';
import DiscoverButton from './discoverButton.youi'

export default DiscoverContainer = (props) => {
  if (props.index % 2) {
    return (
      <View>
        <View style={{flexDirection: "row"}}>
          <DiscoverButton focusable={props.focusable} onPress={props.onPressItem} type="Half" data={props.data[0]}/>
          <DiscoverButton focusable={props.focusable} onPress={props.onPressItem} type="Half" data={props.data[1]}/>
        </View>
        <DiscoverButton focusable={props.focusable} onPress={props.onPressItem} type="Full" data={props.data[2]}/>
      </View>
    );
  }
  else {
    return (
      <View>
        <DiscoverButton focusable={props.focusable} onPress={props.onPressItem} type="Full" data={props.data[0]}/>
        <View style={{flexDirection: "row"}}>
          <DiscoverButton focusable={props.focusable} onPress={props.onPressItem} type="Half" data={props.data[1]}/>
          <DiscoverButton focusable={props.focusable} onPress={props.onPressItem} type="Half" data={props.data[2]}/>
        </View>
      </View>
    );
  }
}
