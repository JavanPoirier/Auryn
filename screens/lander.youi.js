import React, { Component } from 'react';
import { Composition, ViewRef, FocusManager, } from '@youi/react-native-youi';
import { ListItem, Timeline } from '../components';
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

  render() {
    const { discover } = this.props
    console.log(discover)
    return (
      <Composition source="Auryn_Lander">
        <Timeline name="LanderIn"
          ref={timeline => this.inTimeline = timeline}
          onLoad={timeline => timeline.play()}
        />
        <Timeline name="LanderOut" ref={timeline => this.outTimeline = timeline} />
      </Composition>
    );
  }
}
