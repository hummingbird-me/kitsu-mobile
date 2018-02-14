import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { upperFirst } from 'lodash';
import moment from 'moment';

const ROLE_LOOKUP_TABLE = {
  sequel: 'Sequel',
  prequel: 'Prequel',
  alternative_setting: 'Alt. setting',
  alternative_version: 'Alt. version',
  side_story: 'Side story',
  parent_story: 'Parent story',
  summary: 'Summary',
  full_story: 'Full story',
  spinoff: 'Spin-off',
  adaptation: 'Adaptation',
  anime_adaptation: 'Anime',
  manga_adaptation: 'Manga',
  character: 'Character',
  other: 'Other'
};

export const component = ({ media: { mediaRelationships } }) => (
  <TabContainer light padded>
    <FlatList
      data={mediaRelationships}
      ItemSeparatorComponent={() => <RowSeparator />}
      ListHeaderComponent={() => <TabHeader title="Franchise" contentDark />}
      renderItem={({ item }) => {
        const type = upperFirst(item.destination.subtype);
        const started = item.destination.startDate;
        const year = started ? moment(started).year() : '';

        let subtitle = `${type} · ${ROLE_LOOKUP_TABLE[item.role]}`;
        subtitle = !!year ? `${subtitle} · ${year}` : subtitle;

        return (<MediaRow
          title={item.destination.canonicalTitle}
          summary={item.destination.synopsis}
          subtitle={subtitle}
          summaryLines={4}
          thumbnail={{ uri: item.destination.posterImage.large }}
        />);
      }}
    />
  </TabContainer>
);

component.propTypes = {
  media: PropTypes.shape({
    mediaRelationships: PropTypes.shape({
      role: PropTypes.string.isRequired,
      destination: PropTypes.shape({
        canonicalTitle: PropTypes.string.isRequired,
        synopsis: PropTypes.string.isRequired,
        posterImage: PropTypes.shape({
          large: PropTypes.string.isRequired
        }).isRequired,
        subtype: PropTypes.string.isRequired,
        startDate: PropTypes.string
      }).isRequired
    }).isRequired
  })
};
