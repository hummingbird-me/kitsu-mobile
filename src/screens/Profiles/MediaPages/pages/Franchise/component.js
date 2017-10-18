import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia } from 'kitsu/store/media/actions';
import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';

class Franchise extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
  }

  static defaultProps = {
    media: {},
  }

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
          renderItem={({ item }) => (
            <MediaRow
              title={item.title}
              summary={item.summary}
              thumbnail={{ uri: item.thumbnail }}
              summaryLines={12}
            />
          )}
          ItemSeparatorComponent={() => <RowSeparator />}
          ListHeaderComponent={() => <TabHeader title="Franchise" contentDark />}
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
