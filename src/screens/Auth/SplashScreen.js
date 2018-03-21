import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';

import * as colors from 'kitsu/constants/colors';

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    const { isAuthenticated, completed, rehydratedAt } = this.props;
    if (rehydratedAt) {
      this.navigate(isAuthenticated, completed);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, completed, rehydratedAt } = nextProps;
    if (rehydratedAt) {
      this.navigate(isAuthenticated, completed);
    }
  }

  navigate(authorized, completed) {
    const { dispatch } = this.props.navigation;
    let resetAction = null;
    if (authorized && completed) {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
        key: null,
      });
    } else if (authorized) {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Onboarding' })],
        key: null,
      });
    } else {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Intro' })],
        key: null,
      });
    }
    dispatch(resetAction);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.darkPurple,
        }}
      />
    );
  }
}

const mapStateToProps = ({ auth, onboarding }) => {
  const { isAuthenticated, rehydratedAt } = auth;
  const { completed } = onboarding;
  return { isAuthenticated, rehydratedAt, completed };
};

SplashScreen.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SplashScreen);
