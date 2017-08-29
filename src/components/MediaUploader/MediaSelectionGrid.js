import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CameraRoll,
  Dimensions,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from 'react-native';

import * as colors from 'kitsu/constants/colors';

import Thumbnail from './Thumbnail';

let tileSize = 50;
const MEDIA_PAGE_SIZE = 50;

const generatePlaceholders = () => {
  const placeholders = [];

  // The item.node.image.uri shape is for our key extractor.
  for (let i = 1; i < 50; i += 1) {
    placeholders.push({
      node: {
        placeholder: true,
        image: {
          uri: i,
        },
      },
    });
  }

  return placeholders;
};

export default class MediaSelectionGrid extends Component {
  static propTypes = {
    filterContext: PropTypes.string.isRequired,
    minimumTileWidth: PropTypes.number,
    onSelectedImagesChanged: PropTypes.func,
  }

  static defaultProps = {
    minimumTileWidth: 100,
    onSelectedImagesChanged: () => {},
  }

  state = {
    allMedia: generatePlaceholders(),
    selectedMedia: [],

    initialLoad: true,
    hasNextPage: true,
    nextPage: null,

    columns: null,
    tileWidth: null,
  }

  componentWillReceiveProps = (newProps) => {
    if (!this.props || this.props.filterContext !== newProps.filterContext) {
      this.setState({
        allMedia: [],
        nextPage: null,
        initialLoad: true,
      }, () => {
        this.loadMore();
      });
    } else if (this.state.initialLoad) {
      this.loadMore();
    }
  }

  // Force a re-render whenever the device rotates.
  onLayout = () => {
    this.setState({ dimensions: Dimensions.get('window') });
  }

  onToggleTile = (uri) => {
    // Make a copy so we don't mutate state directly.
    const newSelected = this.state.selectedMedia.slice();
    const selectedIndex = this.state.selectedMedia.indexOf(uri);

    if (selectedIndex < 0) {
      newSelected.push(uri);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    this.setState({ selectedMedia: newSelected });

    if (this.props.onSelectedImagesChanged) {
      this.props.onSelectedImagesChanged(newSelected);
    }
  }

  groupTypeForFilterContext = () => {
    // If we're on Android, groupTypes isn't supported.
    if (Platform.OS === 'android') return undefined;

    switch (this.props.filterContext) {
      case 'Photo Stream':
        return 'PhotoStream';
      case 'Camera Roll':
        return 'SavedPhotos';
      default:
        throw new Error(`Unknown filter context: ${this.props.filterContext}`);
    }
  }

  ensureSufficientPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Kitsu Photos Permission',
          message: 'Kitsu needs access to your photos to allow you to choose and upload one.',
        });

      // If they didn't give us the permission, go ahead and show them
      // the nothing here message.
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({
          allMedia: [],
          hasNextPage: false,
          nextPage: null,
          initialLoad: false,
        });

        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }

    return true;
  }

  loadMore = async () => {
    const permissions = await this.ensureSufficientPermissions();
    if (!permissions) return;

    if (!this.state.initialLoad && !this.state.hasNextPage) return;

    const groupTypes = this.groupTypeForFilterContext();

    try {
      const page = await CameraRoll.getPhotos({
        assetType: 'Photos', // This is the default, but we'll change to video later, so left this here.
        groupTypes,
        first: MEDIA_PAGE_SIZE,
        after: this.state.nextPage || undefined, // Null can't be passed over the bridge.
      });

      let existing = this.state.allMedia;

      // Our initial load is full of placeholders. Throw those away.
      if (this.state.initialLoad) {
        existing = [];
      }

      const newAllMedia = [...existing, ...page.edges];

      this.setState({
        allMedia: newAllMedia,
        hasNextPage: page.page_info.has_next_page,
        nextPage: page.page_info.end_cursor,
        initialLoad: false,
      });
    } catch (e) {
      console.log(e);
    }
  }

  renderItem = ({ item }) => {
    const { placeholder, image, playableDuration, type } = item.node;
    const { selectedMedia } = this.state;

    const selectedIndex = selectedMedia.indexOf(image.uri);

    return (
      <Thumbnail
        size={tileSize}
        image={image.uri}
        type={type}
        placeholder={placeholder}
        playableDuration={playableDuration}
        selectedIndex={selectedIndex}
        onToggle={this.onToggleTile}
      />
    );
  }

  render() {
    // Not putting columns in state because we want it updated on every render, and don't
    // want to get in a loop of updates. It needs to be in every render in case the user
    // rotates the phone or similar.
    const availableWidth = Dimensions.get('window').width - (styles.list.margin * 2);
    const columns = Math.floor(availableWidth / this.props.minimumTileWidth);
    tileSize = availableWidth / columns;

    const { allMedia, selectedMedia, initialLoad } = this.state;

    if (allMedia.length === 0) {
      return (
        <View style={styles.emptyWrapper}>
          <Image source={require('../../assets/img/empty.png')} resizeMode="contain" style={styles.emptyImage} />
          <Text style={styles.emptyText}>Oh... there&rsquo;s nothing here.</Text>
        </View>
      );
    }

    // Extra Data prop allows us to signal to the FlatList
    // when it needs to re-render the items even if we haven't
    // changed the other props.
    return (
      <FlatList
        data={allMedia}
        extraData={selectedMedia}
        key={columns} // Will force a completely new grid to come online if we rotate.
        keyExtractor={item => item.node.image.uri}
        numColumns={columns}
        onEndReached={this.loadMore}
        onEndThreshold={100}
        onLayout={this.onLayout}
        renderItem={this.renderItem}
        scrollEnabled={!initialLoad}
        style={styles.list}
      />
    );
  }
}

const styles = {
  list: {
    margin: 2,
    minHeight: '100%',
  },
  placeholder: {
    margin: 2,
    backgroundColor: colors.darkGrey,
  },
  emptyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    minHeight: '95%',
  },
  emptyImage: {
    width: 180,
    height: 180,
    margin: 25,
  },
  emptyText: {
    color: colors.lightGrey,
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
};
