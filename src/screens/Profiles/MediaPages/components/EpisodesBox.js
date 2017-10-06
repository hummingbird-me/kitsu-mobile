import React from 'react';
import PropTypes from 'prop-types';
import SectionBox from './SectionBox';
import ImageCard from './ImageCard';
import { HScrollItem } from '../parts';

const EpisodesBox = ({ contentDark, title, data, placeholderImage, onViewAllPress }) => {
  const items = data.map((item, i) => (
    <HScrollItem>
      <ImageCard
        subtitle={`Ep. ${i + 1} of 12`} // Todo: make this dynamic
        title={item.canonicalTitle}
        variant="landscapeLarge"
        source={{ uri: item.thumbnail ? item.thumbnail.original : placeholderImage }}
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

EpisodesBox.propTypes = {
  contentDark: PropTypes.bool,
  title: PropTypes.string,
  placeholderImage: PropTypes.string,
  onViewAllPress: PropTypes.func,
  data: PropTypes.array,
};

EpisodesBox.defaultProps = {
  contentDark: false,
  title: '',
  placeholderImage: '',
  onViewAllPress: null,
  data: [],
};


export default EpisodesBox;
