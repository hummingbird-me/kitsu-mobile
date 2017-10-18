import React from 'react';
import PropTypes from 'prop-types';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { HScrollItem } from 'kitsu/screens/Profiles/parts';

const RelatedMediaBox = ({
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
    renderItem={({ item }) => (
      <HScrollItem>
        <ImageCard
          variant="portraitLarge"
          title={item.destination.canonicalTitle}
          source={{ uri: item.destination.posterImage && item.destination.posterImage.original }}
        />
      </HScrollItem>
    )}
  />
);

RelatedMediaBox.propTypes = {
  contentDark: PropTypes.bool,
  title: PropTypes.string,
  onViewAllPress: PropTypes.func,
  data: PropTypes.array,
};

RelatedMediaBox.defaultProps = {
  contentDark: false,
  title: '',
  placeholderImage: '',
  onViewAllPress: null,
  data: [],
};


export default RelatedMediaBox;
