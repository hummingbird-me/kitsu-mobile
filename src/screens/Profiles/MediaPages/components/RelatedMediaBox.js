import React from 'react';
import PropTypes from 'prop-types';
import SectionBox from './SectionBox';
import ImageCard from './ImageCard';
import { HScrollItem } from '../parts';

const RelatedMediaBox = ({
  contentDark,
  title,
  data,
  onViewAllPress,
}) => {
  const items = data.map(item => (
    <HScrollItem key={item.key}>
      <ImageCard
        variant="portraitLarge"
        title={item.destination.canonicalTitle}
        source={{ uri: item.destination.posterImage && item.destination.posterImage.original }}
      />
    </HScrollItem>
  ));

  return (
    <SectionBox
      contentDark={contentDark}
      title={title}
      onViewAllPress={onViewAllPress}
    >
      {items}
    </SectionBox>
  );
};

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
