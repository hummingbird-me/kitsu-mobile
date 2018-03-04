import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Kitsu, setToken } from 'kitsu/config/api';
import { completeOnboarding } from 'kitsu/store/onboarding/actions';
import { SimpleRating } from 'kitsu/components/SimpleRating';
import { StarRating } from 'kitsu/components/StarRating';
import { styles as commonStyles } from '../styles';
import { styles } from './styles';

class RateScreen extends React.Component {
  static navigationOptions = {
    backEnabled: true,
  };

  state = {
    topMedia: [],
    currentIndex: 0,
    ratingTwenty: 0,
    ratedCount: 0,
    mediaTotalDuration: 0,
    selected: null,
    pageIndex: 0,
    pageLimit: 10,
    fetching: true,
    loadingMore: false,
    wantToWatch: false,
    loadingWtW: false, // want to watch button loading state.
  };

  componentDidMount() {
    this.loadInitialMedia();
  }

  onSwipe = (index) => {
    const { topMedia } = this.state;
    if (index >= topMedia.length - 4) {
      this.loadMoreMedia();
    }
    this.setState({
      currentIndex: index,
      ratingTwenty: topMedia[index].ratingTwenty,
      selected: getSimpleTextForRatingTwenty(topMedia[index].ratingTwenty),
      wantToWatch: topMedia[index].status === 'planned',
      loadingWtW: false,
    });
  };

  onRateSimple = (rating) => {
    this.prepareAnimation();
    if (this.state.selected === rating) {
      // toggle
      this.setState({ selected: null, ratingTwenty: null });
      this.removeRating();
    } else {
      const ratingTwenty = getRatingTwentyForText(rating, 'simple');
      this.setState({ selected: rating, ratingTwenty });
      this.rate(ratingTwenty);
    }
  };

  onSlidingComplete = (ratingTwenty) => {
    const { ratingSystem } = this.props;
    if (
      (ratingSystem !== 'advanced' && ratingTwenty >= 1) ||
      (ratingSystem === 'advanced' && ratingTwenty >= 1.5)
    ) {
      this.setState({ ratingTwenty });
      this.rate(ratingTwenty);
    } else {
      this.setState({ ratingTwenty: 0 });
      this.removeRating(null);
    }
  };

  onDone = () => {
    const { selectedAccount, completeOnboarding } = this.props;
    const { hasRatedAnimes } = this.props.navigation.state.params;
    // if Kitsu & topMedia type is anime, navigate to ManageLibrary with
    // hasRatedAnimes flag set true to indicate the text should be for the next media: Manga.
    if ((selectedAccount === 'kitsu' && hasRatedAnimes) || selectedAccount === 'aozora') {
      this.props.completeOnboarding();
      const navigateTabs = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
        key: null,
      });
      this.props.navigation.dispatch(navigateTabs);
    } else {
      this.props.navigation.navigate('ManageLibrary', { hasRatedAnimes: true });
    }
  };

  onPressWantToWatch = () => {
    const { wantToWatch } = this.state;
    if (!wantToWatch) {
      this.addToWatchlist();
    } else {
      this.removeFromWatchlist();
    }
  };

  rate = async (ratingTwenty) => {
    const { currentIndex, topMedia } = this.state;
    const { accessToken, userId } = this.props;
    const { type } = this.props.navigation.state.params;
    const id = topMedia[currentIndex].id;
    const libraryEntryId = topMedia[currentIndex].libraryEntryId;
    setToken(accessToken);

    let updatedTopMedia = topMedia.slice();
    updatedTopMedia[currentIndex].isRating = true;
    this.setState({
      topMedia: updatedTopMedia,
    });

    try {
      let response = null;
      if (libraryEntryId) {
        // patch the previous rating
        response = await Kitsu.update('libraryEntries', {
          ratingTwenty,
          id: libraryEntryId,
          [type]: {
            id,
            type,
          },
          user: {
            id: userId,
          },
        });
      } else {
        response = await Kitsu.create('libraryEntries', {
          status: 'completed',
          ratingTwenty,
          [type]: {
            id,
            type,
          },
          user: {
            id: userId,
          },
        });
      }
      updatedTopMedia = updatedTopMedia.slice();
      updatedTopMedia[currentIndex].libraryEntryId = response.id;
      updatedTopMedia[currentIndex].ratingTwenty = ratingTwenty;
      updatedTopMedia[currentIndex].status = 'completed';
      updatedTopMedia[currentIndex].isRating = false;
      const { ratedCount, mediaTotalDuration } = this.calculateDurationCount(updatedTopMedia);
      // console.log('media total duration', mediaTotalDuration);
      this.updateHeaderButton(ratedCount);
      this.setState({
        ratedCount,
        mediaTotalDuration,
        topMedia: updatedTopMedia,
      });
      if (currentIndex + 1 >= updatedTopMedia.length - 4) {
        this.loadMoreMedia();
      }
      this.carousel.snapToNext();
    } catch (e) {
      console.log(e, 'error patching rating');
      updatedTopMedia = updatedTopMedia.slice();
      updatedTopMedia[currentIndex].isRating = false;
      this.setState({
        topMedia: updatedTopMedia,
        ratingTwenty: updatedTopMedia[currentIndex].ratingTwenty,
      });
    }
  };

  removeRating = async () => {
    const { currentIndex, topMedia } = this.state;
    const { accessToken, userId } = this.props;
    const { type } = this.props.navigation.state.params;
    const id = topMedia[currentIndex].id;
    const libraryEntryId = topMedia[currentIndex].libraryEntryId;
    setToken(accessToken);

    let updatedTopMedia = topMedia.slice();
    updatedTopMedia[currentIndex].isRating = true;
    this.setState({
      topMedia: updatedTopMedia,
    });

    try {
      let response = null;
      // patch the previous rating
      response = await Kitsu.update('libraryEntries', {
        ratingTwenty: null,
        id: libraryEntryId,
        [type]: {
          id,
          type,
        },
        user: {
          id: userId,
        },
      });
      updatedTopMedia = updatedTopMedia.slice();
      updatedTopMedia[currentIndex].libraryEntryId = response.id;
      updatedTopMedia[currentIndex].ratingTwenty = null;
      updatedTopMedia[currentIndex].status = null;
      updatedTopMedia[currentIndex].isRating = false;
      const { ratedCount, mediaTotalDuration } = this.calculateDurationCount(updatedTopMedia);
      this.updateHeaderButton(ratedCount);
      this.setState({
        ratedCount,
        mediaTotalDuration,
        topMedia: updatedTopMedia,
      });
    } catch (e) {
      console.log(e, 'error patching rating');
      updatedTopMedia = updatedTopMedia.slice();
      updatedTopMedia[currentIndex].isRating = false;
      this.setState({
        topMedia: updatedTopMedia,
      });
    }
  };

  addToWatchlist = async () => {
    const { currentIndex, topMedia } = this.state;
    const { accessToken, userId } = this.props;
    const { type } = this.props.navigation.state.params;
    const libraryEntryId = topMedia[currentIndex].libraryEntryId;
    const id = topMedia[currentIndex].id;
    setToken(accessToken);

    this.setState({ loadingWtW: true });
    try {
      let response = null;
      if (libraryEntryId) {
        response = await Kitsu.update('libraryEntries', {
          status: 'planned',
          id: libraryEntryId,
          [type]: {
            id,
            type,
          },
          user: {
            id: userId,
          },
        });
      } else {
        response = await Kitsu.create('libraryEntries', {
          status: 'planned',
          [type]: {
            id,
            type,
          },
          user: {
            id: userId,
          },
        });
      }

      const updatedTopMedia = topMedia.slice();
      updatedTopMedia[currentIndex].ratingTwenty = null;
      updatedTopMedia[currentIndex].libraryEntryId = response.id;
      updatedTopMedia[currentIndex].status = 'planned';
      const { ratedCount, mediaTotalDuration } = this.calculateDurationCount(updatedTopMedia);
      this.prepareAnimation();
      this.updateHeaderButton(ratedCount);
      this.setState({
        ratedCount,
        mediaTotalDuration,
        topMedia: updatedTopMedia,
        wantToWatch: true,
        loadingWtW: false,
        ratingTwenty: null,
        selected: null,
      });
      if (currentIndex + 1 >= updatedTopMedia.length - 4) {
        this.loadMoreMedia();
      }
      this.carousel.snapToNext();
    } catch (e) {
      this.setState({ loadingWtW: false });
      console.log(e, 'error adding to watchlist');
    }
  };

  removeFromWatchlist = async () => {
    const { currentIndex, topMedia } = this.state;
    const { accessToken } = this.props;
    setToken(accessToken);
    this.setState({ loadingWtW: true });
    try {
      const { libraryEntryId } = topMedia[currentIndex];
      await Kitsu.destroy('libraryEntries', libraryEntryId);
      const updatedTopMedia = topMedia.slice();
      updatedTopMedia[currentIndex].libraryEntryId = null;
      updatedTopMedia[currentIndex].status = null;
      updatedTopMedia[currentIndex].ratingTwenty = null;
      const { ratedCount, mediaTotalDuration } = this.calculateDurationCount(updatedTopMedia);
      this.prepareAnimation();
      this.updateHeaderButton(ratedCount);
      this.setState({
        ratedCount,
        mediaTotalDuration,
        topMedia: updatedTopMedia,
        wantToWatch: false,
        loadingWtW: false,
        ratingTwenty: null,
        selected: null,
      });
      if (currentIndex + 1 >= updatedTopMedia.length - 4) {
        this.loadMoreMedia();
      }
    } catch (e) {
      this.setState({ loadingWtW: false });
      console.log(e, 'error removing from watchlist');
    }
  };

  updateHeaderButton = (ratedCount = 0) => {
    const target = 5 - ratedCount;
    this.props.navigation.setParams({
      buttonRightText: target > 0 ? `Rate ${target}` : "I'm done",
      buttonRightEnabled: !(target > 0),
      buttonRightOnPress: target > 0 ? () => { } : this.onDone,
    });
  };

  loadInitialMedia = async () => {
    try {
      const topMedia = await this.fetchMedia();
      const ratingTwenty = topMedia[0].ratingTwenty;
      this.setState({
        topMedia,
        selected: ratingTwenty && getSimpleTextForRatingTwenty(ratingTwenty),
        ratingTwenty,
        wantToWatch: topMedia[0].status === 'planned',
        pageIndex: 1,
        fetching: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  loadMoreMedia = async () => {
    const { loadingMore, pageIndex } = this.state;
    if (!loadingMore) {
      this.setState({ loadingMore: true });
      try {
        const topMedia = await this.fetchMedia();
        this.setState({
          loadingMore: false,
          pageIndex: pageIndex + 1,
          topMedia: this.state.topMedia.concat(topMedia),
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  fetchMedia = async () => {
    const { type } = this.props.navigation.state.params;
    const { userId } = this.props;
    const { pageLimit, pageIndex } = this.state;
    let ratedCount = this.state.ratedCount;
    let mediaTotalDuration = this.state.mediaTotalDuration;

    const mediaFields = type === 'anime' ?
      'posterImage,titles,episodeCount,episodeLength' : 'posterImage,titles,chapterCount';

    const mediaIdField = type === 'anime' ? 'anime_id' : 'manga_id';

    let topMedia = await Kitsu.findAll(type, {
      fields: {
        [type]: mediaFields,
      },
      page: {
        limit: pageLimit,
        offset: pageIndex * pageLimit,
      },
      sort: '-averageRating',
    });


    topMedia = await Promise.all(
      topMedia.map(async (media) => {
        const response = await Kitsu.findAll('libraryEntries', {
          fields: {
            libraryEntries: 'ratingTwenty,status',
          },
          filter: {
            user_id: userId,
            [mediaIdField]: media.id,
          },
          page: {
            limit: 1,
          },
        });
        if (response[0] && (response[0].ratingTwenty || response[0].status === 'planned')) {
          ratedCount += 1;
          if (media.episodeLength && media.episodeCount && response[0].status !== 'planned') {
            mediaTotalDuration += media.episodeLength * media.episodeCount;
          }
        }
        return {
          ratingTwenty: null,
          status: null,
          libraryEntryId: response[0] && response[0].id,
          isRating: false,
          ...response[0],
          ...media, // media comes after, overriding anime id
        };
      }),
    );

    this.updateHeaderButton(ratedCount);
    this.setState({ ratedCount, mediaTotalDuration });
    return topMedia;
  };

  calculateDurationCount = (updatedTopMedia) => {
    // Calculates the total episode duration and the # of watched media.
    let ratedCount = 0;
    let mediaTotalDuration = 0;
    // eslint-disable-next-line
    for (const media of updatedTopMedia) {
      if (media.ratingTwenty || media.status === 'planned') {
        ratedCount += 1;
        if (media.episodeLength && media.episodeCount && media.status !== 'planned') {
          mediaTotalDuration += media.episodeLength * media.episodeCount;
        }
      }
      // console.log(media.titles.en, media.episodeLength, media.episodeCount);
    }
    return {
      ratedCount,
      mediaTotalDuration,
    };
  }

  sliderValueChanged = (ratingTwenty) => {
    const { ratingSystem } = this.props;
    if (
      (ratingSystem !== 'advanced' && ratingTwenty >= 1) ||
      (ratingSystem === 'advanced' && ratingTwenty >= 1.5)
    ) {
      this.setState({ ratingTwenty });
    } else {
      this.setState({ ratingTwenty: 0 });
    }
  };

  prepareAnimation = () => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  renderRatingComponents = () => {
    const { ratingSystem } = this.props;
    const { ratingTwenty, selected, wantToWatch } = this.state;
    if (wantToWatch) {
      return <View style={{ height: 50 }} />;
    }
    return ratingSystem === 'simple' ? (
      <SimpleRating onRate={this.onRateSimple} disabled={false} selected={selected} />
    ) : (
      <StarRating
        sliderValueChanged={this.sliderValueChanged}
        onSlidingComplete={this.onSlidingComplete}
        ratingTwenty={ratingTwenty}
        ratingSystem={ratingSystem}
      />
    );
  };

  renderItem = ({ item }) => {
    const { posterImage, titles } = item;
    return (
      <ImageBackground
        style={styles.poster}
        source={{ uri: posterImage.large }}
      >
        {item.isRating ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator color={'white'} size={'large'} />
          </View>
        ) : (
          <LinearGradient colors={['transparent', 'rgb(0,0,0)']} style={styles.posterInnerContainer}>
            <Text style={styles.showTitle}>{titles.en || titles.en_us || titles.en_jp || titles.ja_jp}</Text>
          </LinearGradient>
        )}
      </ImageBackground>
    );
  };

  render() {
    const { ratingSystem } = this.props;
    const { type } = this.props.navigation.state.params;
    const {
      wantToWatch,
      topMedia,
      loadingWtW,
      fetching,
      ratedCount,
      mediaTotalDuration,
    } = this.state;

    const watchOrRead = type === 'manga' ? 'read' : 'watch';

    if (fetching) {
      return (
        <View style={[commonStyles.container, { alignItems: 'center' }]}>
          <ActivityIndicator style={{ marginTop: 80 }} color="white" size="large" />
        </View>
      );
    }
    return (
      <View style={commonStyles.container}>
        <Text style={styles.title}>
          {ratedCount > 0 && type === 'anime' ? (
            `${formatTime(mediaTotalDuration)} spent watching anime`
          ) : (
            `Rate the ${type} you've ${type === 'anime' ? 'seen' : 'read'}`
          )}
        </Text>
        <View style={styles.line} />
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.carouselWrapper}>
            <Carousel
              ref={(c) => {
                this.carousel = c;
              }}
              data={topMedia}
              renderItem={this.renderItem}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width * 0.70}
              onSnapToItem={this.onSwipe}
            />
          </View>
          <View style={[styles.ratingWrapper, { marginVertical: ratingSystem === 'simple' ? 20 : 8 }]}>
            {this.renderRatingComponents()}
          </View>
          <View style={styles.buttonWatchlistWrapper}>
            <TouchableOpacity onPress={this.onPressWantToWatch} style={styles.buttonWatchlist}>
              {loadingWtW ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonWatchlistTitle}>
                  {wantToWatch ? `Saved in Want to ${watchOrRead}` : `Want to ${watchOrRead}`}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ onboarding, auth, user }) => {
  const { selectedAccount } = onboarding;
  const { loading, error, currentUser } = user;
  const { ratingSystem, id: userId } = currentUser;
  const { access_token: accessToken } = auth.tokens;
  return {
    loading,
    selectedAccount,
    error,
    accessToken,
    userId,
    ratingSystem,
  };
};

export default connect(mapStateToProps, { completeOnboarding })(RateScreen);

function formatTime(minutes) {
  const t = minutes * 60 * 1000;
  const cd = 24 * 60 * 60 * 1000;
  const ch = 60 * 60 * 1000;
  let d = Math.floor(t / cd);
  let h = Math.floor((t - d * cd) / ch);
  let m = Math.round((t - d * cd - h * ch) / 60000);
  pad = n => (n < 10 ? `0${n}` : n);
  if (m === 60) {
    h += 1;
    m = 0;
  }
  if (h === 24) {
    d += 1;
    h = 0;
  }
  let dayText = 'days';
  let hourText = 'hours';
  if (d === 1) {
    dayText = 'day';
  }
  if (h === 1) {
    hourText = 'hour';
  }
  if (d === 0) {
    return `${h} ${hourText}`;
  }
  if (h === 0) {
    return `${d} ${dayText}`;
  }
  return `${d} ${dayText}, ${h} ${hourText}`;
}

function getSimpleTextForRatingTwenty(rating) {
  if (!rating) {
    return null;
  } else if (rating <= 5) {
    return 'awful';
  } else if (rating <= 9) {
    return 'meh';
  } else if (rating <= 15) {
    return 'good';
  } else if (rating <= 20) {
    return 'great';
  }
  return null;
}

function getRatingTwentyForText(text, type) {
  if (type !== 'simple') {
    throw new Error('This function should only be used in simple ratings.');
  }

  switch (text) {
    case 'awful':
      return 2;
    case 'meh':
      return 8;
    case 'good':
      return 14;
    case 'great':
      return 20;
    default:
      throw new Error(`Unknown text while determining simple rating type: "${text}"`);
  }
}
