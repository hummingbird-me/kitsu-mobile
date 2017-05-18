import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { loginUser } from '../store/auth/actions';

class HomeScreen extends Component {
  render() {
    return (
      <View>
        <Text onPress={() => this.props.loginUser()}>This is to test codepush</Text>
      </View>
    );
  }
}

export default connect(null, { loginUser })(HomeScreen);
