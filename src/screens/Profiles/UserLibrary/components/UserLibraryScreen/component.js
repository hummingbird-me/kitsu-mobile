import * as React from 'react';
import { Container, Icon } from 'native-base';
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { LibraryHeader } from 'kitsu/screens/Profiles/UserLibrary';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import { SearchBar } from 'kitsu/components/SearchBar';
import { ProgressBar } from 'kitsu/components/ProgressBar';
import { Rating } from 'kitsu/components/Rating';
import { styles } from './styles';

const MINIMUM_SEARCH_TERM_LENGTH = 3;

export class UserLibraryScreenComponent extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    fetchUserLibrary: PropTypes.func.isRequired,
    fetchUserLibraryByType: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    userLibrary: PropTypes.object,
  };

  static defaultProps = {
    currentUser: {},
    userLibrary: {
      loading: true,
    },
  };

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

  state = {
    searchTerm: '',
  };

  componentDidMount() {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibrary(profile.id);
  }

  onSearchTermChanged = (searchTerm) => {
    this.setState({ searchTerm });
    const { userLibrary } = this.props;
    const isSearching = userLibrary.searchTerm.length !== 0;

    if (searchTerm.length >= MINIMUM_SEARCH_TERM_LENGTH && !isSearching) {
      this.debouncedSearch();
    } else if (isSearching && searchTerm.length === 0) {
      this.debouncedFetch();
    }
  }

  debouncedFetch = debounce(() => {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibrary(profile.id);
  }, 100);

  debouncedSearch = debounce(() => {
    const { profile } = this.props.navigation.state.params;
    const { searchTerm } = this.state;
    this.props.fetchUserLibrary(profile.id, searchTerm);
  }, 100);

  fetchMore = (type, status) => {
    const { userLibrary } = this.props;
    const { data, meta } = userLibrary[type][status];
    const { navigation } = this.props;
    const { profile } = navigation.state.params;

    if (data.length < meta.count) {
      this.props.fetchUserLibraryByType({
        userId: profile.id,
        library: type,
        status,
      });
    }
  }

  renderItem = ({ item, index }) => {
    const data = item.anime || item.manga;
    const { currentUser } = this.props;

    let progress = 0;
    if (data.type === 'anime') {
      progress = Math.floor((item.progress / data.episodeCount) * 100);
    } else {
      progress = Math.floor((item.progress / data.chapterCount) * 100);
    }

    const rating = item.ratingTwenty === null ? null : item.ratingTwenty / 2;

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Media', {
            mediaId: data.id,
            type: data.type,
          });
        }}
      >
        <View style={[styles.posterImageContainer, index === 0 && styles.posterImageCardFirstChild]}>
          <Image
            source={{ uri: data.posterImage.tiny }}
            style={styles.posterImageCard}
          />
          {progress > 0 && <ProgressBar fillPercentage={progress} height={3} />}
          <Rating
            disabled
            rating={rating}
            ratingSystem={currentUser.ratingSystem}
            size="tiny"
            viewType="single"
            showNotRated={false}
            style={styles.rating}
          />
        </View>
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
    const searchBar = (
      <SearchBar
        containerStyle={styles.searchBar}
        onChangeText={this.onSearchTermChanged}
        placeholder="Search Library"
        searchIconOffset={120}
        value={this.state.searchTerm}
      />
    );

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
