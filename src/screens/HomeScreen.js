import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, Button, Container, Content, Icon } from 'native-base';
import PropTypes from 'prop-types';

import { logoutUser } from '../store/auth/actions';
import { fetchCurrentUser } from '../store/user/actions';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => (
      // <Icon ios="ios-body" android="md-body" style={{ fontSize: 20, color: tintColor }} />
      <Image source={require('../assets/img/tabbar_icons/feed.png')} style={{ tintColor: tintColor, width: 20, height: 21 }} />

    ),
  };

  render() {
    const { currentUser, navigation, loading } = this.props;
    return (
      <Container>
        <Content style={{ padding: 50 }}>
          {loading
            ? <Spinner size="large" />
            : <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                {currentUser.avatar
                    ? <Image
                      style={{ width: 100, height: 100, borderRadius: 50 }}
                      source={{ uri: currentUser.avatar.medium.split('?')[0] }}
                    />
                    : null}
                <View>
                  <Text>
                    {currentUser.name}
                  </Text>
                  <Text>
                    {currentUser.email}
                  </Text>
                  <Text>
                    {currentUser.about}
                  </Text>
                </View>
              </View>
            </View>}
          <Button onPress={() => navigation.navigate('UserProfile', { userId: 5554 })}>
            <Text>
              Nuck
            </Text>
          </Button>
          <Button onPress={() => this.props.logoutUser(navigation)}>
            <Text>
              Logout
            </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, currentUser } = user;
  return { loading, currentUser };
};

HomeScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { logoutUser, fetchCurrentUser })(HomeScreen);
