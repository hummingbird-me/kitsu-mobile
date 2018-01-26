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
} from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { Kitsu } from 'kitsu/config/api';
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

class QuickUpdate extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    // onClose: PropTypes.func.isRequired,
  };

  state = {
    library: null,
    currentIndex: null,
    discussions: null,
    discussionsLoading: false,
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

  onEditorChanged = (editorText) => {
    this.setState({ editorText });
  };

  onRate = (ratingTwenty) => this.rate(ratingTwenty);

  getItemLayout = (data, index) => {
    const { width } = Dimensions.get('window');

    return {
      length: width / 5,
      offset: width / 5 * index,
      index,
    };
  };

  rate = async (ratingTwenty) => {
    const { currentIndex, library } = this.state;
    const entry = library[currentIndex];
    try {
      const response = await Kitsu.update('libraryEntries', {
        ratingTwenty,
        id: entry.id,
        anime: {
          id: entry.anime.id,
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
        },
      });
      const processed = preprocessFeed(posts);
      this.setState({ discussions: processed, discussionsLoading: false });
    } catch (e) {
      console.log(e);
    }
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
          kind: filterMode
        },
        include: `${includes},unit,nextUnit`,
        page: { limit: 15 },
        sort: 'status,-progressed_at,-updated_at',
      });
      this.setState({ library, loading: false }, () => {
        this.carouselItemChanged(0);
      });
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
      const newBackgroundImage = media.coverImage.original;

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

  updateTextAndToggle = () => {
    // Restore any previous text, and then toggle the editor.
    this.setState({ updateText: this.state.editorText }, this.toggleEditor);
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

    return (
      <View style={styles.wrapper}>
        {/* Background Image, staging for next image, Cover image for the series. */}
        <Image source={{ uri: nextUpBackgroundImageUri }} style={styles.backgroundImage} />
        <Animated.Image
          source={{ uri: backgroundImageUri }}
          style={[styles.backgroundImage, { opacity: faderOpacity }]}
        />
        <View style={styles.faderCover} />

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

        {/* Carousel */}
        <View style={styles.contentWrapper}>
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

          {/* Feed */}
          {progress > 0 && (
            <View style={styles.socialContent}>
              <View style={styles.separator} />
              <Text style={styles.discussionTitle}>
                <Text style={styles.bold}>
                  {media && media.type === 'anime' ? 'Episode' : 'Chapter'}
                  {' '}
                  {progress}
                  {' '}
                </Text>
                Discussion
              </Text>

              {!discussionsLoading ? (
                <KeyboardAwareFlatList
                  data={discussions}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderPostItem}
                  onEndReached={() => discussions.length && this.fetchDiscussions(entry)}
                  onEndReachedThreshold={0.6}
                  ListHeaderComponent={
                    <CreatePostRow
                      title={`What do you think of ${media && media.type === 'anime' ? 'EP' : 'CH'} ${progress}?`}
                      onPress={this.toggleEditor}
                    />
                  }
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
                  }
                />
              ) : (
                  <ActivityIndicator />
                )}
            </View>
          )}
        </View>

        {/* Editor */}
        <Modal animationType="slide" transparent visible={editing}>
          <QuickUpdateEditor
            currentEpisode={library[currentIndex]}
            episode={progress}
            onChange={this.onEditorChanged}
            onCancel={this.toggleEditor}
            onDone={this.updateTextAndToggle}
            value={editorText}
          />
        </Modal>
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
    user: 'id'
  };

  if (filterMode === undefined) {
    fields.anime = ANIME_FIELDS.join();
    fields.manga = MANGA_FIELDS.join();
    fields.libraryEntries = [fields.libraryEntries, 'anime', 'manga'].join()
  } else {
    fields[filterMode] = filterMode === 'anime' ? ANIME_FIELDS.join() : MANGA_FIELDS.join();
    fields.libraryEntries = [fields.libraryEntries, filterMode].join()
  }
  return fields;
}

function getMedia(entry) {
  return entry.anime || entry.manga;
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
