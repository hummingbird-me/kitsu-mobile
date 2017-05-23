import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { logoutUser } from '../store/auth/actions';

class HomeScreen extends Component {
  render() {
    return (
      <View>
        <Text onPress={() => this.props.logoutUser()}>This is to test codepush</Text>
      </View>
    );
  }
}

export default connect(null, { logoutUser })(HomeScreen);
