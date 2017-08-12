import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import Animation from 'lottie-react-native';

import { fetchCurrentUser } from '../../store/user/actions';
import { createOneSignalPlayer } from '../../store/auth/actions';
import anim from '../../assets/animation/kitsu.json';
import * as colors from '../../constants/colors';

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.animation.play();
    const { isAuthenticated } = this.props;
    if (this.props.rehydratedAt) {
      this.init(isAuthenticated);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated } = nextProps;
    this.init(isAuthenticated);
  }

  init(authorized) {
    const { navigation } = this.props;
    if (authorized) {
      this.props.createOneSignalPlayer();
      this.props.fetchCurrentUser(navigation, NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
        key: null,
      }));
    } else {
      navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Onboarding' })],
        key: null,
      }));
    }
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

const mapStateToProps = ({ auth }) => {
  const { isAuthenticated, rehydratedAt } = auth;
  return { isAuthenticated, rehydratedAt };
};

SplashScreen.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
  createOneSignalPlayer: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { fetchCurrentUser, createOneSignalPlayer })(SplashScreen);
