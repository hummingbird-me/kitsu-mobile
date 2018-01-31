import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import algolia from 'algoliasearch/reactnative';
import { kitsuConfig } from 'kitsu/config/env';
import { View, Modal, FlatList, Keyboard, TouchableHighlight } from 'react-native';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { SearchBox } from 'kitsu/components/SearchBox';
import { isNull, upperFirst } from 'lodash';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { StyledText } from 'kitsu/components/StyledText';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

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
    media: [],
    query: '',
    page: 0,
    loading: false,
    selected: null,
    apiKey: this.props.algoliaKeys.media.key,
    indexName: this.props.algoliaKeys.media.index,
  }

  componentDidMount() {
    this.doSearch(this.state.query, this.state.page);
  }

  doSearch = (query, page) => {
    const { apiKey, indexName } = this.state;
    const algoliaClient = algolia(kitsuConfig.algoliaAppId, apiKey);
    const algoliaIndex = algoliaClient.initIndex(indexName);

    algoliaIndex.setSettings({
      attributesToRetrieve: [
        'id',
        'slug',
        'kind',
        'canonicalTitle',
        'titles',
        'posterImage',
        'subtype',
        'chapterCount',
        'episodeCount',
        'synopsis',
      ],
    });

    this.setState({ loading: true });

    algoliaIndex.search({ query, page }, (err, content) => {
      let results = {};
      if (!err) {
        media = page > 0 ? [...this.state.media, ...content.hits] : content.hits;
        results = { media };
      }
      this.setState({ ...results, loading: false });
    });
  };

  handleDonePress = () => {
    if (this.state.selected && this.props.onMediaSelect) {
      this.props.onMediaSelect(this.state.selected);
    }
    this.setState({ selected: null });
  }

  handleCancelPress = () => {
    const { onCancelPress } = this.props;
    onCancelPress();
    this.setState({ selected: null });
  }

  handleSearchStateChange = (query) => {
    this.setState({ query, page: 0 }, () => {
      this.doSearch(query, this.state.page);
    });
  }

  loadMore = () => {
    if (!this.state.loading) {
      this.setState({ page: this.state.page + 1 }, () => {
        this.doSearch(this.state.query, this.state.page);
      });
    }
  }

  renderItem = ({ item }) => {
    const { selected } = this.state;
    const isPicked = selected && item.id === selected.id;

    return (
      <TouchableHighlight onPress={() => this.setState({ selected: item })}>
        <View style={styles.pickerRow}>
          <Layout.RowWrap alignItems="center">
            <ProgressiveImage
              source={{ uri: item.posterImage.tiny }}
              style={{ width: 60, height: 90 }}
            />
            <Layout.RowMain>
              <StyledText color="dark" size="small" bold>{item.canonicalTitle || 'Title'}</StyledText>
              <StyledText color="dark" size="xsmall">{upperFirst(item.subtype) || 'Subtype'}</StyledText>
            </Layout.RowMain>
            <View style={[styles.pickerIconCircle, isPicked && styles.pickerIconCircle__isPicked]}>
              <Icon name="ios-checkmark" color="#FFFFFF" style={styles.pickerIcon} />
            </View>
          </Layout.RowWrap>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { visible } = this.props;
    const { media, selected, query } = this.state;
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
          rightButtonTitle={isNull(selected) ? '' : 'Done'}
          rightButtonAction={this.handleDonePress}
          rightButtonDisabled={isNull(selected)}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.searchBoxContainer}>
            <SearchBox
              placeholder={'Search for Media'}
              searchIconOffset={130}
              style={styles.searchBox}
              value={query}
              onChangeText={this.handleSearchStateChange}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <FlatList
            data={media}
            ItemSeparatorComponent={() => <View style={styles.rowPickerSeparator} />}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.5}
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
