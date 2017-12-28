import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';

import { Kitsu } from 'kitsu/config/api';

import QuickUpdateCard from './QuickUpdateCard';
import HeaderFilterButton from './HeaderFilterButton';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';

const LIBRARY_ENTRIES_FIELDS = [
  'progress',
  'status',
  'rating',
  'unit',
  'updatedAt',
  'anime',
  'manga',
];

const ANIME_FIELDS = [
  'slug',
  'coverImage',
  'posterImage',
  'episodeCount',
  'canonicalTitle',
  'titles',
  'synopsis',
  'status',
  'startDate',
];

const CAROUSEL_HEIGHT = 310;

class QuickUpdate extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    // onClose: PropTypes.func.isRequired,
  };

  state = {
    library: null,
    filterMode: 'all',
    backgroundImageUri: undefined,
    nextUpBackgroundImageUri: undefined,
    faderOpacity: new Animated.Value(1),
    headerOpacity: new Animated.Value(1),
  };

  componentWillMount() {
    this.fetchLibrary();
  }

  getItemLayout = (data, index) => {
    const { width } = Dimensions.get('window');

    return {
      length: width / 5,
      offset: width / 5 * index,
      index,
    };
  };

  fetchLibrary = async () => {
    this.setState({ loading: true });

    const { filterMode } = this.state;

    try {
      const library = await Kitsu.findAll('libraryEntries', {
        fields: {
          libraryEntries: LIBRARY_ENTRIES_FIELDS.join(),
          anime: ANIME_FIELDS.join(),
          user: 'id',
        },
        filter: {
          status: 'current,planned',
          user_id: this.props.currentUser.id,
          kind: 'anime',
        },
        include: 'anime,manga,unit',
        page: { limit: 40 },
        sort: 'status,-progressed_at,-updated_at',
      });

      this.setState(
        {
          library,
          loading: false,
        },
        () => {
          this.carouselItemChanged(0);
        },
      );
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
      const entry = await Kitsu.find('libraryEntries', libraryEntry.id, {
        fields: {
          libraryEntries: LIBRARY_ENTRIES_FIELDS.join(),
          anime: ANIME_FIELDS.join(),
          user: 'id',
        },
        include: 'anime,manga,unit',
      });

      library = [...this.state.library];
      library[index] = entry;

      this.setState({ library });
    } catch (e) {
      console.log(e);
    }
  };

  filterModeChanged = (filterMode) => {
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
      const newBackgroundImage = this.state.library[index].anime.coverImage.original;

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
    this.imageFadeOperations.push(index);
    this.ensureAllImageFadeOperationsHandled();
  };

  hideHeader = () => {
    this.animateHeaderOpacityTo(0);
  };

  showHeader = () => {
    this.animateHeaderOpacityTo(1, 500);
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

  renderItem = data => (
    <QuickUpdateCard
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
    } = this.state;

    if (loading || !library) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

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
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
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
          <View
            style={{
              flex: 1,
              backgroundColor: colors.listBackPurple,
              top: -CAROUSEL_HEIGHT / 2,
              paddingTop: CAROUSEL_HEIGHT / 2,
              zIndex: 1,
            }}
          >
            <Text>Episode 9 Discussion</Text>
          </View>
        </View>
        {/* Close Button */}
        {/* <TouchableOpacity style={styles.closeButton} onPress={this.props.onClose}>
          <Icon name="ios-close" size={70} color="white" />
        </TouchableOpacity> */}
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(QuickUpdate);
