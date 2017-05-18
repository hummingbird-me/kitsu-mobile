import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

class OnboardingScreen extends Component {
  render() {
    return (
      <View>
        <Text>Onboarding</Text>
      </View>
    );
  }
}

export default connect(null, { loginUser })(OnboardingScreen);
