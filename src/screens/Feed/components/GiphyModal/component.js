import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, FlatList, Keyboard, TouchableOpacity, Dimensions } from 'react-native';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { SearchBox } from 'kitsu/components/SearchBox';
import { isEmpty, range } from 'lodash';
import { getBestGridItemSpacing } from 'kitsu/common/utils';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

const apiKey = 'dc6zaTOxFJmzC';
const endpoint = 'https://api.giphy.com/v1/gifs/search?';

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
  }

  handleSearchStateChange = (query) => {
    this.setState({ query }, () => {
      this.searchGIF(query);
    });
  }

  searchGIF = async (query) => {
    // Reset on empty query
    if (isEmpty(query)) {
      this.setState({ gifs: [] });
      return;
    }

    const params = `api_key=${apiKey}&q=${query}`;
    const url = `${endpoint}${params}`;

    // Fetch the GIFS!
    try {
      const response = await fetch(url);
      const giphy = await response.json();
      const gifs = giphy.data.map(e => e.images.original);

      this.setState({ gifs });
    } catch (e) {
      console.log(e);
    }
  }

  renderItem(item, spacing) {
    return (
      <View style={{ width: spacing.width, margin: spacing.margin, backgroundColor: colors.lightGrey }}>
        <TouchableOpacity onPress={() => this.props.onGifSelect(item)}>
          <ProgressiveImage
            source={{ uri: item.url }}
            style={{
              height: spacing.height,
              width: spacing.width,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { visible, onCancelPress } = this.props;
    const { gifs } = this.state;

    // This will make it so the list will be centred should we have any extra space left over
    const padding = { paddingLeft: bestSpacing.extra / 2, paddingTop: bestSpacing.margin / 2 };

    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent={false}
        onRequestClose={onCancelPress}
      >
        <ModalHeader
          title="Select a GIF"
          leftButtonTitle="Cancel"
          leftButtonAction={onCancelPress}
          rightButtonTitle=""
        />
        <View style={{ flex: 1 }}>
          <View style={styles.searchBoxContainer}>
            <SearchBox
              placeholder={'Search for a GIF'}
              searchIconOffset={116}
              style={styles.searchBox}
              value={this.state.query}
              onChangeText={text => this.handleSearchStateChange(text)}
              onSubmitEditing={() => Keyboard.dismiss()}
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
            keyExtractor={item => item.url}
            renderItem={({ item }) => this.renderItem(item, bestSpacing)}
          />
        </View>
      </Modal>
    );
  }
}
