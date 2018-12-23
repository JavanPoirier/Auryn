import React, { PureComponent } from 'react';
import { Composition, ButtonRef } from '@youi/react-native-youi';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

export default class AdListItem extends PureComponent {
  static defaultProps = {
    onFocus: () => {},
    onPress: () => {},
  }

  constructor(props) {
    super(props);
  }

  onPress = navigation => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'AdOverlay',
    });

    navigation.dispatch(navigateAction);
  }

  render() {
    return (
      <Composition source="Auryn_Container-Btn-Ad-Small" loadSync={true}>
        <ButtonRef
          focusable={this.props.focusable}
          onFocus={() => this.props.onFocus(this.ref)}
          ref={ref => this.ref = ref}
          onPress={() => this.props.onPress('Ad', 'Ad', this.ref)}
          name="Btn-Backdrop-Ad"
        />
      </Composition>
    );


  }
}

AdListItem.propTypes = {
  onFocus: PropTypes.func,
  onPress: PropTypes.func,
  focusable: PropTypes.bool,
};
