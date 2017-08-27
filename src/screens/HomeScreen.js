import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, Button, Container, Content } from 'native-base';
import PropTypes from 'prop-types';
import { logoutUser } from 'kitsu/store/auth/actions';
import { fetchAlgoliaKeys } from 'kitsu/store/app/actions';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: (
      { tintColor }, // <Icon ios="ios-body" android="md-body" style={{ fontSize: 20, color: tintColor }} />
    ) => (
      <Image
        source={require('kitsu/assets/img/tabbar_icons/home.png')}
        style={{ tintColor, width: 20, height: 21 }}
      />
    ),
  };

  state = {
    selectedImages: [],
    searchTerm: '',
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
          <Button onPress={() => navigation.navigate('UserLibrary', {
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
          <Button onPress={() => this.props.logoutUser(navigation)}>
            <Text>
              Logout
            </Text>
          </Button>
          <Button onPress={() => navigation.navigate('MediaUpload')}>
            <Text>
              Upload Media
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
};

export default connect(mapStateToProps, { logoutUser, fetchAlgoliaKeys })(HomeScreen);
