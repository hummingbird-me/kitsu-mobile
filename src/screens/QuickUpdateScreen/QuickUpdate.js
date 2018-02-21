import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Text,
  RefreshControl,
  View,
  Modal,
  ScrollView,
} from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import URL from 'url-parse';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { Kitsu } from 'kitsu/config/api';
import unstarted from 'kitsu/assets/img/quick_update/unstarted.png';
import emptyComment from 'kitsu/assets/img/quick_update/comment_empty.png';
import { isEmpty, capitalize } from 'lodash';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';

import QuickUpdateEditor from './QuickUpdateEditor';
import QuickUpdateCard from './QuickUpdateCard';
import HeaderFilterButton from './HeaderFilterButton';
import styles from './styles';

const LIBRARY_ENTRIES_FIELDS = [
  'progress',
  'status',
  'rating',
  'ratingTwenty',
  'unit',
  'nextUnit',
  'updatedAt',
];

const MEDIA_FIELDS = [
  'slug',
  'coverImage',
  'posterImage',
  'canonicalTitle',
  'titles',
  'synopsis',
  'status',
  'startDate',
];

const ANIME_FIELDS = [...MEDIA_FIELDS, 'episodeCount'];
const MANGA_FIELDS = [...MEDIA_FIELDS, 'chapterCount'];

const CAROUSEL_HEIGHT = 310;
const DOUBLE_PRESS_DELAY = 500;

const StatusComponent = ({ title, text, image }) => (
  <View style={styles.statusWrapper}>
    <Text style={styles.statusTitle}>{title}</Text>
    <Text style={styles.statusText}>{text}</Text>
    <Image style={styles.statusImage} source={image} />
  </View>
);

StatusComponent.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
};

class QuickUpdate extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarOnPress: navigation.state.params && navigation.state.params.tabListener,
  });
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    // onClose: PropTypes.func.isRequired,
  };

  state = {
    library: null,
    currentIndex: null,
    discussions: null,
    discussionsLoading: false,
    isLoadingNextPage: false,
    filterMode: 'all',
    backgroundImageUri: undefined,
    nextUpBackgroundImageUri: undefined,
    faderOpacity: new Animated.Value(1),
    headerOpacity: new Animated.Value(1),
    editorText: '',
    editing: false,
    refreshing: false,
    ratingSimpleSelected: 0,
  };

  componentWillMount() {
    this.fetchLibrary();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      tabListener: async ({ previousScene, scene, jumpToIndex }) => {
        // capture tap events and detect double press to fetch notifications
        const now = new Date().getTime();
        const doublePressed = this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY;
        if (previousScene.key !== 'QuickUpdate' || doublePressed) {
          this.lastTap = null;
          jumpToIndex(scene.index);
          this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
        } else {
          this.lastTap = now;
        }
      },
    });
  }

  onEditorChanged = (editorText) => {
    this.setState({ editorText });
  };

  onRate = ratingTwenty => this.rate(ratingTwenty);

  getItemLayout = (data, index) => {
    const { width } = Dimensions.get('window');

    return {
      length: width / 5,
      offset: (width / 5) * index,
      index,
    };
  };

  // Timer for scrolling top back (double tap on tab)
  lastTap = null;

  rate = async (ratingTwenty) => {
    const { currentIndex, library } = this.state;
    const entry = library[currentIndex];
    const media = getMedia(entry);
    const mediaType = entry.anime ? 'anime' : 'manga';
    try {
      await Kitsu.update('libraryEntries', {
        ratingTwenty,
        id: entry.id,
        [mediaType]: {
          id: media.id,
          type: mediaType,
        },
        user: {
          id: this.props.currentUser.id,
        },
      });
      this.refetchLibraryEntry(entry);
    } catch (e) {
      console.log(e);
    }
  };

  cursor = undefined
  resetFeed = (cb) => {
    this.cursor = undefined;
    this.setState({ discussions: null }, cb);
  };

  fetchDiscussions = async (entry) => {
    this.setState({ discussionsLoading: true });
    try {
      const [unit] = entry.unit;
      const posts = await Kitsu.find('episodeFeed', unit.id, {
        include:
          'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga',
        filter: { kind: 'posts' },
        page: {
          limit: 10,
          cursor: this.cursor,
        },
      });

      // I need to read the cursor value out of the 'next' link in the result.
      const url = new URL(posts.links.next, true);
      this.cursor = url.query['page[cursor]'];

      const processed = preprocessFeed(posts);
      const discussions = [...(this.state.discussions || []), ...processed];
      this.setState({ discussions, discussionsLoading: false });
    } catch (e) {
      console.log(e);
      // Something went wrong, stop the spinner.
      this.setState({ discussions: [], discussionsLoading: false });
    }
  };

  fetchNextPage = async (entry) => {
    if (this.state.isLoadingNextPage || !this.cursor) { return; }
    this.setState({ isLoadingNextPage: true });
    await this.fetchDiscussions(entry);
    this.setState({ isLoadingNextPage: false });
  };

  fetchLibrary = async () => {
    this.setState({ loading: true });
    let { filterMode } = this.state;
    filterMode = filterMode === 'all' ? undefined : filterMode;

    try {
      const fields = getRequestFields(filterMode);
      const includes = filterMode || 'anime,manga';
      const library = await Kitsu.findAll('libraryEntries', {
        fields,
        filter: {
          status: 'current,planned',
          user_id: this.props.currentUser.id,
          kind: filterMode,
        },
        include: `${includes},unit,nextUnit`,
        page: { limit: 15 },
        sort: 'status,-progressed_at,-updated_at',
      });

      // See else statement, api may return
      // library = [meta: Object, links: Object]
      if (library.length !== 0) {
        this.setState(
          {
            library,
            loading: false,
          },
          () => {
            this.carouselItemChanged(0);
          },
        );
      } else {
      // TODO: handle the case where libraryEntries is undefined
      // Apparently we don't have any library entries.
        this.setState({ library: [] });
      }
    } catch (e) {
      console.log(e);
    }
  };

  refetchLibraryEntry = async (libraryEntry) => {
    const index = this.state.library.indexOf(libraryEntry);
    let library = [...this.state.library];

    // Tell the entry it's loading.
    library[index].loading = true;
    this.setState({ library });
    try {
      const filterMode = this.state.filterMode === 'all' ? undefined : this.state.filterMode;
      const fields = getRequestFields(filterMode);
      const includes = filterMode || 'anime,manga';
      const entry = await Kitsu.find('libraryEntries', libraryEntry.id, {
        fields,
        include: `${includes},unit,nextUnit`,
      });

      library = [...this.state.library];
      library[index] = entry;

      this.setState({ library });

      this.resetFeed();
      this.fetchDiscussions(entry);
    } catch (e) {
      console.log(e);
    }
  };

  filterModeChanged = (filterMode) => {
    if (filterMode === 'nevermind') { return; }
    this.setState({ filterMode }, () => {
      this.fetchLibrary();
    });
  };

  // These are requests to change the background image.
  // If they happen at all in parallel it looks awful.
  imageFadeOperations = [];
  operationInProgress = false;

  ensureAllImageFadeOperationsHandled = async () => {
    if (this.operationInProgress) {
      return;
    }

    this.operationInProgress = true;

    while (this.imageFadeOperations.length > 0) {
      const index = this.imageFadeOperations.pop();
      const media = getMedia(this.state.library[index]);
      const newBackgroundImage = getImgixCoverImage(media.coverImage) || media.posterImage.original;

      // Clear any remaining ones, they're now irrelevant.
      this.imageFadeOperations.length = 0;

      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        const { backgroundImageUri, faderOpacity } = this.state;

        // On first load we don't really need to do the fader business.
        if (!backgroundImageUri) {
          this.setState({
            backgroundImageUri: newBackgroundImage,
            nextUpBackgroundImageUri: newBackgroundImage,
          });

          return resolve();
        }

        // Otherwise we need to do a fade.
        // Load the new image.
        this.setState({ nextUpBackgroundImageUri: newBackgroundImage });

        // After a short delay fade out the old one.
        Animated.timing(faderOpacity, {
          toValue: 0,
          delay: 400,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Once that's complete, change the image and set our opacity back to 1 for the main one,
          // but with a delay, otherwise there's a flicker when it appears while it loads the other
          // image from the cache.
          this.setState({
            backgroundImageUri: newBackgroundImage,
          });

          Animated.timing(faderOpacity, {
            toValue: 1,
            delay: 300,
            duration: 0,
            useNativeDriver: true,
          }).start(() => resolve());
        });

        return null;
      });
    }

    this.operationInProgress = false;
  };

  carouselItemChanged = (index) => {
    const { library } = this.state;
    this.imageFadeOperations.push(index);
    this.ensureAllImageFadeOperationsHandled();
    const entry = library[index];
    if (entry.progress > 0) {
      this.resetFeed();
      this.fetchDiscussions(entry);
    }
    this.setState({ currentIndex: index });
  };

  hideHeader = () => {
    this.animateHeaderOpacityTo(0);
  };

  showHeader = (delay = 500) => {
    this.animateHeaderOpacityTo(1, delay);
  };

  animateHeaderOpacityTo = (toValue, delay = 0) => {
    const { headerOpacity } = this.state;

    Animated.timing(headerOpacity, {
      toValue,
      delay,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  markComplete = async (libraryEntry) => {
    const result = await Kitsu.update('libraryEntries', {
      id: libraryEntry.id,
      progress: libraryEntry.progress + 1,
    });

    if (!result.progress) {
      Alert.alert('Error', 'Error while updating progress, please try again.', [
        { text: 'OK', style: 'cancel' },
      ]);
    } else {
      this.refetchLibraryEntry(libraryEntry);
    }
  };

  updateTextAndToggle = async (gif) => {
    // Restore any previous text, and then toggle the editor.
    const { library, currentIndex, editorText } = this.state;

    // Add gifs
    let updatedText = (editorText && editorText.trim()) || '';
    if (gif && gif.id) {
      const gifURL = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
      updatedText += `\n${gifURL}`;
    }

    this.setState({ discussionsLoading: !isEmpty(updatedText.trim()) }, this.toggleEditor);

    // Make sure we have something written in the text
    if (isEmpty(updatedText.trim())) return;

    const { currentUser } = this.props;
    const current = library[currentIndex];
    try {
      await Kitsu.create('posts', {
        content: updatedText.trim(),
        media: {
          id: getMedia(current).id, type: current.anime ? 'anime' : 'manga',
        },
        spoiledUnit: { id: current.unit[0].id },
        user: { id: currentUser.id },
      });
      this.resetFeed(() => {
        this.fetchDiscussions(current);
        this.setState({ editorText: '' });
      });
    } catch (e) {
      console.warn('Can not submit discussion post: ', e);
    }
  };

  toggleEditor = () => {
    const { editing, updateText } = this.state;

    if (!editing) {
      this.setState({
        editing: true,
        // Need to copy the current updateText over so the dialog shows with the correct text in it.
        editorText: updateText,
      });
      this.hideHeader();
      // this.props.onBeginEditing();
    } else {
      this.setState({ editing: false });
      this.showHeader(100);
      // this.props.onEndEditing();
    }
  };

  renderPostItem = ({ item }) => (
    <Post
      post={item}
      onPostPress={() => { }}
      currentUser={this.props.currentUser}
      navigateToUserProfile={userId => this.navigateToUserProfile(userId)}
      navigation={this.props.navigation}
    />
  );

  renderItem = data => (
    <QuickUpdateCard
      ratingSystem={this.props.ratingSystem}
      onRate={this.onRate}
      data={data}
      onBeginEditing={this.hideHeader}
      onEndEditing={this.showHeader}
      onViewDiscussion={this.viewDiscussion}
      onMarkComplete={this.markComplete}
    />
  );

  render() {
    const {
      nextUpBackgroundImageUri,
      backgroundImageUri,
      faderOpacity,
      filterMode,
      headerOpacity,
      library,
      loading,
      discussions,
      discussionsLoading,
      isLoadingNextPage,
      currentIndex,
      editorText,
      editing,
      refreshing,
    } = this.state;

    if (loading || !library) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    const entry = library[currentIndex];
    const progress = (entry && entry.progress) || 0;
    const media = entry && (entry.anime || entry.manga);

    const episodeOrChapter = media && media.type === 'manga' ? 'chapter' : 'episode';
    const watchedOrRead = media && media.type === 'manga' ? 'read' : 'watched';

    return (
      <View style={styles.wrapper}>
        {/* Background Image, staging for next image, Cover image for the series. */}
        <Image source={{ uri: nextUpBackgroundImageUri }} style={styles.backgroundImage} />
        <Animated.Image
          source={{ uri: backgroundImageUri }}
          style={[styles.backgroundImage, { opacity: faderOpacity }]}
        />
        <View style={styles.faderCover} />

        {/* Carousel */}
        <ScrollView
          ref={(r) => { this.scrollView = r; }}
          style={styles.contentWrapper}
          stickyHeaderIndices={[2]} // BULLSEYE
        >
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
            {/* Dummy View, helps with layout to center text */}
            <View style={styles.spacer} />
            <Text style={styles.headerText}>Quick Update</Text>
            <HeaderFilterButton
              mode={filterMode}
              onModeChanged={this.filterModeChanged}
              style={styles.filterButton}
            />
          </Animated.View>

          <Carousel
            data={library}
            renderItem={this.renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width * 0.85}
            itemHeight={CAROUSEL_HEIGHT}
            sliderHeight={CAROUSEL_HEIGHT}
            containerCustomStyle={styles.carousel}
            onSnapToItem={this.carouselItemChanged}
          />

          {progress > 0 && <View style={styles.socialContent}>
            <View style={styles.separator} />
            {/* Some padding for status bar when sticked */}
            <View style={{ height: 20, backgroundColor: 'transparent' }} />
            <Text style={styles.discussionTitle}>
              <Text style={styles.bold}>
                {capitalize(episodeOrChapter)}
                {' '}
                {progress}
                {' '}
              </Text>
              Discussion
            </Text>
          </View>}

          {/* Feed */}
          {progress > 0 ? (
            <View style={styles.socialContent}>
              {(!discussionsLoading || isLoadingNextPage) ? (
                <KeyboardAwareFlatList
                  data={discussions}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderPostItem}
                  onEndReached={() => discussions.length && this.fetchNextPage(entry)}
                  onEndReachedThreshold={0.6}
                  ListHeaderComponent={
                    <CreatePostRow
                      title={`What do you think of ${media && media.type === 'anime' ? 'EP' : 'CH'} ${progress}?`}
                      onPress={this.toggleEditor}
                    />
                  }
                  ListFooterComponent={() =>
                    isLoadingNextPage && (
                      <ActivityIndicator />
                    )
                  }
                  ListEmptyComponent={() => (
                    <StatusComponent
                      title="START THE DISCUSSION"
                      text={`Be the first to share your thoughts about ${episodeOrChapter} ${progress}`}
                      image={emptyComment}
                    />
                  )}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                  }
                />
              ) : (
                <ActivityIndicator />
              )}
            </View>
          ) : (
            <ScrollView style={styles.unstartedWrapper}>
              <StatusComponent
                title={`START ${media && media.type === 'manga' ? 'READING' : 'WATCHING'} TO JOIN IN`}
                text={`As you update your progress, you'll see the thoughts from the community on the ${episodeOrChapter}s you've ${watchedOrRead}!`}
                image={unstarted}
              />
            </ScrollView>
          )}
        </ScrollView>

        {/* Editor: Render if there is a unit. */}
        {entry && entry.unit && entry.unit.length > 0 && (
          <Modal animationType="slide" transparent visible={editing}>
            <QuickUpdateEditor
              media={getMedia(entry)}
              currentEpisode={entry.unit[0]}
              progress={progress}
              onChange={this.onEditorChanged}
              onCancel={this.toggleEditor}
              onDone={this.updateTextAndToggle}
              value={editorText}
            />
          </Modal>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  const { ratingSystem } = currentUser;
  return { currentUser, ratingSystem };
};

export default connect(mapStateToProps)(QuickUpdate);

function getRequestFields(filterMode) {
  const fields = {
    libraryEntries: LIBRARY_ENTRIES_FIELDS.join(),
    user: 'id',
  };

  if (filterMode === undefined) {
    fields.anime = ANIME_FIELDS.join();
    fields.manga = MANGA_FIELDS.join();
    fields.libraryEntries = [fields.libraryEntries, 'anime', 'manga'].join();
  } else {
    fields[filterMode] = filterMode === 'anime' ? ANIME_FIELDS.join() : MANGA_FIELDS.join();
    fields.libraryEntries = [fields.libraryEntries, filterMode].join();
  }
  return fields;
}

function getMedia(entry) {
  return entry.anime || entry.manga;
}

