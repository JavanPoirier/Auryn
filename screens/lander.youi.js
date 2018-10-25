import React, { Component } from 'react';
import { Composition, ViewRef, ListRef, TimelineRef, ScrollRef, View,FlatList} from '@youi/react-native-youi';
import { Timeline, DiscoverContainer, ToggleGroup, ListItemMovie } from '../components';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
import { connect } from "react-redux";

@connect((store) => {
  return {
    discover: store.tmdbReducer.discover.data,
    movies: store.tmdbReducer.movies.data,
    tv: store.tmdbReducer.tv.data,
  }
})
class Lander extends Component {
  constructor(props) {
    super(props);
    this.menuGroup = [
      { name: 'Btn-Nav-Discover', action: () => {} },
      { name: 'Btn-Nav-Movies', action: () => { this.shiftDownTimeline.play() } },
      { name: 'Btn-Nav-Shows', action: () => { this.shiftUpTimeline.play() } },
      { name: 'Btn-Nav-Live', action: () => { this.scroller.scrollTo({x: 0, y: 150, animated: true});} },
      { name: 'Btn-Nav-Search', action: () => this.navigateToScreen('Search') },
      { name: 'Btn-Nav-Profile', action: () => {} },
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

  navigateToScreen = (screen) => {
    console.log('NAVIGATE', 'From Lander to ' + screen)
    let navigateAction = NavigationActions.navigate({
      routeName: screen
    })
    this.props.navigation.dispatch(navigateAction)
  }

  srollToScreen = (screen) => {

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
    const { discover, movies, tv } = this.props
    return (
      <Composition source="Auryn_Lander">
        <ToggleGroup focusable={this.props.isFocused} buttons={this.menuGroup} />
        <Timeline name="LanderIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
        <TimelineRef name="LanderOut" ref={timeline => this.outTimeline = timeline} />
        <TimelineRef name="ShiftUp" ref={t => this.shiftUpTimeline = t} />
        <TimelineRef name="ShiftDown" ref={t => this.shiftDownTimeline = t} />
        <ScrollRef
          name="Stack"
          ref={t => this.scroller = t}
          scrollEnabled={false}
          horizontal={false}
        >
        <Composition source='Auryn_Lander-ContentStackWrapper'>
          <ListRef
            name="Discover"
            data={this.unflatten(discover)}
            renderItem={({item, index}) => <DiscoverContainer focusable={this.props.isFocused} onPressItem={this.onPressItem} data={item.data} index={index}/>}
            horizontal={true}
          />
          <ListRef
            name="Movies"
            data={movies}
            renderItem={({item, index}) => <ListItemMovie focusable={this.props.isFocused} onPressItem={this.onPressItem} data={item} index={index}/>}
            horizontal={true}
          />
        </Composition>


          {/* <ListRef
            name="Shows"
            data={tv}
            renderItem={({item, index}) => <DiscoverContainer focusable={this.props.isFocused} onPressItem={this.onPressItem} data={item.data} index={index}/>}
            horizontal={true}
          /> */}
        </ScrollRef>

        <ViewRef name="Nav">
          <TimelineRef name="In" ref={(timeline) => this.inTimeline = timeline} onLoad={(ref) => {ref.play()}} />
          <TimelineRef name="Out" ref={(timeline) => this.outTimeline = timeline} />
        </ViewRef>

        <ViewRef name="Nav-Logo">
          <TimelineRef name="Loop" loop={true} ref={(timeline) => this.loopTimeline = timeline} onLoad={(ref) => {ref.play()}} />
        </ViewRef>

      </Composition>
    );
  }
}



export default withNavigationFocus(Lander);
