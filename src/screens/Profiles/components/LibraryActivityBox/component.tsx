import capitalize from 'lodash/capitalize';
import React from 'react';
import { View } from 'react-native';

import { StyledText } from 'kitsu/components/StyledText';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';

interface LibraryActivityBoxProps {
  contentDark?: boolean;
  title?: string;
  onViewAllPress?(...args: unknown[]): unknown;
  data?: unknown[];
}

export const LibraryActivityBox = ({
  contentDark,
  title,
  data,
  onViewAllPress,
}: LibraryActivityBoxProps) => (
  <ScrollableSection
    contentDark={contentDark}
    title={title}
    onViewAllPress={onViewAllPress}
    data={data}
    renderItem={({ item }) => {
      let activity = item.activities[0];
      let caption = '';
      if (activity.verb === 'progressed') {
        caption = `${
          activity.media.type === 'anime' ? 'Watched ep.' : 'Read ch.'
        } ${activity.progress}`;
      } else if (activity.verb === 'updated') {
        caption = `${capitalize(activity.status.replace('_', ' '))}`;
      } else if (activity.verb === 'rated') {
        caption = `Rated: ${activity.rating}`;
      }

      return (
        <ScrollItem>
          <ImageCard
            noMask
            variant="portraitLarge"
            source={{
              uri:
                activity.media.posterImage &&
                activity.media.posterImage.original,
            }}
          />
          <View style={{ alignItems: 'center', marginTop: 3 }}>
            <StyledText size="xxsmall">{caption}</StyledText>
          </View>
        </ScrollItem>
      );
    }}
  />
);

LibraryActivityBox.defaultProps = {
  contentDark: false,
  title: '',
  placeholderImage: '',
  onViewAllPress: null,
  data: [],
};
