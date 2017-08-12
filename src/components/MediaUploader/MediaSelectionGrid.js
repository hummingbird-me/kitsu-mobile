import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CameraRoll,
  Dimensions,
  FlatList,
  Text,
  View,
} from 'react-native';
import Thumbnail from './Thumbnail';

let tileSize = 50;

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
    allMedia: [],
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
    switch (this.props.filterContext) {
      case 'All':
        return 'All';
      case 'Camera Roll':
        return 'PhotoStream';
      default:
        throw new Error(`Unknown filter context: ${this.props.filterContext}`);
    }
  }

  loadMore = async () => {
    if (!this.state.initialLoad && !this.state.hasNextPage) return;

    const groupTypes = this.groupTypeForFilterContext();

    const page = await CameraRoll.getPhotos({
      assetType: 'All',
      groupTypes,
      first: 100,
      after: this.state.nextPage || undefined, // Null can't be passed over the bridge.
    });

    const newAllMedia = [...this.state.allMedia, ...page.edges];
    this.setState({
      allMedia: newAllMedia,
      hasNextPage: page.page_info.has_next_page,
      nextPage: page.page_info.end_cursor,
      initialLoad: false,
    });
  }

  renderItem = ({ item }) => {
    const { uri } = item.node.image;
    const { selectedMedia } = this.state;
    const selectedIndex = selectedMedia.indexOf(uri);

    return (
      <Thumbnail
        size={tileSize}
        image={uri}
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

    const { filterContext } = this.props;
    const { allMedia, selectedMedia, initialLoad } = this.state;

    if (initialLoad) {
      return (
        <View style={{ flexGrow: 1 }}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (allMedia.length === 0 && filterContext === 'All') {
      return <Text>No Media in your Photo Library</Text>;
    } else if (allMedia.length === 0) {
      return <Text>No Media in your {filterContext}</Text>;
    }

    // Extra Data prop allows us to signal to the FlatList
    // when it needs to re-render the items even if we haven't
    // changed the other props.
    return (
      <FlatList
        data={allMedia}
        extraData={selectedMedia}
        keyExtractor={item => item.node.image.uri}
        numColumns={columns}
        onEndReached={this.loadMore}
        onEndThreshold={100}
        renderItem={this.renderItem}
        style={styles.list}
      />
    );
  }
}

const styles = {
  list: {
    margin: 2,
  },
};
