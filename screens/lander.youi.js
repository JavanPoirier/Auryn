import React, { Component } from 'react';
import { Composition, ViewRef, FocusManager, ListRef, } from '@youi/react-native-youi';
import { ListItem, Timeline, DiscoverContainer, ToggleGroup } from '../components';
import { NavigationActions } from 'react-navigation';
import { connect } from "react-redux";
import { tmdbDiscover } from '../actions/tmdbActions'

@connect((store) => {
  return {
    discover: store.tmdbReducer.discover.data
  }
})
export default class Lander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusable: true,
    };
    this.menuGroup = [
      'Btn-Nav-Discover',
      'Btn-Nav-Movies',
      'Btn-Nav-Shows',
      'Btn-Nav-Live',
      'Btn-Nav-Search',
      'Btn-Nav-Profile',
    ]
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
      returnArr.push(array.slice(index,index+3))
    }
    return returnArr;
  }

  render() {
    const { discover } = this.props
    return (
      <Composition source="Auryn_Lander">
        {/* <ToggleGroup names={this.menuGroup} /> */}
        <Timeline name="LanderIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
        <Timeline name="LanderOut" ref={timeline => this.outTimeline = timeline} />
        <ListRef
          name="Discover"
          data={this.unflatten(discover)}
          renderItem={({item, index}) => <DiscoverContainer data={item} index={index}/>}
          horizontal={true}
          key={(item) => item.id}
        />
      </Composition>
    );
  }
}
