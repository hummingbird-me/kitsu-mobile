import React, { Component } from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import * as colors from '../../constants/colors';

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.init = this.init.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated } = nextProps;
    this.init(isAuthenticated);
  }

  init(authorized) {
    const { navigate } = this.props.navigation;
    if (authorized) {
      navigate('Tabs');
    } else {
      navigate('Onboarding');
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
        <Spinner size="large" />
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { isAuthenticated, rehydratedAt } = auth;
  return { isAuthenticated, rehydratedAt };
};

export default connect(mapStateToProps)(SplashScreen);
