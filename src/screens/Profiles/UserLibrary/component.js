import * as React from 'react';
import { Container, Icon } from 'native-base';
import { FlatList, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { NavigationHeader } from '../NavigationHeader';
import { styles } from './styles';

export class UserLibraryScreenComponent extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      shadowColor: 'transparent',
      elevation: 0,
    },
    header: () => <NavigationHeader {...navigation} />,
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 24, color: tintColor }} />
    ),
  });

  componentDidMount() {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibrary(profile.id);
  }

  renderItem({ item }) {
    const data = item.anime || item.manga;

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Media', {
            mediaId: data.id,
            type: data.type,
          });
        }}
      >
        <Image
          source={{ uri: data.posterImage.tiny }}
          style={styles.posterImageCard}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { navigation } = this.props;
    const { coverImage, name } = navigation.state.params.profile;

    if (this.props.userLibrary.loading) {
      return (
        <Container style={styles.container}>
          <Text>Loading...</Text>
        </Container>
      );
    }

    return (
      <Container style={styles.container}>
        <ScrollableTabView>
          <ScrollView key="Anime" tabLabel="Anime" id="anime" style={styles.scrollView}>
            <FlatList
              horizontal
              data={this.props.userLibrary.anime.current}
              renderItem={this.renderItem}
            />
          </ScrollView>
          <ScrollView key="Manga" tabLabel="Manga" id="manga" style={styles.scrollView}>
            <Text>Manga</Text>
          </ScrollView>
        </ScrollableTabView>
      </Container>
    );
  }
}

UserLibraryScreenComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  fetchUserLibrary: PropTypes.func.isRequired,
  userLibrary: PropTypes.object,
};

UserLibraryScreenComponent.defaultProps = {
  userLibrary: {
    loading: true,
  },
};
