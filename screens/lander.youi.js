import React, { Component } from 'react';
import { Composition, ViewRef, ListRef, TimelineRef, ScrollRef, ButtonRef, View, FocusManager } from '@youi/react-native-youi';
import { Timeline, DiscoverContainer, ToggleGroup, ListItem } from '../components';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { chunk } from 'lodash';
import { tmdbDetails } from '../actions/tmdbActions';

@connect(store => ({
  discover: store.tmdbReducer.discover.data,
  movies: store.tmdbReducer.movies.data,
  tv: store.tmdbReducer.tv.data,
}))
class Lander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentListIndex: 0,
    };
    this.lists = [];
    this.lastFocusItem = null;
    this.menuGroup = ['Discover', 'Movies', 'Shows', 'Live']
    .map((it, i) => ({ name: `Btn-Nav-${it}`, action: () => this.scrollToScreen(i) }));
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {

      if (this.landerInTimeline && this.navInTimeline) {
        Promise.all([
          this.landerInTimeline.play,
          this.navInTimeline.play,
        ]);
      }

    });
  }

  navigateToScreen = screen => {
    console.log('NAVIGATE', `From Lander to ${screen}`);
    const navigateAction = NavigationActions.navigate({
      routeName: screen,
    });

    this.props.navigation.dispatch(navigateAction);
  }

  scrollToScreen = (screenIndex, animated = true) => {
    for (let index = 0; index < this.lists.length; index++)
      FocusManager.setNextFocus(this.menuButtons.getButtonRef(index), this.lists[screenIndex], 'down');

    this.setState({ currentListIndex: screenIndex });
    this.scroller.scrollTo({
      x: 0,
      y: screenIndex * 900,
      animated,
    });
  }

  groupInto3 = array =>
    chunk(array, 3).map((data, index) => ({
      key: index.toString(),
      data,
    }))

  onPressItem = (id, type, ref) => {
    console.log(id);
    const navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: {
        id,
        type,
      },
      key: id,
    });
    this.props.dispatch(tmdbDetails(id, type));
    this.lastFocusItem = ref;
    this.props.navigation.dispatch(navigateAction);
  }

  getItemLayout = (data, index, imageType, imageSize) => {
    let length = 0;
    if (imageType === 'Poster' && imageSize === 'Small')
      length = 400;
    if (imageType === 'Backdrop' && imageSize === 'Small')
      length = 534;
    if (imageType === 'Backdrop' && imageSize === 'Large')
      length = 1068;

    return {
      index,
      length,
      offset: length * index,
    };
  }

  render() { // eslint-disable-line max-lines-per-function, max-statements
    let { discover, movies, tv } = this.props;
    discover = discover.filter(asset => asset.original_language === 'en' && asset.backdrop_path).slice(0, 15);
    movies = movies.filter(asset => asset.original_language === 'en' && asset.poster_path).slice(0, 10);
    tv = tv.filter(asset => asset.original_language === 'en' && asset.backdrop_path).slice(0, 10);

    if (!this.props.isFocused)
      return <View />;

    return (
      <Composition source="Auryn_Lander">
        <ToggleGroup
          focusable={this.props.isFocused}
          buttons={this.menuGroup}
          ref={ref => this.menuButtons = ref}
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
          onLoad={timeline => {
            this.landerInTimeline = timeline;
            this.landerInTimeline.play();
          }}
        />
        <TimelineRef name="LanderOut" ref={timeline => this.outTimeline = timeline} />
        <ScrollRef
          name="Stack"
          ref={scroller => this.scroller = scroller}
          scrollEnabled={false}
          horizontal={false}
          focusable={false}
        >
          <View>
            <Composition source="Auryn_Container-Discover">
              <ListRef
                name="Discover"
                data={this.groupInto3(discover)}
                ref={ref => this.lists[0] = ref}
                horizontal={true}
                initialScrollIndex={0}
                getItemLayout={(data, index) => this.getItemLayout(data, index, 'Backdrop', 'Large')}
                renderItem={({ item, index }) =>
                  <DiscoverContainer
                    focusable={this.props.isFocused && this.state.currentListIndex === 0}
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
                initialScrollIndex={0}
                getItemLayout={(data, index) => this.getItemLayout(data, index, 'Poster', 'Small')}
                renderItem={({ item, index }) =>
                  <ListItem
                    imageType="Poster"
                    size="Small"
                    focusable={this.props.isFocused && this.state.currentListIndex === 1}
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
                initialScrollIndex={0}
                getItemLayout={(data, index) => this.getItemLayout(data, index, 'Backdrop', 'Small')}
                renderItem={({ item, index }) =>
                  <ListItem
                    imageType="Backdrop"
                    size="Small"
                    focusable={this.props.isFocused && this.state.currentListIndex === 2}
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
                initialScrollIndex={0}
                horizontal={true}
                getItemLayout={(data, index) => this.getItemLayout(data, index, 'Backdrop', 'Large')}
                renderItem={({ item, index }) =>
                  <ListItem
                    imageType="Backdrop"
                    size="Large"
                    focusable={this.props.isFocused && this.state.currentListIndex === 3}
                    onPress={this.onPressItem}
                    data={item}
                    index={index}
                  />}
              />
            </Composition>
          </View>
        </ScrollRef>

        <ViewRef name="Nav">
          <Timeline name="In" onLoad={timeline => {
            this.navInTimeline = timeline;
            this.navInTimeline.play();
            FocusManager.focus(this.menuButtons.getButtonRef(0));
          } }
            />
          <Timeline name="Out" ref={timeline => this.navOutTimeline = timeline} />
        </ViewRef>

        <ViewRef name="Nav-Logo">
          <TimelineRef name="Loop" loop={true} />
        </ViewRef>

      </Composition>
    );
  }
}

export default withNavigationFocus(Lander);
