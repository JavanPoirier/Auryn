import React, { Component } from 'react';
import { View, Composition, BackHandler, TextInputRef, FocusManager } from '@youi/react-native-youi';
import { tmdb, cache } from '../actions';
import { Timeline, List, BackButton } from '../components';
import { NavigationActions, withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

@connect(store => ({
  data: store.tmdbReducer.search.data,
}))
class Search extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    });
    this.blurListener = this.props.navigation.addListener('didBlur', () => this.backHandlerListener.remove());
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
    this.backHandlerListener.remove();
  }

  navigateBack = () => {
    if (this.outTimeline)
      this.outTimeline.play().then(() => this.props.navigation.goBack(null));
    else
      this.props.navigation.goBack(null);
    return true;
  }

  onPressItem = (id, type) => {
    this.props.dispatch(tmdb.getDetailsByIdAndType(id, type));
    const navigateAction = NavigationActions.navigate({
      routeName: 'PDP',
      params: {
        id,
        type,
      },
      key: id,
    });
    this.outTimeline.play().then(() => this.props.navigation.dispatch(navigateAction));
  }

  onFocusItem = (ref, id, type) => this.props.dispatch(cache.saveDetailsByIdAndType(id, type));

  search = query => this.props.dispatch(tmdb.search(query));

  render() { // eslint-disable-line max-lines-per-function
    const { isFocused, data: { movies, tv } } = this.props;

    if (!isFocused)
      return <View />;

    return (
      <Composition source="Auryn_Search">
        <BackButton
          focusable={this.props.isFocused}
          onPress={this.navigateBack}
        />
        <TextInputRef
          ref={ref => this.searchText = ref}
          onLoad={() => {
            FocusManager.focus(this.searchText);
          }}
          name="TextInput"
          secureTextEntry={false}
          onChangeText={this.search}
        />

        <List
          name="List-PDP"
          type="Shows"
          data={tv}
          focusable={isFocused}
          onPressItem={this.onPressItem}
          onFocusItem={this.onFocusItem}
        />
        <List
          name="List-Movies"
          type="Shows"
          data={movies}
          focusable={isFocused}
          onPressItem={this.onPressItem}
          onFocusItem={this.onFocusItem}
        />

        <Timeline name="SearchOut" ref={timeline => this.outTimeline = timeline} />

        <Timeline name="SearchIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
      </Composition>
    );
  }
}

export default withNavigationFocus(Search);

Search.propTypes = {
  isFocused: PropTypes.bool,
  data: PropTypes.object,
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
};

Search.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  isFocused: PropTypes.bool,
  data: PropTypes.object,
};
