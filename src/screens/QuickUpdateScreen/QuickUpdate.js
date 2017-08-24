import React, { Component } from 'react';
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
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
      'posterImage',
      'episodeCount',
      'canonicalTitle',
      'titles',
      'synopsis',
      'status',
      'startDate',
    ];

    const USER_FIELDS = [
      'id',
    ];

    const INCLUDE = [
      'anime',
      'manga',
      'unit',
    ];

    try {
      const library = await Kitsu.findAll('libraryEntries', {
        'fields[libraryEntries]': LIBRARY_ENTRIES_FIELDS.join(),
        'fields[anime]': ANIME_FIELDS.join(),
        'fields[user]': USER_FIELDS.join(),
        'filter[status]': 'current,planned',
        'filter[user_id]': this.props.currentUser.id,
        'filter[kind]': 'anime',
        include: INCLUDE.join(),
        'page[offset]': 0,
        'page[limit]': 40,
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
    const { backgroundImageUri, faderOpacity } = this.state;

    // On first load we don't really need to do the fader business.
    if (!backgroundImageUri) {
      this.setState({
        backgroundImageUri: this.state.library[index].anime.posterImage.large,
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
        backgroundImageUri: this.state.library[index].anime.posterImage.large,
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

  renderItem = data => <QuickUpdateCard data={data} />;

  render() {
    const { backgroundImageUri, faderOpacity, library, filterMode } = this.state;

    if (!library) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        {/* Background Image */}
        <Image
          source={{ uri: backgroundImageUri }}
          style={styles.backgroundImage}
        />
        <Animated.View style={[
          styles.backgroundFaderView,
          { opacity: faderOpacity }]}
        />

        {/* Header */}
        <View style={styles.header}>
          {/* Dummy View, helps with layout to center text */}
          <View style={styles.spacer} />
          <Text style={styles.headerText}>Quick Update</Text>
          <HeaderFilterButton
            mode={filterMode}
            onModeChanged={this.filterModeChanged}
            style={styles.filterButton}
          />
        </View>

        {/* Carousel */}
        <Carousel
          data={library}
          renderItem={this.renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width * 0.85}
          itemHeight={900}
          style={styles.carousel}
          onSnapToItem={this.carouselItemChanged}
          decelerationRate="fast"
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

