import React, { Component } from 'react';
import { ActivityIndicator, Animated, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import { debounce } from 'lodash';

import { Kitsu } from 'kitsu/config/api';

import QuickUpdateCard from './QuickUpdateCard';
import HeaderFilterButton from './HeaderFilterButton';

import styles from './styles';


class QuickUpdate extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    library: null,
    filterMode: 'all',
    backgroundImageUri: undefined,
    faderOpacity: new Animated.Value(0.5),
    headerOpacity: new Animated.Value(1),
  }

  componentWillMount() {
    this.fetchLibrary();
  }

  getItemLayout = (data, index) => {
    const { width } = Dimensions.get('window');

    return {
      length: width / 5,
      offset: (width / 5) * index,
      index,
    };
  }

  fetchLibrary = async () => {
    this.setState({ loading: true });

    const { filterMode } = this.state;

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

      this.setState({
        library,
        loading: false,
      }, () => {
        this.carouselItemChanged(0);
      });
    } catch (e) {
      console.log(e);
    }
  }

  filterModeChanged = (filterMode) => {
    this.setState({ filterMode }, () => {
      this.fetchLibrary();
    });
  }

  carouselItemChanged = debounce((index) => {
    const { backgroundImageUri, faderOpacity, library } = this.state;

    const newBackgroundImage = library[index].anime.coverImage.original;

    // On first load we don't really need to do the fader business.
    if (!backgroundImageUri) {
      this.setState({
        backgroundImageUri: newBackgroundImage,
      });

      return;
    }

    // But afterwards, we should:
    // Fade it out by making the black view 100% opaque.
    Animated.timing(faderOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start((finished) => {
      // If we got cancelled, there's another one coming our way.
      if (!finished) return;
      // Once that's complete, change the image.
      this.setState({
        backgroundImageUri: newBackgroundImage,
      });

      // And after a small delay to let it load, fade it back in.
      Animated.timing(faderOpacity, {
        toValue: 0.5,
        duration: 300,
        delay: 50,
        useNativeDriver: true,
      }).start();
    });
  }, 500)

  hideHeader = () => {
    this.animateHeaderOpacityTo(0);
  }

  showHeader = () => {
    this.animateHeaderOpacityTo(1, 500);
  }

  animateHeaderOpacityTo = (toValue, delay = 0) => {
    const { headerOpacity } = this.state;

    Animated.timing(headerOpacity, {
      toValue,
      delay,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  renderItem = data => (
    <QuickUpdateCard
      data={data}
      onBeginEditing={this.hideHeader}
      onEndEditing={this.showHeader}
    />);

  render() {
    const {
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
        {/* Background Image, Cover image for the series. */}
        <Image
          source={{ uri: backgroundImageUri }}
          style={styles.backgroundImage}
        />
        <Animated.View style={[
          styles.backgroundFaderView,
          { opacity: faderOpacity }]}
        />

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
        <Carousel
          data={library}
          renderItem={this.renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width * 0.85}
          itemHeight={900}
          style={styles.carousel}
          onSnapToItem={this.carouselItemChanged}
        />

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={this.props.onClose}>
          <Icon name="ios-close" size={70} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};


export default connect(mapStateToProps)(QuickUpdate);

