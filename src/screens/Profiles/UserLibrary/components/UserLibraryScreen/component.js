import * as React from 'react';
import { Container, Icon } from 'native-base';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { LibraryHeader } from 'kitsu/screens/Profiles/UserLibrary';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import { SearchBar } from 'kitsu/components/SearchBar';
import { styles } from './styles';

const MINIMUM_SEARCH_TERM_LENGTH = 3;

export class UserLibraryScreenComponent extends React.Component {
  static navigationOptions = (props) => {
    const { profile } = props.navigation.state.params;

    return {
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
      },
      header: () => (
        <ProfileHeader
          profile={profile}
          title={profile.name}
          onClickBack={props.navigation.goBack}
        />
      ),
      tabBarIcon: ({ tintColor }) => (
        <Icon ios="ios-body" android="md-body" style={{ fontSize: 24, color: tintColor }} />
      ),
    };
  };

  constructor() {
    super();
    this.state = {
      searchTerm: '',
    };
  }

  componentDidMount() {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibrary(profile.id);
  }

  onSearchTermChanged = (searchTerm) => {
    if (searchTerm.length >= MINIMUM_SEARCH_TERM_LENGTH) {
      this.props.searchUserLibrary(profile.id, searchTerm);
    }
  }

  fetchMore = (type, status) => {
    const { navigation, userLibrary } = this.props;
    const { data, meta } = userLibrary[type][status];
    const { profile } = navigation.state.params;

    if (data.length < meta.count) {
      this.props.fetchUserLibraryByType(profile.id, type, status);
    }
  }

  renderItem = ({ item, index }) => {
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
          style={[styles.posterImageCard, index === 0 && styles.posterImageCardFirstChild]}
        />
      </TouchableOpacity>
    );
  }

  renderLists = (type) => {
    const { userLibrary } = this.props;
    const listOrder = [
      { status: 'current', anime: 'Watching', manga: 'Reading' },
      { status: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
      { status: 'completed', anime: 'Completed', manga: 'Completed' },
      { status: 'onHold', anime: 'On Hold', manga: 'On Hold' },
      { status: 'dropped', anime: 'Dropped', manga: 'Dropped' },
    ];

    const { length } = StyleSheet.flatten(styles.posterImageCard);
    return listOrder.map(currentList => (
      <View key={`${currentList.status}-${type}`}>
        <LibraryHeader
          data={userLibrary[type][currentList.status].data}
          status={currentList.status}
          type={type}
          title={currentList[type]}
        />
        <FlatList
          horizontal
          data={userLibrary[type][currentList.status].data}
          initialNumToRender={5}
          initialScrollIndex={0}
          keyExtractor={item => item.id}
          onEndReached={() => this.fetchMore(type, currentList.status)}
          onEndReachedThreshold={0.50}
          refreshing={userLibrary[type][currentList.status].loading}
          renderItem={this.renderItem}
          getItemLayout={(data, index) => (
            { length, offset: length * index, index }
          )}
        />
      </View>
    ));
  }

  render() {
    const { userLibrary } = this.props;
    const searchBar = (
      <SearchBar
        placeholder="Search Library"
        containerStyle={styles.searchBar}
        onChangeText={this.onSearchTermChanged}
      />
    );

    if (userLibrary.loading) {
      return (
        <Container style={styles.container}>
          <Text>Loading...</Text>
        </Container>
      );
    }

    return (
      <Container style={styles.container}>
        <ScrollableTabView renderTabBar={() => <ScrollableTabBar />}>
          <ScrollView key="Anime" tabLabel="Anime" id="anime">
            {searchBar}
            {this.renderLists('anime')}
          </ScrollView>
          <ScrollView key="Manga" tabLabel="Manga" id="manga">
            {searchBar}
            {this.renderLists('manga')}
          </ScrollView>
        </ScrollableTabView>
      </Container>
    );
  }
}

UserLibraryScreenComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  fetchUserLibrary: PropTypes.func.isRequired,
  fetchUserLibraryByType: PropTypes.func.isRequired,
  searchUserLibrary: PropTypes.func.isRequired,
  searchUserLibraryByType: PropTypes.func.isRequired,
  userLibrary: PropTypes.object,
};

UserLibraryScreenComponent.defaultProps = {
  userLibrary: {
    loading: true,
  },
};
