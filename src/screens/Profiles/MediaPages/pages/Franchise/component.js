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

class Franchise extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
  }

  static defaultProps = {
    media: {},
  }

  renderItem = ({ item }) => (
    <MediaRow
      title={item.title}
      summary={item.summary}
      thumbnail={{ uri: item.thumbnail }}
      summaryLines={12}
    />
  )

  renderItemSeperator = () => (
    <View style={styles.itemSeperator} />
  )

  renderHeader = () => (
    <TabHeader title="Franchise" contentDark />
  )

  render = () => {
    const { media } = this.props;

    const data = [{
      title: media.canonicalTitle,
      summary: media.synopsis,
      thumbnail: media.posterImage && media.posterImage.large,
    }];

    return (
      <TabContainer light padded>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderItemSeperator}
          ListHeaderComponent={this.renderHeader}
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
})(Franchise);
