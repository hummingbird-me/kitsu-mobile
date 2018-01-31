import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Modal, FlatList, Keyboard, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { SearchBox } from 'kitsu/components/SearchBox';
import { isNull } from 'lodash';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';

const IMAGE_SIZE = { width: 150, height: 100 };

class MediaModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onMediaSelect: PropTypes.func,
    algoliaKeys: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: false,
    onCancelPress: null,
    onMediaSelect: null,
  }

  state = {
    media: {
      anime: [],
      manga: [],
    },
    query: '',
    selected: null,
    activeTab: 0,
    index: 0,
    routes: [
      {
        key: 'anime',
        title: 'Anime',
        apiKey: this.props.algoliaKeys.media.key,
        indexName: this.props.algoliaKeys.media.index,
      },
      {
        key: 'manga',
        title: 'Manga',
        apiKey: this.props.algoliaKeys.media.key,
        indexName: this.props.algoliaKeys.media.index,
      },
    ],
  }

  handleTabChange = (i) => {
    this.setState({ activeTab: i });
  }

  handleDonePress = () => {
    if (this.state.selected && this.props.onMediaSelect) {
      this.props.onMediaSelect(this.state.selected);
    }
  }

  handleCancelPress = () => {
    const { onCancelPress } = this.props;
    onCancelPress();
    this.setState({ selected: null });
  }

  handleSearchStateChange = (query) => {
    this.setState({ query }, () => {
      console.log('Search');
    });
  }

  renderItem({ item }) {
    return (
      <View />
    );
  }

  render() {
    const { visible } = this.props;
    const { media, selected, activeTab, routes } = this.state;

    const activeRoute = routes[activeTab];
    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent={false}
        onRequestClose={this.handleCancelPress}
      >
        <ModalHeader
          title="Select Media"
          leftButtonTitle="Cancel"
          leftButtonAction={this.handleCancelPress}
          rightButtonTitle="Done"
          rightButtonAction={this.handleDonePress}
          rightButtonDisabled={isNull(selected)}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.tabBarContainer}>
            <ScrollableTabBar
              tabs={['Anime', 'Manga']}
              activeTab={activeTab}
              goToPage={this.handleTabChange}
            />
          </View>
          <View style={styles.searchBoxContainer}>
            <SearchBox
              placeholder={`Search for ${activeRoute.title}`}
              searchIconOffset={130}
              style={styles.searchBox}
              value={this.state.query}
              onChangeText={text => this.handleSearchStateChange(text)}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
          <FlatList
            data={media[activeRoute.key]}
            numColumns={bestSpacing.columnCount}
            ItemSeparatorComponent={() => <View />}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
          />
        </View>
      </Modal>
    );
  }
}

const mapper = (state) => {
  const { algoliaKeys } = state.app;
  return {
    algoliaKeys,
  };
};

export default connect(mapper, null)(MediaModal);
