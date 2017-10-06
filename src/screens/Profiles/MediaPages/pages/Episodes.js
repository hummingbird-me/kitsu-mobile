import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import glamorous from 'glamorous-native';
import { fetchMedia } from 'kitsu/store/media/actions';
import { lightGrey } from 'kitsu/constants/colors';
import {
  TabHeader,
  TabContainer,
  MediaRow,
} from '../components';

import { borderWidth } from '../constants';

const ItemSeparator = glamorous.view({
  height: borderWidth.hairline,
  alignSelf: 'stretch',
  backgroundColor: lightGrey,
});

class Episodes extends Component {
  formatData(data, numberOfItems = 20) {
    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  renderEpisodes = () => {
    const { media } = this.props;
    const { episodes } = media;

    const data = this.formatData(episodes);

    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <MediaRow
            imageVariant="landscapeSmall"
            title={item.canonicalTitle}
            summary={media.synopsis}
            thumbnail={{ uri: item.thumbnail ? item.thumbnail.original : media.posterImage.large }}
            summaryLines={2}
          />
        )}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListHeaderComponent={() => <TabHeader title="Episodes" contentDark />}
      />
    );
  }

  render() {
    return (
      <TabContainer light padded>
        {this.renderEpisodes()}
      </TabContainer>
    );
  }
}

Episodes.propTypes = {
  media: PropTypes.object.required,
};

Episodes.defaultProps = {
  media: {},
};

const mapStateToProps = (state) => {
  const { media } = state.media;
  const mediaId = 12;
  return {
    media: media[mediaId] || {},
  };
};

export default connect(mapStateToProps, {
  fetchMedia,
})(Episodes);
