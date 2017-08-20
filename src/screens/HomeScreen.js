import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, Button, Container, Content, Icon } from 'native-base';
import PropTypes from 'prop-types';
import { logoutUser } from 'kitsu/store/auth/actions';
import { Rating } from 'kitsu/components/Rating';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: (
      { tintColor }, // <Icon ios="ios-body" android="md-body" style={{ fontSize: 20, color: tintColor }} />
    ) => (
      <Image
        source={require('kitsu/assets/img/tabbar_icons/feed.png')}
        style={{ tintColor, width: 20, height: 21 }}
      />
    ),
  };

  state = {
    selectedImages: [],
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
          <Button onPress={() => navigation.navigate('Post')}>
            <Text>
              Create Post
            </Text>
          </Button>
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
          <Button onPress={() => navigation.navigate('MediaUpload')}>
            <Text>
              Upload Media
            </Text>
          </Button>

          <View>
            <Rating rating={8} size="tiny" viewType="single" ratingSystem="regular" showNotRated={false} />
          </View>

          <View>
            <Rating rating={8} size="large" viewType="single" ratingSystem="regular" />
          </View>

          <View>
            <Rating rating={8} size="large" viewType="single" ratingSystem="simple" />
          </View>
          {/* <Rating rating={8} size="small" viewType="single" style={{ height: 10, borderWidth: 1 }} /> */}
          {/* <Rating rating={8} size="normal" viewType="single" style={{ height: 10, borderWidth: 1 }} /> */}
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

export default connect(mapStateToProps, { logoutUser })(HomeScreen);
