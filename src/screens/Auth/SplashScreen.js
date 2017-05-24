import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Spinner } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Animation from 'lottie-react-native';

import anim from '../../assets/animation/splashy_loader.json';
import * as colors from '../../constants/colors';

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated } = nextProps;
    this.init(isAuthenticated);
  }
  componentDidMount() {
    this.animation.play();
    // this.init(this.props.isAuthenticated);    
  }

  init(authorized) {
    const { dispatch } = this.props.navigation;
    let resetAction = null;
    if (authorized) {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
        key: null,
      });
    } else {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Onboarding' })],
        key: null,
      });
    }
    // dispatch(resetAction);
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
              height: Dimensions.get('window').width,
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

export default connect(mapStateToProps)(SplashScreen);
