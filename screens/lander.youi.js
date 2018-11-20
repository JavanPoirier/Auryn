import React, { Component } from 'react';
import { Composition, ViewRef, ListRef, TimelineRef, ScrollRef, ButtonRef, View, FocusManager } from '@youi/react-native-youi';
import { Timeline, DiscoverContainer, ToggleGroup, ListItem } from '../components';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { chunk } from 'lodash';

@connect(store => ({
  discover: store.tmdbReducer.discover.data,
  movies: store.tmdbReducer.movies.data,
  tv: store.tmdbReducer.tv.data,
}))

class Lander extends Component {
  constructor(props) {
    super(props);
    this.state = { focusListIndex: 0 };
    this.lists = [];
  }

  componentDidUpdate() {
    console.log('FOCUS', this.props.isFocused);
    console.log(this.state.focusListIndex);
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.setState({ focusable: true });
      this.inTimeline.play();
    });
    this.props.navigation.addListener('didBlur', () =>
      this.setState({ focusable: false }));
  }

  navigateToScreen = screen => {
    console.log('NAVIGATE', `From Lander to ${screen}`);
    const navigateAction = NavigationActions.navigate({
      routeName: screen,
    });

    this.props.navigation.dispatch(navigateAction);
  }

  scrollToScreen = screenIndex => {
    this.setState({ focusListIndex: screenIndex });
    this.scroller.scrollTo({
      x: 0,
      y: screenIndex * 900,
      animated: true,
    });
  }

  groupInto3 = array =>
    chunk(array, 3).map((data, index) => ({
      key: index,
      data,
    }))

  onPressItem = (id, type) => {
    console.log(id);
    const navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: {
        id,
        type,
      },
      key: id,
    });

    this.props.navigation.dispatch(navigateAction);
  }

  render() { // eslint-disable-line max-lines-per-function
    const { discover, movies, tv } = this.props;

    const menuGroup = [
      {
        name: 'Btn-Nav-Discover',
        action: () => this.scrollToScreen(0),
      },
      {
        name: 'Btn-Nav-Movies',
        action: () => this.scrollToScreen(1),
      },
      {
        name: 'Btn-Nav-Shows',
        action: () => this.scrollToScreen(2),
      },
      {
        name: 'Btn-Nav-Live',
        action: () => this.scrollToScreen(3),
      },
    ];

    return (
      <Composition source="Auryn_Lander">
        <ToggleGroup
          focusable={this.props.isFocused}
          buttons={menuGroup}
        />
        <ButtonRef
          name="Btn-Nav-Search"
          focusable={this.props.isFocused}
          onPress={() => this.navigateToScreen('Search')}
        />
        <ButtonRef
          name="Btn-Nav-Profile"
          focusable={this.props.isFocused}
          onPress={() => this.navigateToScreen('Profile')}
        />
        <Timeline name="LanderIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
        <TimelineRef name="LanderOut" ref={timeline => this.outTimeline = timeline} />
        <ScrollRef
          name="Stack"
          ref={scroller => this.scroller = scroller}
          scrollEnabled={false}
          horizontal={false}
        >
          <View>
            <Composition source="Auryn_Container-Discover">
              <ListRef
                name="Discover"
                data={this.groupInto3(discover)}
                ref={ref => this.lists[0] = ref}
                horizontal={true}
                renderItem={({ item, index }) =>
                  <DiscoverContainer
                    focusable={this.props.isFocused && this.state.focusListIndex === 0}
                    onPressItem={this.onPressItem}
                    data={item.data}
                    index={index}
                  />}
              />
            </Composition>
            <Composition source="Auryn_Container-Movies">
              <ListRef
                name="Movies"
                data={movies}
                ref={ref => this.lists[1] = ref}
                horizontal={true}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) =>
                  <ListItem
                    imageType="Poster"
                    size="Small"
                    focusable={this.props.isFocused && this.state.focusListIndex === 1}
                    onPress={this.onPressItem}
                    data={item}
                    index={index}
                  />}
              />
            </Composition>
            <Composition source="Auryn_Container-Shows">
              <ListRef
                name="Shows"
                data={tv}
                ref={ref => this.lists[2] = ref}
                horizontal={true}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) =>
                  <ListItem
                    imageType="Backdrop"
                    size="Small"
                    focusable={this.props.isFocused && this.state.focusListIndex === 2}
                    onPress={this.onPressItem}
                    data={item}
                    index={index}
                  />}
              />
            </Composition>
            <Composition source="Auryn_Container-Live">
              <ListRef
                name="Live"
                data={tv.slice(0, 2)}
                ref={ref => this.lists[3] = ref}
                horizontal={true}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) =>
                  <ListItem
                    imageType="Backdrop"
                    size="Large"
                    focusable={this.props.isFocused && this.state.focusListIndex === 3}
                    onPress={this.onPressItem}
                    data={item}
                    index={index}
                  />}
              />
            </Composition>
          </View>
        </ScrollRef>

        <ViewRef name="Nav">
          <TimelineRef name="In" ref={timeline => this.inTimeline = timeline} onLoad={ref => ref.play()} />
          <TimelineRef name="Out" ref={timeline => this.outTimeline = timeline} />
        </ViewRef>

        <ViewRef name="Nav-Logo">
          <TimelineRef name="Loop" loop={true} ref={timeline => this.loopTimeline = timeline} onLoad={ref => ref.play()} />
        </ViewRef>

      </Composition>
    );
  }
}

export default withNavigationFocus(Lander);
