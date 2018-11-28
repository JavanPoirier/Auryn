import React, { Component } from 'react';
import { Composition, BackHandler, TextInputRef, ButtonRef, ListRef, ImageRef, TextRef, TimelineRef, FocusManager } from '@youi/react-native-youi';
import { tmdbSearch } from '../actions/tmdbActions';
import { Timeline, ListItem } from '../components';
import { NavigationActions } from 'react-navigation';
import { debounce } from 'throttle-debounce';
import { connect } from 'react-redux';

@connect(store => ({
  data: store.tmdbReducer.search.data,
  fetched: store.tmdbReducer.search.fetched,
}))
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      BackHandler.addEventListener('onBackButtonPressed', this.navigateBack);
      if (this.searchText) {
        FocusManager.focus(this.searchText);
        this.searchText.activate();
      }
    });
    this.props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('onBackButtonPressed', this.navigateBack);
    });
  }

  navigateBack = () => {
    this.outTimeline.play().then(() => this.props.navigation.goBack(null));
  }

  onPressItem = id => {
    console.log(id);
    const navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: {
        id,
        type: 'movie',
      },
      key: id,
    });
    this.props.navigation.dispatch(navigateAction);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.query !== nextState.query) {
      this.search();
      return false;
    }

    return true;
  }

  search = debounce(300, () => {
    if (!this.state.query || this.state.query.length < 3)
      return;
    console.log('SEARCH', this.state.query);
    this.props.dispatch(tmdbSearch(this.state.query));
  })

  render() { // eslint-disable-line max-lines-per-function
    const { data, fetched } = this.props;
    let movies = [];
    let tv = [];
    if (fetched && this.state.query) {
      movies = data.filter(it => it.media_type === 'movie');
      tv = data.filter(it => it.media_type === 'tv');
    }
    return (
      <Composition source="Auryn_Search">
        <TextInputRef
          ref={ref => this.searchText = ref}
          name="TextInput"
          secureTextEntry={false}
          onChangeText={text => this.setState({ query: text })}
        />

        <ListRef
          name="List-PDP"
          data={tv}
          renderItem={({ item, index }) =>
          <ListItem
            imageType="Backdrop"
            size="Small"
            focusable={this.props.isFocused && !this.state.videoVisible}
            onPress={this.onPressItem}
            data={item}
            index={index}
          />}
          keyExtractor={item => item.id}
          horizontal={true}
        />

        <ListRef
          name="List-Movies"
          data={movies}
          renderItem={({ item, index }) =>
          <ListItem
            imageType="Backdrop"
            size="Small"
            focusable={this.props.isFocused && !this.state.videoVisible}
            onPress={this.onPressItem}
            data={item}
            index={index}
          />}
          keyExtractor={item => item.id}
          horizontal={true}
        />

        <Timeline name="SearchOut" ref={timeline => this.outTimeline = timeline} />

        <TimelineRef name="SearchIn"
          ref={timeline => this.searchinTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />


      </Composition>
    );
  }
}

export default Search;
