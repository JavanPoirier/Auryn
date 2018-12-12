import React, { Component } from 'react';
import { View, Composition, BackHandler, TextInputRef, TimelineRef, FocusManager } from '@youi/react-native-youi';
import { tmdbSearch, tmdbDetails } from '../actions/tmdbActions';
import { Timeline, List, BackButton } from '../components';
import { NavigationActions, withNavigationFocus } from 'react-navigation';
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
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    });
    this.props.navigation.addListener('didBlur', () => this.backHandler.remove());
  }

  navigateBack = () => {
    this.outTimeline.play().then(() => this.props.navigation.goBack(null));
    return true;
  }

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
    this.props.dispatch(tmdbDetails(id, type));
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
    if (!this.props.isFocused)
     return <View/>;
    const { data, fetched } = this.props;
    let movies = [];
    let tv = [];
    if (fetched && this.state.query) {
      movies = data.filter(it => it.media_type === 'movie').slice(0, 10);
      tv = data.filter(it => it.media_type === 'tv').slice(0, 10);
    }
    return (
      <Composition source="Auryn_Search">
        <BackButton
          focusable={this.props.isFocused}
          hasBackButton={this.props.screenProps.hasBackButton}
          onPress={this.navigateBack}
        />
        <TextInputRef
          ref={ref => this.searchText = ref}
          onLoad={() => {
            FocusManager.focus(this.searchText);
          }}
          name="TextInput"
          secureTextEntry={false}
          onChangeText={text => this.setState({ query: text })}
          defaultValue={this.state.query}
        />

        <List
          name="List-PDP"
          type="Shows"
          data={tv}
          focusable={this.props.isFocused}
          onPressItem={this.onPressItem}
        />
        <List
          name="List-Movies"
          type="Shows"
          data={movies}
          focusable={this.props.isFocused}
          onPressItem={this.onPressItem}
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

export default withNavigationFocus(Search);
