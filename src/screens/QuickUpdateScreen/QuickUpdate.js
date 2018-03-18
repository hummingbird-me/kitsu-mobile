import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Text,
  RefreshControl,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import URL from 'url-parse';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { preprocessFeed, preprocessFeedPost } from 'kitsu/utils/preprocessFeed';
import { Kitsu } from 'kitsu/config/api';
import unstarted from 'kitsu/assets/img/quick_update/unstarted.png';
import emptyComment from 'kitsu/assets/img/quick_update/comment_empty.png';
import { isEmpty, capitalize } from 'lodash';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';
import { KitsuLibrary, KitsuLibraryEvents, KitsuLibraryEventSource } from 'kitsu/utils/kitsuLibrary';

import QuickUpdateEditor from './QuickUpdateEditor';
import QuickUpdateCard from './QuickUpdateCard';
import HeaderFilterButton from './HeaderFilterButton';
import styles from './styles';

// API request fields
const LIBRARY_ENTRIES_FIELDS = [
  'progress',
  'status',
  'rating',
  'ratingTwenty',
  'unit',
  'nextUnit',
  'updatedAt',
];

// API request fields
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
const CAROUSEL_WIDTH = Dimensions.get('window').width;
const CAROUSEL_ITEM_WIDTH = Dimensions.get('window').width * 0.85;
const DOUBLE_PRESS_DELAY = 500;

class QuickUpdate extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarOnPress: navigation.state.params && navigation.state.params.tabListener,
  });

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  };

  state = {
    library: null,
    discussions: null,
    isLoadingFeed: false,
    isLoadingNextFeedPage: false,
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

  // These are requests to change the background image.
  // If they happen at all in parallel it looks awful.
  imageFadeOperations = [];
  imageOperationInProgress = false;
  lastTap = null; // Timer for scrolling top back (double tap on tab)
  cursor = undefined; // Pagination for feeds
  // Pagination for entries
  isLoadingNextPage = false;
  hasNextPage = true;

  get _requestIncludeFields() {
    const filterMode = this.state.filterMode === 'all' ? undefined : this.state.filterMode;
    const includes = filterMode || 'anime,manga';
    return `${includes},unit,nextUnit`;
  }

  componentWillMount() {
    this.fetchLibrary();
  }

  componentDidMount() {
    this.unsubscribeUpdate = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_UPDATE, this.onLibraryEntryUpdated);
    this.unsubscribeDelete = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_DELETE, this.onLibraryEntryDeleted);
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

  componentWillUnmount() {
    this.unsubscribeUpdate();
    this.unsubscribeDelete();
  }

  shouldComponentUpdate(_nextProps, nextState) {
    // Feed has finished loading
    if (this.state.isLoadingFeed && !nextState.isLoadingFeed) {
      if (this._nextFeedOperation) {
        this._nextFeedOperation();
        this._nextFeedOperation = undefined;
      }
    }
    return true;
  }

  onNavigateToSearch = (index) => {
    this.props.navigation.navigate('Search', {}, {
      type: 'Navigation/NAVIGATE',
      routeName: 'SearchAll',
      params: { initialPage: index },
    });
  };

  onEditorChanged = (editorText) => {
    this.setState({ editorText });
  };

  onMediaTapped = (media) => {
    const { navigation } = this.props;
    if (media && navigation) {
      navigation.navigate('MediaPages', { mediaId: media.id, mediaType: media.type });
    }
  }

  onLibraryEntryUpdated = (data) => {
    // Check to see if we got this event from something other than quick update
    const { id, source } = data;
    if (source === KitsuLibraryEventSource.QUICK_UPDATE) return;

    // Find the entry
    const index = this.state.library.findIndex(e => e.id == id);
    if (index > -1) {
      this.updateEntryAtIndex(index);
    }
  }

  async updateEntryAtIndex(index) {
    if (index >= this.state.library.length || index < 0) return;
    // Fetch the entry
    // We need to do this because the new entry that we recieved may not have the `nextUnit` or `unit` set
    const library = [...this.state.library];

    let { filterMode } = this.state;
    filterMode = filterMode === 'all' ? undefined : filterMode;

    const fields = getRequestFields(filterMode);
    const record = await Kitsu.find('libraryEntries', library[index].id, {
      fields,
      include: this._requestIncludeFields,
    });

    library[index] = record;
    this.setState({ library }, () => {
      // Reset the feed
      if (this.carousel.currentIndex === index) {
        this.resetFeed(() => this.fetchEpisodeFeed());
      }
    });
  }

  onLibraryEntryDeleted = (data) => {
    // Check to see if we got this event from something other than Quick update
    const { id, source } = data;
    if (source === KitsuLibraryEventSource.QUICK_UPDATE) return;

    // Find the entry
    const index = this.state.library.findIndex(e => e.id == id);
    // Remove from library and adjust carousel if necessary
    if (index > -1) {
      this.deleteEntryAtIndex(index);
    }
  }

  deleteEntryAtIndex(index) {
    if (index >= this.state.library.length || index < 0) return;

    const library = [...this.state.library];

    // Remove from library
    library.splice(index, 1);
    this.setState({ library }, () => {
      this.resetFeed(() => this.fetchEpisodeFeed());
    });
  }

  rateEntry = async (ratingTwenty) => {
    const { library } = this.state;
    const entry = library[this.carousel.currentIndex];
    const media = getMedia(entry);
    try {
      this.setLibraryEntryLoading();
      const record = await Kitsu.update('libraryEntries', {
        id: entry.id,
        ratingTwenty,
        [media.type]: {
          id: media.id,
        },
        user: {
          id: this.props.currentUser.id,
        },
      }, {
        include: this._requestIncludeFields,
      });
      KitsuLibrary.onLibraryEntryUpdate(entry, record, media.type, KitsuLibraryEventSource.QUICK_UPDATE);
      this.updateLibraryEntry(record);
    } catch (error) {
      console.log('Error rating library entry:', error);
    }
  };

  fetchEpisodeFeed = async () => {
    this.setState({ isLoadingFeed: true });
    try {
      const entry = this.state.library[this.carousel.currentIndex];
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
      this.setState({ discussions, isLoadingFeed: false });
    } catch (error) {
      console.log('Error loading episode feed:', error);
      // Something went wrong, stop the spinner.
      this.setState({ discussions: [], isLoadingFeed: false });
    }
  };

  fetchNextFeedPage = async () => {
    if (this.state.isLoadingNextFeedPage || !this.cursor) { return; }
    this.setState({ isLoadingNextFeedPage: true });
    await this.fetchEpisodeFeed();
    this.setState({ isLoadingNextFeedPage: false });
  };

  resetFeed = (callback) => {
    this.cursor = undefined;
    this.setState({ discussions: null }, callback);
  };

  fetchLibrary = async (loading = true, offset, callback) => {
    if (!this.hasNextPage) { return; }

    this.setState({ loading });
    let { filterMode } = this.state;
    filterMode = filterMode === 'all' ? undefined : filterMode;

    try {
      const fields = getRequestFields(filterMode);
      const library = await Kitsu.findAll('libraryEntries', {
        fields,
        filter: {
          status: 'current,planned',
          user_id: this.props.currentUser.id,
          kind: filterMode,
        },
        include: this._requestIncludeFields,
        page: { limit: 4, offset },
        sort: 'status,-progressed_at,-updated_at',
      });

      // See else statement, api may return
      // library = [meta: Object, links: Object]
      if (library.length !== 0) {
        this.hasNextPage = !!library.links.next;
        if (offset) { // This was a pagination request
          const data = [...this.state.library, ...library];
          this.setState({ library: data, loading: false });
        } else {
          this.setState({ library, loading: false }, () => {
            this.carouselItemChanged(0);
          });
        }
      } else {
        // TODO: handle the case where libraryEntries is undefined
        // Apparently we don't have any library entries.
        if (!offset) {
          this.setState({ library: [], loading: false });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (callback) { callback(); }
    }
  };

  updateLibraryEntry = (record) => {
    const library = [...this.state.library];
    library[this.carousel.currentIndex] = record;
    this.setState({ library });
  };

  setLibraryEntryLoading = () => {
    const library = [...this.state.library];
    library[this.carousel.currentIndex].loading = true;
    this.setState({ library });
  };

  filterModeChanged = (filterMode) => {
    if (filterMode === 'nevermind') { return; }
    this.setState({ filterMode }, this.fetchLibrary);
  };

  ensureAllImageFadeOperationsHandled = async () => {
    if (this.imageOperationInProgress) {
      return;
    }

    this.imageOperationInProgress = true;
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

    this.imageOperationInProgress = false;
  };

  carouselItemChanged = (index) => {
    const { library, isLoadingFeed } = this.state;
    this.imageFadeOperations.push(index);
    this.ensureAllImageFadeOperationsHandled();
    const entry = library[index];
    if (entry.progress > 0) {
      // It's possible that we are still loading the feed from the previous
      // carousel item. If that's the case then wait for it to finish and then load ours
      // instead of entering a race condition.
      if (isLoadingFeed) {
        this._nextFeedOperation = () => this.resetFeed(() => this.fetchEpisodeFeed());
      } else {
        this.resetFeed(() => this.fetchEpisodeFeed());
      }
    }
    // Determine if we need to load the next page
    const numItems = library.length;
    const shouldFetch = (index + 1) >= (numItems / 2);
    if (shouldFetch && !this.isLoadingNextPage) {
      this.isLoadingNextPage = true;
      this.fetchLibrary(false, numItems, () => { this.isLoadingNextPage = false; });
    }
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
    this.setLibraryEntryLoading();
    const media = getMedia(libraryEntry);

    const record = await Kitsu.update('libraryEntries', {
      id: libraryEntry.id,
      progress: libraryEntry.progress + 1,
    }, { include: this._requestIncludeFields });

    if (!record.progress) {
      Alert.alert('Error', 'Error while updating progress, please try again.', [
        { text: 'OK', style: 'cancel' },
      ]);
    } else {
      KitsuLibrary.onLibraryEntryUpdate(libraryEntry, record, media.type, KitsuLibraryEventSource.QUICK_UPDATE);
      this.updateLibraryEntry(record);
      this.resetFeed(() => this.fetchEpisodeFeed());
    }
  };

  updateTextAndToggle = async (gif, nsfw, spoiler) => {
    // Restore any previous text, and then toggle the editor.
    const { library, editorText } = this.state;

    // Add gifs
    let updatedText = (editorText && editorText.trim()) || '';
    if (gif && gif.id) {
      const gifURL = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
      updatedText += `\n${gifURL}`;
    }

    this.setState({ isLoadingFeed: !isEmpty(updatedText.trim()) }, this.toggleEditor);

    // Make sure we have something written in the text
    if (isEmpty(updatedText.trim())) return;

    const { currentUser } = this.props;
    const current = library[this.carousel.currentIndex];
    try {
      const post = await Kitsu.create('posts', {
        spoiler,
        nsfw,
        content: updatedText.trim(),
        media: {
          id: getMedia(current).id, type: current.anime ? 'anime' : 'manga',
        },
        spoiledUnit: { id: current.unit[0].id },
        user: { id: currentUser.id },
      }, { include: 'media,spoiledUnit,user' }); // @TODO: Just assign these locally to reduce payload?

      // Unshift new post into discussions list
      const processed = preprocessFeedPost(post);
      const discussions = [processed, ...this.state.discussions];
      this.setState({ editorText: '', isLoadingFeed: false, discussions });
    } catch (e) {
      console.error('Can not submit discussion post: ', e);
      this.setState({ isLoadingFeed: false });
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

  renderPostItem = ({ item }) => {
    if (item.type !== 'posts') { return null; }
    return (
      <Post
        post={item}
        onPostPress={(props) => this.props.navigation.navigate('PostDetails', props)}
        currentUser={this.props.currentUser}
        navigation={this.props.navigation}
      />
    );
  };

  renderItem = data => (
    <QuickUpdateCard
      ratingSystem={this.props.ratingSystem}
      data={data}
      onBeginEditing={this.hideHeader}
      onEndEditing={this.showHeader}
      onMarkComplete={this.markComplete}
      onRate={this.rateEntry}
      onMediaTapped={this.onMediaTapped}
    />
  );

  renderLoading = () => {
    const { headerOpacity } = this.state;
    return (
      <View style={styles.wrapper}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          {/* Dummy View, helps with layout to center text */}
          <View style={styles.spacer} />
          <Text style={styles.headerText}>Quick Update</Text>
        </Animated.View>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    )
  };

  renderEmptyState = () => {
    const { loading, headerOpacity, filterMode } = this.state;
    const searchIndex = filterMode === 'manga' ? 1 : 0;

    const emptyTitle =
      (filterMode === 'anime' && 'START WATCHING ANIME') ||
      (filterMode === 'manga' && 'START READING MANGA') ||
      'START TRACKING MEDIA';

    const buttonTitle =
      (filterMode === 'anime' && 'Find Anime to Watch') ||
      (filterMode === 'manga' && 'Find Manga to Read') ||
      'Find Media to Add';

    const descriptionType = filterMode === 'all' ? 'anime or manga' : filterMode;

    return (
      <View style={styles.wrapper}>
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this.fetchLibrary}
            />
          }
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.emptyStateContainer}>
            <StatusComponent
              title={emptyTitle}
              text={`As you add ${descriptionType} to your library, they'll start to displaying here and you'll be able to update them and join community discussions.`}
              image={unstarted}
            />
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => this.onNavigateToSearch(searchIndex)}
            >
              <Text style={styles.emptyStateButtonText}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }

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
      isLoadingFeed,
      isLoadingNextFeedPage,
      editorText,
      editing,
      refreshing,
    } = this.state;

    if (loading) {
      return this.renderLoading();
    }

    if (isEmpty(library)) {
      return this.renderEmptyState();
    }

    const entry = library[(this.carousel && this.carousel.currentIndex) || 0];
    const progress = (entry && entry.progress) || 0;
    const media = entry && getMedia(entry);
    const episodeOrChapter = media && media.type === 'manga' ? 'chapter' : 'episode';
    const watchedOrRead = media && media.type === 'manga' ? 'read' : 'watched';

    return (
      <View style={styles.wrapper}>
        {/* Background Image, staging for next image, Cover image for the series. */}
        <FastImage source={{ uri: nextUpBackgroundImageUri }} style={styles.backgroundImage} />
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
            ref={(c) => { this.carousel = c; }}
            data={library}
            renderItem={this.renderItem}
            maxToRenderPerBatch={4}
            onSnapToItem={this.carouselItemChanged}
            sliderWidth={CAROUSEL_WIDTH}
            sliderHeight={CAROUSEL_HEIGHT}
            itemWidth={CAROUSEL_ITEM_WIDTH}
            itemHeight={CAROUSEL_HEIGHT}
            containerCustomStyle={styles.carousel}
          />

          {progress > 0 && (
            <View style={styles.socialContent}>
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
            </View>
          )}

          {/* Feed */}
          {progress > 0 ? (
            <View style={styles.socialContent}>
              {(!isLoadingFeed || isLoadingNextFeedPage) ? (
                <KeyboardAwareFlatList
                  data={discussions || []}
                  keyExtractor={item => item.id}
                  renderItem={this.renderPostItem}
                  onEndReached={() => discussions && discussions.length && this.fetchNextFeedPage()}
                  onEndReachedThreshold={0.6}
                  ListHeaderComponent={
                    <CreatePostRow
                      title={`What do you think of ${media && media.type === 'anime' ? 'EP' : 'CH'} ${progress}?`}
                      onPress={this.toggleEditor}
                    />
                  }
                  ListFooterComponent={() => isLoadingNextFeedPage && <ActivityIndicator />}
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
          <Modal animationType="slide" transparent visible={editing} onRequestClose={this.toggleEditor}>
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

const StatusComponent = ({ title, text, image }) => (
  <View style={styles.statusWrapper}>
    <Text style={styles.statusTitle}>{title}</Text>
    <Text style={styles.statusText}>{text}</Text>
    <FastImage style={styles.statusImage} source={image} />
  </View>
);

StatusComponent.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
};

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

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  const { ratingSystem } = currentUser;
  return { currentUser, ratingSystem };
};

export default connect(mapStateToProps)(QuickUpdate);
