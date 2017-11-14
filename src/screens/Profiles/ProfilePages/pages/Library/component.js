import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Kitsu } from 'kitsu/config/api';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { LibraryHeader, UserLibrarySearchBox } from 'kitsu/screens/Profiles/UserLibrary';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import { MediaCard } from 'kitsu/components/MediaCard';
import { commonStyles } from 'kitsu/common/styles';
import { idExtractor, isIdForCurrentUser } from 'kitsu/common/utils';
import { Spinner } from 'native-base';
import { styles } from './styles';
import * as constants from './constants';

const renderScrollTabBar = () => <ScrollableTabBar />;

const getItemLayout = (_data, index) => {
  const width = constants.POSTER_CARD_WIDTH;
  return { width, offset: width * index, index };
};

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


class Library extends PureComponent {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    currentUser: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
    data: null,
  }

  componentDidMount = async () => {
    const { userId } = this.props;
    this.setState({ loading: true });
    try {
      const data = await Kitsu.findAll('libraryEntries', {
        fields: {
          anime: 'slug,posterImage,canonicalTitle,titles,synopsis,subtype,startDate,status,averageRating,popularityRank,ratingRank,episodeCount',
          users: 'id',
        },
        filter: {
          userId,
          kind: 'anime',
        },
        include: 'anime,user,mediaReaction',
        page: {
          // TODO: Connect pagination with flat list
          offset: 0,
          limit: 40,
        },
        sort: 'status,-progressed_at',
      });

      this.setState({
        data,
        loading: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving library entries: ', err);
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
        progress={progress}
        ratingTwenty={item.ratingTwenty}
        ratingSystem={currentUser.ratingSystem}
        style={index === 0 ? styles.posterImageCardFirstChild : null}
        navigate={this.props.navigation.navigate}
      />
    );
  }

  renderLoadingList = () => {
    const { countForMaxWidth } = getCardVisibilityCounts();
    const data = Array(countForMaxWidth).fill(1).map((_, index) => ({ id: index, anime: {} }));

    return (
      <FlatList
        horizontal
        data={data}
        initialNumToRender={countForMaxWidth}
        initialScrollIndex={0}
        keyExtractor={idExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={false}
        renderItem={this.renderItem}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  renderEmptyList = (type, status) => {
    const { currentUser, profile } = this.props;
    const messageMapping = {
      current: { anime: 'watching', manga: 'reading' },
      planned: { anime: 'planned', manga: 'planned' },
      completed: { anime: 'complete', manga: 'complete' },
      on_hold: { anime: 'on hold', manga: 'on hold' },
      dropped: { anime: 'dropped', manga: 'dropped' },
    };

    const messagePrefix = isIdForCurrentUser(profile.id, currentUser)
      ? "You haven't"
      : `${profile.name} hasn't`;

    return (
      <View style={styles.emptyList}>
        <Text style={[
          commonStyles.text,
          commonStyles.colorWhite,
          styles.browseText,
        ]}
        >
          {`${messagePrefix} marked any ${type} as ${messageMapping[status][type]} yet!`}
        </Text>
        <TouchableOpacity style={styles.browseButton}>
          <Text style={[commonStyles.text, commonStyles.colorWhite]}>
            Browse {type === 'anime' ? 'Anime' : 'Manga'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderFetchingMoreSpinner = (type, status) => {
    const { data } = this.state;
    const { newData, loading } = data[type][status];

    if (loading && newData.length) {
      return (
        <View style={styles.listLoadingSpinnerContainer}>
          <Spinner color="white" />
        </View>
      );
    }

    return null;
  }

  renderLists = (type) => {
    const { navigation, profile } = this.props;
    const { data } = this.state;
    const listOrder = [
      { status: 'current', anime: 'Watching', manga: 'Reading' },
      { status: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
      { status: 'completed', anime: 'Completed', manga: 'Completed' },
      { status: 'on_hold', anime: 'On Hold', manga: 'On Hold' },
      { status: 'dropped', anime: 'Dropped', manga: 'Dropped' },
    ];

    return listOrder.map((currentList, index) => {
      const { status } = currentList;
      const filteredData = data.filter(item => item.status === status);

      const { countForCurrentWidth, countForMaxWidth } = getCardVisibilityCounts();
      const emptyItemsToAdd = countForMaxWidth - filteredData.length;
      const dataFilled = filteredData.slice();

      if (emptyItemsToAdd > 0) {
        for (let x = 0; x < emptyItemsToAdd; x += 1) {
          dataFilled.push({ id: x, type: 'empty-item' });
        }
      }

      const renderData = emptyItemsToAdd > 0 ? dataFilled : filteredData;
      const listStyle = index === listOrder.length - 1 ? styles.listLastChild : null;
      return (
        <View key={`${status}-${type}`} style={listStyle}>
          <LibraryHeader
            libraryStatus={status}
            libraryType={type}
            listTitle={currentList[type]}
            navigation={navigation}
            profile={profile}
          />

          <FlatList
            horizontal
            data={renderData}
            initialNumToRender={countForMaxWidth}
            initialScrollIndex={0}
            getItemLayout={getItemLayout}
            keyExtractor={idExtractor}
            removeClippedSubviews={false}
            renderItem={this.renderItem}
            scrollEnabled={filteredData.length >= countForCurrentWidth}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
    });
  }

  render() {
    const { loading, data } = this.state;
    const { profile, navigation } = this.props;

    if (loading || !data) return <SceneLoader />;

    return (
      <View style={styles.container}>
        <ScrollableTabView locked renderTabBar={renderScrollTabBar}>
          <View key="Anime" tabLabel="Anime" id="anime">
            <UserLibrarySearchBox navigation={navigation} profile={profile} />
            {this.renderLists('anime')}
          </View>
          <View key="Manga" tabLabel="Manga" id="manga">
            <UserLibrarySearchBox navigation={navigation} profile={profile} />
            {this.renderLists('manga')}
          </View>
        </ScrollableTabView>
      </View>
    );
  }
}

export const component = Library;
