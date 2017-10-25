import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';

export const component = ({ media }) => {
  const title = media.titles.en || media.titles.en_jp || media.titles.jp_jp;

  return (
    <TabContainer light padded>
      <TabHeader title="Franchise" contentDark />
      <MediaRow
        title={title}
        summary={media.synopsis}
        thumbnail={{ uri: media.posterImage.large }}
        summaryLines={12}
      />
    </TabContainer>
  );
};

component.propTypes = {
  media: PropTypes.shape({
    titles: PropTypes.object.isRequired,
    synopsis: PropTypes.string.isRequired,
    posterImage: PropTypes.shape({
      large: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
