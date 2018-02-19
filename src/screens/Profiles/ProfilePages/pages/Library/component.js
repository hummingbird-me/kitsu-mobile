import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, FlatList, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Kitsu } from 'kitsu/config/api';
import { fetchUserLibrary } from 'kitsu/store/profile/actions';
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

  componentDidMount() {
    const { userId } = this.props;
    this.props.fetchUserLibrary({ userId });
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

  renderLoadingList = () => (
    <View style={styles.loadingList}>
      <ActivityIndicator color="white" />
    </View>
  )

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
      </View>
    );
  };

  renderFetchingMoreSpinner = (type, status) => {
    const { userLibrary } = this.props;
    const { data, loading } = userLibrary[type][status];

    if (loading && data.length) {
      return (
        <View style={styles.listLoadingSpinnerContainer}>
          <Spinner color="white" />
        </View>
      );
    }

    return null;
  }

  renderLists = (type) => {
    const { navigation, userLibrary, profile } = this.props;
    const listOrder = [
      { status: 'current', anime: 'Watching', manga: 'Reading' },
      { status: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
      { status: 'completed', anime: 'Completed', manga: 'Completed' },
      { status: 'on_hold', anime: 'On Hold', manga: 'On Hold' },
      { status: 'dropped', anime: 'Dropped', manga: 'Dropped' },
    ];

    return listOrder.map((currentList, index) => {
      const { status } = currentList;
      const { data, fetchMore, loading } = userLibrary[type][status];

      const { countForCurrentWidth, countForMaxWidth } = getCardVisibilityCounts();
      const emptyItemsToAdd = countForMaxWidth - data.length;
      const dataFilled = data.slice();

      if (!loading && emptyItemsToAdd > 0) {
        for (let x = 0; x < emptyItemsToAdd; x += 1) {
          dataFilled.push({ id: x, type: 'empty-item' });
        }
      }

      const renderData = emptyItemsToAdd > 0 ? dataFilled : data;
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

          {loading && !data.length &&
            this.renderLoadingList()
          }

          {!loading && !data.length ?
            this.renderEmptyList(type, status)
            :
            <FlatList
              ListFooterComponent={this.renderFetchingMoreSpinner(type, status)}
              horizontal
              data={renderData}
              initialNumToRender={countForMaxWidth}
              initialScrollIndex={0}
              getItemLayout={getItemLayout}
              keyExtractor={idExtractor}
              onEndReached={fetchMore}
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
    const { profile, navigation } = this.props;

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

const mapStateToProps = ({ profile }) => {
  const { userLibrary } = profile;
  return { userLibrary };
};

export const component = connect(mapStateToProps, { fetchUserLibrary })(Library);
