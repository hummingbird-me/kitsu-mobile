import * as React from 'react';
import { Icon } from 'native-base';
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { LibraryHeader } from 'kitsu/screens/Profiles/UserLibrary';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import { SearchBar } from 'kitsu/components/SearchBar';
import { MediaCard } from 'kitsu/components/MediaCard';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';
import * as constants from './constants';

const MINIMUM_SEARCH_TERM_LENGTH = 3;

const getCardVisibilityCounts = () => {
  const { height, width } = Dimensions.get('screen');
  const maxWidth = height > width ? height : width;
  return {
    countForMaxWidth: Math.ceil(maxWidth / constants.POSTER_CARD_WIDTH),
    countForCurrentWidth: Math.ceil(width / constants.POSTER_CARD_WIDTH),
  };
};

const progressFromLibraryEntry = (libraryEntry) => {
  const mediaData = libraryEntry.anime || libraryEntry.manga;

  if (mediaData.type === 'anime') {
    return Math.floor((libraryEntry.progress / mediaData.episodeCount) * 100);
  }

  return Math.floor((libraryEntry.progress / mediaData.chapterCount) * 100);
};

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

    if (this.props.userLibrary.userId !== profile.id) {
      this.props.fetchUserLibrary(profile.id);
    }
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

  renderEmptyItem() {
    return <View style={styles.emptyPosterImageCard} />;
  }

  renderItem = ({ item, index }) => {
    if (item.type === 'empty-item') {
      return this.renderEmptyItem();
    }

    const data = item.anime || item.manga;
    const { currentUser } = this.props;
    const progress = progressFromLibraryEntry(item);

    return (
      <MediaCard
        cardDimensions={{
          height: constants.POSTER_CARD_HEIGHT,
          width: constants.POSTER_CARD_WIDTH,
        }}
        mediaData={data}
        navigate={this.props.navigation.navigate}
        progress={progress}
        ratingTwenty={item.ratingTwenty}
        ratingSystem={currentUser.ratingSystem}
        style={index === 0 ? styles.posterImageCardFirstChild : null}
      />
    );
  }

  renderLoadingList = () => {
    const { countForMaxWidth } = getCardVisibilityCounts();
    const data = Array(countForMaxWidth).fill(1).map((_, index) => ({ id: index, anime: {} }));
    const width = constants.POSTER_CARD_WIDTH;

    return (
      <FlatList
        horizontal
        data={data}
        initialNumToRender={countForMaxWidth}
        initialScrollIndex={0}
        keyExtractor={item => item.id}
        getItemLayout={(_data, index) => (
          { width, offset: width * index, index }
        )}
        removeClippedSubviews={false}
        renderItem={this.renderItem}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  renderEmptyList = (type, status) => {
    const messageMapping = {
      current: { anime: 'watching', manga: 'reading' },
      planned: { anime: 'planned', manga: 'planned' },
      completed: { anime: 'complete', manga: 'complete' },
      onHold: { anime: 'on hold', manga: 'on hold' },
      dropped: { anime: 'dropped', manga: 'dropped' },
    };

    return (
      <View style={styles.emptyList}>
        <Text style={[
          commonStyles.text,
          commonStyles.colorWhite,
          styles.browseText,
        ]}
        >
          {`You haven't marked any ${type} as ${messageMapping[status][type]} yet!`}
        </Text>
        <TouchableOpacity style={styles.browseButton}>
          <Text style={[commonStyles.text, commonStyles.colorWhite]}>
            Browse {type === 'anime' ? 'Anime' : 'Manga'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderLists = (type) => {
    const { userLibrary, navigation } = this.props;
    const isUserLibraryLoading = userLibrary.loading;
    const width = constants.POSTER_CARD_WIDTH;
    const listOrder = [
      { status: 'current', anime: 'Watching', manga: 'Reading' },
      { status: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
      { status: 'completed', anime: 'Completed', manga: 'Completed' },
      { status: 'onHold', anime: 'On Hold', manga: 'On Hold' },
      { status: 'dropped', anime: 'Dropped', manga: 'Dropped' },
    ];

    return listOrder.map((currentList) => {
      const { status } = currentList;
      const { data, loading: listLoading } = userLibrary[type][status];

      const { countForCurrentWidth, countForMaxWidth } = getCardVisibilityCounts();
      const emptyItemsToAdd = countForMaxWidth - data.length;
      const dataFilled = data.slice();

      if (!listLoading && emptyItemsToAdd > 0) {
        for (let x = 0; x < emptyItemsToAdd; x += 1) {
          dataFilled.push({ id: x, type: 'empty-item' });
        }
      }

      const renderData = emptyItemsToAdd > 0 ? dataFilled : data;

      return (
        <View key={`${status}-${type}`}>
          <LibraryHeader
            libraryStatus={status}
            libraryType={type}
            listTitle={currentList[type]}
            navigation={navigation}
            profile={navigation.state.params.profile}
          />

          {isUserLibraryLoading && listLoading && this.renderLoadingList()}

          {!isUserLibraryLoading && !data.length ?
            this.renderEmptyList(type, status)
            :
            <FlatList
              horizontal
              data={renderData}
              initialNumToRender={countForMaxWidth}
              initialScrollIndex={0}
              getItemLayout={(_data, index) => (
                { width, offset: width * index, index }
              )}
              keyExtractor={item => item.id}
              onEndReached={() => this.fetchMore(type, status)}
              onEndReachedThreshold={0.5}
              removeClippedSubviews={false}
              renderItem={this.renderItem}
              scrollEnabled={data.length >= countForCurrentWidth}
              showsHorizontalScrollIndicator={false}
            />
          }
        </View>
      );
    });
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
      <View style={styles.container}>
        <ScrollableTabView
          locked
          renderTabBar={() => <ScrollableTabBar />}
        >
          <ScrollView key="Anime" tabLabel="Anime" id="anime">
            {searchBar}
            {this.renderLists('anime')}
          </ScrollView>
          <ScrollView key="Manga" tabLabel="Manga" id="manga">
            {searchBar}
            {this.renderLists('manga')}
          </ScrollView>
        </ScrollableTabView>
      </View>
    );
  }
}
