import React, { Component } from 'react';
import { Composition, ViewRef, FocusManager, ListRef, TimelineRef} from '@youi/react-native-youi';
import { ListItem, Timeline, DiscoverContainer, ToggleGroup } from '../components';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
import { connect } from "react-redux";
import { tmdbDiscover } from '../actions/tmdbActions'

@connect((store) => {
  return {
    discover: store.tmdbReducer.discover.data
  }
})
class Lander extends Component {
  constructor(props) {
    super(props);
    this.menuGroup = [
      'Btn-Nav-Discover',
      'Btn-Nav-Movies',
      'Btn-Nav-Shows',
      'Btn-Nav-Live',
      'Btn-Nav-Search',
      'Btn-Nav-Profile',
    ]
  }
  componentDidUpdate(prevProps) {
    console.log('FOCUS', this.props.isFocused)
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.setState({focusable: true});
      this.inTimeline.play();
    })
    this.props.navigation.addListener('didBlur', () => {
      this.setState({focusable: false})
    })
  }

  unflatten = (array) => {
    let returnArr = [];
    for (let index = 0; index < array.length; index+=3) {
      if (index >= array.length-3) break;
      returnArr.push(
        {
          key: index,
          data: array.slice(index,index+3)
        })
    }
    return returnArr;
  }

  onPressItem = (id) => {
    console.log(id)
    let navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: { id: id, type: 'movie' },
      key: id
    })
    this.props.navigation.dispatch(navigateAction)
  }

  render() {
    const { discover } = this.props
    return (
      <Composition source="Auryn_Lander">
        <ToggleGroup focusable={this.props.isFocused} names={this.menuGroup} />
        <Timeline name="LanderIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
        <TimelineRef name="LanderOut" ref={timeline => this.outTimeline = timeline} />
        <ListRef
          name="Discover"
          data={this.unflatten(discover)}
          renderItem={({item, index}) => <DiscoverContainer focusable={this.props.isFocused} onPressItem={this.onPressItem} data={item.data} index={index}/>}
          horizontal={true}
        />
          <ViewRef name="Nav">
            <TimelineRef name="In" ref={(timeline) => this.inTimeline = timeline} onLoad={(ref) => {ref.play()}} />
            <TimelineRef name="Out" ref={(timeline) => this.outTimeline = timeline} />
          </ViewRef>
      </Composition>
    );
  }
}



export default withNavigationFocus(Lander);
