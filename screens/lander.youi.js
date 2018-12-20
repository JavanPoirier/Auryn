import React, { Component } from 'react';
import { Composition, ViewRef, ScrollRef, ButtonRef, View, FocusManager, BackHandler } from '@youi/react-native-youi';
import { Timeline, ToggleGroup, List } from '../components';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
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
      .map((it, i) => (
        {
          name: `Btn-Nav-${it}`,
          onPress: () => {
            this.scrollToScreen(i);
            this.selectedMenuItemIndex = i;
          },
        }
      ));
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {

      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

      if (this.lastFocusItem) {
        FocusManager.enableFocus(this.lastFocusItem);
        FocusManager.focus(this.lastFocusItem);
      }

      // CES
      if (this.adPressed) return;
      // END CES

      if (this.landerInTimeline && this.navInTimeline) {
        this.landerInTimeline.play();
        this.navInTimeline.play(1);
      }


    });
    this.props.navigation.addListener('didBlur', () => this.backHandler.remove());
  }

  navigateToScreen = screen => {
    console.log('NAVIGATE', `From Lander to ${screen}`);
    const navigateAction = NavigationActions.navigate({
      routeName: screen,
    });

    this.outTimeline.play().then(() => this.props.navigation.dispatch(navigateAction));
  }

  scrollToScreen = (screenIndex, animated = true) => {
    for (let index = 0; index < this.lists.length; index++)
      FocusManager.setNextFocus(this.menuButtons.getButtonRef(index), this.lists[screenIndex], 'down');
    FocusManager.setNextFocus(this.searchButton, this.lists[screenIndex], 'down');
    FocusManager.setNextFocus(this.profileButton, this.lists[screenIndex], 'down');
    FocusManager.setNextFocus(this.lists[screenIndex], this.menuButtons.getButtonRef(screenIndex), 'up');

    this.setState({ currentListIndex: screenIndex });
    this.scroller.scrollTo({
      x: 0,
      y: screenIndex * 900,
      animated,
    });
  }

  onFocusItem = (ref, id, type) => {
    this.props.dispatch(tmdbDetails(id, type));
    this.lastFocusItem = ref;

    if (ref.props.shouldChangeFocus === false) return;

    FocusManager.setNextFocus(ref, this.menuButtons.getButtonRef(this.state.currentListIndex), 'up');
    for (let index = 0; index < this.lists.length; index++)
      FocusManager.setNextFocus(this.menuButtons.getButtonRef(index), ref, 'down');

    FocusManager.setNextFocus(this.searchButton, ref, 'down');
    FocusManager.setNextFocus(this.profileButton, ref, 'down');
  }

  onPressItem = (id, type, ref) => {
    // CES
    this.adPressed = false;
    if (type === 'Ad') {
      this.adPressed = true;
      this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'AdOverlay' }));
      return;
    }
    // END CES
    this.lastFocusItem = ref;
    console.log(id);
    const navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: {
        id,
        type,
      },
    });
    this.props.dispatch(tmdbDetails(id, type));
    this.outTimeline.play().then(() => this.props.navigation.dispatch(navigateAction));
  }

  render() { // eslint-disable-line max-lines-per-function, max-statements
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
          ref={ref => this.searchButton = ref}
          onPress={() => this.navigateToScreen('Search')}
        />
        <ButtonRef
          name="Btn-Nav-Profile"
          focusable={this.props.isFocused}
          ref={ref => this.profileButton = ref}
          onPress={() => this.navigateToScreen('Profile')}
        />
        <Timeline name="LanderIn"
          onLoad={timeline => {
            this.landerInTimeline = timeline;
            this.landerInTimeline.play();
          }}
        />
        <Timeline name="LanderOut" ref={timeline => this.outTimeline = timeline} />
        <ScrollRef
          name="Stack"
          ref={scroller => this.scroller = scroller}
          scrollEnabled={false}
          horizontal={false}
          focusable={false}
        >
          <View>
            <Composition source="Auryn_Container-Discover">
              <List
                name="Discover"
                type="Discover"
                data={this.props.discover}
                ref={ref => this.lists[0] = ref}
                focusable={this.props.isFocused && this.state.currentListIndex === 0}
                onFocusItem={this.onFocusItem}
                onPressItem={this.onPressItem}
              />
            </Composition>
            <Composition source="Auryn_Container-Movies">
              <List
                name="Movies"
                type="Movies"
                data={this.props.movies}
                ref={ref => this.lists[1] = ref}
                focusable={this.props.isFocused && this.state.currentListIndex === 1}
                onFocusItem={this.onFocusItem}
                onPressItem={this.onPressItem}
              />
            </Composition>
            <Composition source="Auryn_Container-Shows">
              <List
                name="Shows"
                type="Shows"
                data={this.props.tv}
                ref={ref => this.lists[2] = ref}
                focusable={this.props.isFocused && this.state.currentListIndex === 2}
                onFocusItem={this.onFocusItem}
                onPressItem={this.onPressItem}
              />
            </Composition>
            <Composition source="Auryn_Container-Live">
              <List
                name="Live"
                type="Live"
                data={this.props.tv.slice(0, 2)}
                ref={ref => this.lists[3] = ref}
                focusable={this.props.isFocused && this.state.currentListIndex === 3}
                onFocusItem={this.onFocusItem}
                onPressItem={this.onPressItem}
              />
            </Composition>
          </View>
        </ScrollRef>

        <ViewRef name="Nav">
          <Timeline name="In" onLoad={timeline => {
            this.navInTimeline = timeline;
            this.navInTimeline.play();
            FocusManager.focus(this.menuButtons.getButtonRef(0));
          }}
          />
          <Timeline name="Out" ref={timeline => this.navOutTimeline = timeline} />
        </ViewRef>

        <ViewRef name="Nav-Logo">
          <Timeline name="Loop" loop={true} />
        </ViewRef>

      </Composition>
    );
  }
}

export default withNavigationFocus(Lander);
