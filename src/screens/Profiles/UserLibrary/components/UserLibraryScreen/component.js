import * as React from 'react';
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { LibraryHeader, UserLibrarySearchBox } from 'kitsu/screens/Profiles/UserLibrary';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import { MediaCard } from 'kitsu/components/MediaCard';
import { commonStyles } from 'kitsu/common/styles';
import { idExtractor, isIdForCurrentUser } from 'kitsu/common/utils';
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

export class UserLibraryScreenComponent extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    fetchUserLibrary: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    userLibrary: PropTypes.object,
  };

  static defaultProps = {
    currentUser: {},
    userLibrary: {
      loading: true,
    },
  };

  static navigationOptions = ({ navigation }) => {
    const { profile } = navigation.state.params;

    return {
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
      },
      header: () => (
        <ProfileHeader
          profile={profile}
          title={profile.name}
          onClickBack={navigation.goBack}
        />
      ),
    };
  };

  componentDidMount() {
    const { profile } = this.props.navigation.state.params;
    const { countForMaxWidth } = getCardVisibilityCounts();

    if (this.props.userLibrary.userId !== profile.id) {
      this.props.fetchUserLibrary({ userId: profile.id, limit: countForMaxWidth });
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
    const { currentUser, navigation } = this.props;
    const { profile } = navigation.state.params;
    const messageMapping = {
      current: { anime: 'watching', manga: 'reading' },
      planned: { anime: 'planned', manga: 'planned' },
      completed: { anime: 'complete', manga: 'complete' },
      onHold: { anime: 'on hold', manga: 'on hold' },
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

  renderLists = (type) => {
    const { userLibrary, navigation } = this.props;
    const listOrder = [
      { status: 'current', anime: 'Watching', manga: 'Reading' },
      { status: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
      { status: 'completed', anime: 'Completed', manga: 'Completed' },
      { status: 'onHold', anime: 'On Hold', manga: 'On Hold' },
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
            profile={navigation.state.params.profile}
          />

          {loading && !data.length &&
            this.renderLoadingList()
          }

          {!loading && !data.length ?
            this.renderEmptyList(type, status)
            :
            <FlatList
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
    const { profile } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <ScrollableTabView locked renderTabBar={renderScrollTabBar}>
          <ScrollView key="Anime" tabLabel="Anime" id="anime">
            <UserLibrarySearchBox navigation={this.props.navigation} profile={profile} />
            {this.renderLists('anime')}
          </ScrollView>
          <ScrollView key="Manga" tabLabel="Manga" id="manga">
            <UserLibrarySearchBox navigation={this.props.navigation} profile={profile} />
            {this.renderLists('manga')}
          </ScrollView>
        </ScrollableTabView>
      </View>
    );
  }
}
