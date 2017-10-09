import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { View } from 'react-native';
import ScrollableSection from 'kitsu/screens/Profiles/MediaPages/components/ScrollableSection';
import ImageCard from 'kitsu/screens/Profiles/MediaPages/components/ImageCard';
import { StyledText, HScrollItem } from 'kitsu/screens/Profiles/MediaPages/parts';

export const LibraryActivityBox = ({
  contentDark,
  title,
  data,
  onViewAllPress,
}) => (
  <ScrollableSection
    contentDark={contentDark}
    title={title}
    onViewAllPress={onViewAllPress}
    data={data}
    renderItem={({ item }) => {
      let activity = item.activities[0];
      let caption = '';
      if (activity.verb === 'progressed') {
        caption = `${activity.media.type === 'anime' ? 'Watched ep.' : 'Read ch.'} ${activity.progress}`;
      } else if (activity.verb === 'updated') {
        caption = `${capitalize(activity.status.replace('_', ' '))}`;
      } else if (activity.verb === 'rated') {
        caption = `Rated: ${activity.rating}`;
      }

      return (
        <HScrollItem>
          <ImageCard
            noMask
            variant="portraitLarge"
            source={{ uri: activity.media.posterImage && activity.media.posterImage.original }}
          />
          <View style={{ alignItems: 'center', marginTop: 3 }}>
            <StyledText size="xxsmall">{caption}</StyledText>
          </View>
        </HScrollItem>
      );
    }}
  />
);

LibraryActivityBox.propTypes = {
  contentDark: PropTypes.bool,
  title: PropTypes.string,
  onViewAllPress: PropTypes.func,
  data: PropTypes.array,
};

LibraryActivityBox.defaultProps = {
  contentDark: false,
  title: '',
  placeholderImage: '',
  onViewAllPress: null,
  data: [],
};