import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import glamorous from 'glamorous-native';
import { fetchMedia } from 'kitsu/store/media/actions';
import { lightestGrey } from 'kitsu/constants/colors';
import {
  TabHeader,
  TabContainer,
  MediaRow,
} from '../components';

import { borderWidth } from '../constants';

const ItemSeparator = glamorous.view({
  height: borderWidth.hairline,
  alignSelf: 'stretch',
  backgroundColor: lightestGrey,
});

class Franchise extends Component {
  renderFranchise = () => {
    const { media } = this.props;

    const data = [{
      title: media.canonicalTitle,
      summary: media.synopsis,
      thumbnail: media.posterImage.large,
    }];

    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <MediaRow
            title={item.title}
            summary={item.summary}
            thumbnail={{ uri: item.thumbnail }}
            summaryLines={12}
          />
        )}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListHeaderComponent={() => <TabHeader title="Franchise" contentDark />}
      />
    );
  }

  render() {
    return (
      <TabContainer light padded>
        {this.renderFranchise()}
      </TabContainer>
    );
  }
}

Franchise.propTypes = {
  media: PropTypes.object.required,
};

Franchise.defaultProps = {
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
})(Franchise);
