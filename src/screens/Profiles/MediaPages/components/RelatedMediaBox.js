import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import ScrollableSection from './ScrollableSection';
import ImageCard from './ImageCard';
import { HScrollItem } from '../parts';

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
