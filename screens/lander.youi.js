import React, { Component } from 'react';
import { Composition, ViewRef, FocusManager, } from '@youi/react-native-youi';
import { ListItem, Timeline } from '../components';
import { NavigationActions } from 'react-navigation';
import { connect } from "react-redux";
import { fetchMovies } from '../actions/moviesActions'

@connect((store) => {
  return {
    movies: store.moviesReducer.movies.results,
    fetched: store.moviesReducer.fetched
  }
})
export default class Lander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      focusable: true,
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchMovies())

    this.props.navigation.addListener('didFocus', () => {
      this.setState({focusable: true});
      this.inTimeline.play();
    })
    this.props.navigation.addListener('didBlur', () => {
      this.setState({focusable: false})
    })
  }

  render() {
    const { movies, fetched } = this.props
    let listItems = fetched ?
      Array(10).fill().map((_, i) => {
        return(<ListItem
          key={movies[i].id}
          asset={movies[i]}
          onLoad={ref => { if (i == 0) FocusManager.focus(ref)}}
          name={'Poster' + (i + 1)}
          focusable={this.state.focusable}
          image='Container-Image'
          onClick={() => {
            this.outTimeline.play()
              .then(() => {
                let navigateAction = NavigationActions.navigate({
                  routeName: 'PDP',
                  params: { id: movies[i].id },
                  key: movies[i].id
                })
                this.props.navigation.dispatch(navigateAction)
              });
          }}
        />)
      }

      ) : null;

    return (
      <Composition source="Lander_Main">

        <ViewRef name="Scroller">
          <Timeline name="In"
            ref={timeline => this.inTimeline = timeline}
            onLoad={timeline => timeline.play()}
          />
          <Timeline name="Out" ref={timeline => this.outTimeline = timeline} />
        </ViewRef>

        {listItems}

      </Composition>
    );
  }
}
