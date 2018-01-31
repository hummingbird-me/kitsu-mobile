import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, FlatList, Keyboard, TouchableOpacity, Dimensions, Text, ActivityIndicator } from 'react-native';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { SearchBox } from 'kitsu/components/SearchBox';
import { isEmpty, range } from 'lodash';
import { getBestGridItemSpacing } from 'kitsu/common/utils';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import * as colors from 'kitsu/constants/colors';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import { scene } from 'kitsu/screens/Feed/constants';
import { kitsuConfig } from 'kitsu/config/env';
import { styles } from './styles';

const IMAGE_SIZE = { width: 150, height: 100 };

function getBestSpacing() {
  const itemWidths = range(150, 300, 5);
  const width = Dimensions.get('window').width;
  const minMargin = 2;

  const best = getBestGridItemSpacing(itemWidths, width, minMargin);

  // The ratio of the poster/image
  const imageRatio = IMAGE_SIZE.width / IMAGE_SIZE.height;

  return {
    columnCount: 3,
    margin: minMargin,
    ...best,
    height: best.width * (1 / imageRatio),
  };
}

// Just need to calculate this once since we don't have landscape.
const bestSpacing = getBestSpacing();

export class GiphyModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onGifSelect: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    onCancelPress: null,
    onGifSelect: null,
  }

  state = {
    gifs: [],
    query: '',
    selected: null,
  }

  componentDidMount() {
    this.searchGIF('');
  }

  handleGIFSelect = (gif) => {
    const { onGifSelect } = this.props;
    onGifSelect(gif);
    this.setState({ selected: null });
  }

  handleCancelPress = () => {
    const { onCancelPress } = this.props;
    onCancelPress();
    this.setState({ selected: null });
  }

  handleSearchStateChange = (query) => {
    this.setState({ query }, () => {
      this.searchGIF(query);
    });
  }

  searchGIF = async (query) => {
    const config = kitsuConfig.giphy;
    const empty = isEmpty(query.trim());
    const api = empty ? config.trending : config.endpoint;

    // Build the params
    let params = `api_key=${config.apiKey}`;
    if (!empty) params += `&q=${query}`;

    // Build the URL
    const url = `${api}${params}`;

    // Fetch the GIFS!
    try {
      const response = await fetch(url);
      const giphy = await response.json();
      const gifs = giphy.data;

      this.setState({ gifs });
    } catch (e) {
      console.log(e);
    }
  }

  renderItem = (item, spacing) => {
    const images = item.images;
    return (
      <View
        style={{
          width: spacing.width,
          margin: spacing.margin,
          backgroundColor: colors.lightGrey,
        }}
      >
        <TouchableOpacity onPress={() => this.setState({ selected: item })}>
          <ProgressiveImage
            source={{ uri: images.downsized_small.url || item.images.fixed_width.url || '' }}
            style={{
              height: spacing.height,
              width: spacing.width,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderSelected(gif) {
    const images = gif.images;
    return (
      <View style={styles.selectedContainer}>
        <View style={styles.selectedButtonContainer}>
          <TouchableOpacity
            onPress={() => this.setState({ selected: null })}
            style={[styles.button, styles.backButton]}
          >
            <Text style={[styles.text, styles.back]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleGIFSelect(gif)}
            style={[styles.button, styles.selectButton]}
          >
            <Text style={[styles.text, styles.select]}>Select</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <View style={styles.loading}>
            <ActivityIndicator color={colors.white} />
          </View>
          <PostImage uri={images.downsized.url || images.original.url || ''} width={scene.width} />
        </View>
      </View>
    );
  }

  render() {
    const { visible } = this.props;
    const { gifs, selected, query } = this.state;

    // This will make it so the list will be centred should we have any extra space left over
    const padding = { paddingLeft: bestSpacing.extra / 2, paddingTop: bestSpacing.margin / 2 };

    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent={false}
        onRequestClose={this.handleCancelPress}
      >
        {selected &&
          this.renderSelected(selected)
        }
        <ModalHeader
          title="Select a GIF"
          leftButtonTitle="Cancel"
          leftButtonAction={this.handleCancelPress}
          rightButtonTitle=""
        />
        <View style={{ flex: 1 }}>
          <View style={styles.searchBoxContainer}>
            <SearchBox
              placeholder="Search for a GIF"
              searchIconOffset={116}
              style={styles.searchBox}
              value={query}
              onChangeText={this.handleSearchStateChange}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          {/* TODO: Fetch more gifs on scroll */}
          <FlatList
            style={padding}
            data={gifs}
            getItemLayout={(data, index) => ({
              length: bestSpacing.height,
              offset: bestSpacing.height * index,
              index,
            })}
            numColumns={bestSpacing.columnCount}
            ItemSeparatorComponent={() => <View />}
            keyExtractor={item => item.id}
            renderItem={({ item }) => this.renderItem(item, bestSpacing)}
          />
        </View>
      </Modal>
    );
  }
}
