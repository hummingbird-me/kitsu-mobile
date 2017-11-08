import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import Animation from 'lottie-react-native';

import anim from 'kitsu/assets/animation/kitsu.json';
import * as colors from 'kitsu/constants/colors';

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.animation.play();
    const { isAuthenticated, conflicts } = this.props;
    if (this.props.rehydratedAt) {
      this.init(isAuthenticated, conflicts);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, conflicts } = nextProps;
    this.init(isAuthenticated, conflicts);
  }

  init(authorized, conflicts) {
    const { dispatch } = this.props.navigation;
    let resetAction = null;
    if (authorized && !conflicts) {
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
      >
        <View>
          <Animation
            ref={(animation) => {
              this.animation = animation;
            }}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
            loop
            source={anim}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, onboarding }) => {
  const { isAuthenticated, rehydratedAt } = auth;
  const { conflicts } = onboarding;
  return { isAuthenticated, rehydratedAt, conflicts };
};

SplashScreen.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SplashScreen);
