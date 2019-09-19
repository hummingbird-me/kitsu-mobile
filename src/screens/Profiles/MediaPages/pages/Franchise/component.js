import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity } from 'react-native';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { upperFirst } from 'lodash';
import moment from 'moment';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';

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
  other: 'Other',
};

const renderItem = (item, componentId) => {
  if (!item || !item.destination) return null;

  const type = upperFirst(item.destination.subtype);
  const started = item.destination.startDate;
  const year = started ? moment(started).year() : '';

  let subtitle = `${type} · ${ROLE_LOOKUP_TABLE[item.role]}`;
  subtitle = !!year ? `${subtitle} · ${year}` : subtitle;

  const onPress = () => {
    if (!item || !item.destination) return;
    Navigation.push(componentId, {
      component: {
        name: Screens.MEDIA_PAGE,
        passProps: {
          mediaId: item.destination.id,
          mediaType: item.destination.type,
        },
      },
    });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <MediaRow
        title={item.destination.canonicalTitle}
        summary={item.destination.synopsis}
        subtitle={subtitle}
        summaryLines={4}
        thumbnail={{ uri: item.destination.posterImage && item.destination.posterImage.large }}
      />
    </TouchableOpacity>
  );
};

export const component = ({ media: { mediaRelationships }, componentId }) => {
  const relationships = mediaRelationships || [];
  const sorted = relationships.sort((a, b) => {
    const aStart = a.destination && a.destination.startDate;
    const bStart = b.destination && b.destination.startDate;

    const aStartDate = (aStart && Date.parse(aStart)) || null;
    const bStartDate = (bStart && Date.parse(bStart)) || null;
    const defaultDate = new Date(0);

    return (aStartDate || defaultDate) - (bStartDate || defaultDate);
  });
  return (
    <TabContainer light>
      <FlatList
        data={sorted}
        renderItem={({ item }) => renderItem(item, componentId)}
      />
    </TabContainer>
  );
};

component.propTypes = {
  componentId: PropTypes.any.isRequired,
  media: PropTypes.shape({
    mediaRelationships: PropTypes.shape({
      role: PropTypes.string.isRequired,
      destination: PropTypes.shape({
        canonicalTitle: PropTypes.string.isRequired,
        synopsis: PropTypes.string.isRequired,
        posterImage: PropTypes.shape({
          large: PropTypes.string.isRequired,
        }).isRequired,
        subtype: PropTypes.string.isRequired,
        startDate: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
