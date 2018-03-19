import React, { Component } from 'react';
import { Modal, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { Spinner, Button, Container, Content } from 'native-base';
import PropTypes from 'prop-types';
import { logoutUser } from 'kitsu/store/auth/actions';
import { fetchAlgoliaKeys } from 'kitsu/store/app/actions';

import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: (
      { tintColor }, // <Icon ios="ios-body" android="md-body" style={{ fontSize: 20, color: tintColor }} />
    ) => (
      <FastImage
        source={require('kitsu/assets/img/tabbar_icons/home.png')}
        style={{ tintColor, width: 20, height: 21 }}
      />
    ),
  };

  state = {
    selectedImages: [],
    searchTerm: '',
    quickUpdateModalVisible: false,
  };

  componentWillMount() {
    this.props.fetchAlgoliaKeys();
  }

  render() {
    const { currentUser, navigation, loading } = this.props;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Content style={{ padding: 50 }}>
          {loading
            ? <Spinner size="large" />
            : <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                {currentUser.avatar
                    ? <FastImage
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
          <Button onPress={() => navigation.navigate('Post')}>
            <Text>
              Create Post
            </Text>
          </Button>
          <Button
            onPress={() =>
              navigation.navigate('UserProfile', {
                userName: 'nuck',
              })}
          >
            <Text>
              Logged In Profile
            </Text>
          </Button>
          <Button onPress={() => navigation.navigate('UserLibraryScreen', {
            profile: {
              id: 5554,
              name: 'Nuck',
              coverImage: {
                original: 'https://media.kitsu.io/users/cover_images/5554/original.png?1487275574',
              },
              avatar: {
                tiny: 'https://media.kitsu.io/users/avatars/5554/tiny.png?1502777221',
              },
            },
          })}
          >
            <Text>
              Nuck Library
            </Text>
          </Button>
          <Button onPress={this.props.logoutUser}>
            <Text>
              Logout
            </Text>
          </Button>
          <Button onPress={() => this.setState({ quickUpdateModalVisible: true })}>
            <Text>
              Quick Update
            </Text>
          </Button>
        </Content>
        <Modal
          animationType="fade"
          visible={this.state.quickUpdateModalVisible}
        >
          <QuickUpdateScreen onClose={() => this.setState({ quickUpdateModalVisible: false })} />
        </Modal>
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
};

export default connect(mapStateToProps, { logoutUser, fetchAlgoliaKeys })(HomeScreen);
