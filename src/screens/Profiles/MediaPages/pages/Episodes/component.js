import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia } from 'kitsu/store/media/actions';
import {
  TabHeader,
  TabContainer,
  MediaRow,
} from 'kitsu/screens/Profiles/components';

import { styles } from './styles';

class Episodes extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
  }

  static defaultProps = {
    media: {},
  }

  formatData(data, numberOfItems = 20) {
    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  renderListHeader = () => (
    <TabHeader title="Episodes" contentDark />
  )

  renderItem = ({ item }) => {
    const { media } = this.props;

    return (
      <MediaRow
        imageVariant="landscapeSmall"
        title={item.canonicalTitle}
        summary={media.synopsis}
        thumbnail={{ uri: item.thumbnail ? item.thumbnail.original : media.posterImage.large }}
        summaryLines={2}
      />
    );
  }

  renderItemSeperator = () => (
    <View style={styles.itemSeperator} />
  )

  render() {
    const { episodes } = this.props.media;
    const data = this.formatData(episodes);

    return (
      <TabContainer light padded>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderItemSeparator}
          ListHeaderComponent={this.renderListHeader}
        />
      </TabContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { media } = state.media;
  const mediaId = 12;
  return {
    media: media[mediaId] || {},
  };
};

export const component = connect(mapStateToProps, {
  fetchMedia,
})(Episodes);
