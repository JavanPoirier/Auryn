import React, { Component } from 'react';
import { Composition, ViewRef, TextInputRef, View, ButtonRef, ListRef, ImageRef, TextRef, TimelineRef } from '@youi/react-native-youi';
import { tmdbSearch } from '../actions/tmdbActions'
import { NavigationActions } from 'react-navigation';
import { throttle, debounce } from 'throttle-debounce';
import { connect } from "react-redux";

@connect((store) => {
  return {
    data: store.tmdbReducer.search.data,
    fetched: store.tmdbReducer.search.fetched,
  }
})
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {query: ''}
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

  renderItem = ({item}) => {
    return (
      <Composition source="Auryn_ListItem-PDP">
        <ButtonRef name="Btn-Main-Half" onPress={() => this.onPressItem(item.id)}>
          <ImageRef
            name="Image-Dynamic"
            source={{uri: "http://image.tmdb.org/t/p/w500" + item.backdrop_path}}
          />
          <TextRef name="Text-Title" text={item.title}/>
          <TextRef name="Text-Details" text={item.overview}/>
        </ButtonRef>
      </Composition>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.query != nextState.query) {
      this.search()
      return false;
    }

    return true;
  }

  search = debounce(300, () => {
    if (!this.state.query || this.state.query.length < 3)
      return;
    console.log("SEARCH", this.state.query);
    this.props.dispatch(tmdbSearch(this.state.query));
  })

  render() {
    const { data, fetched } = this.props
    let movies, tv, people = []
    console.log(data)
    if (fetched && this.state.query) {
      movies = data.filter(it => it.media_type == 'movie')
      tv = data.filter(it => it.media_type == 'tv')
      console.log(movies)
    }
    return (
      <Composition source="Auryn_Search">
        <TextInputRef
          ref={(ref) => this.searchText = ref}
          name="TextInput"
          secureTextEntry={false}
          onChangeText={(t) => {
            this.setState({query: t})
          }}
        />



        <ListRef
            name="List-PDP"
            data={movies}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
        />

        <ListRef
            name="List-Movies"
            data={tv}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
        />

        <TimelineRef name="SearchIn"
          ref={timeline => this.searchinTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
        <TimelineRef name="SearchOut" ref={timeline => this.searchoutTimeline = timeline} />
      </Composition>
    );
  }
}
