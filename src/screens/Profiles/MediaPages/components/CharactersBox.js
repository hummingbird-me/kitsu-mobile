import React from 'react';
import PropTypes from 'prop-types';
import ScrollableSection from './ScrollableSection';
import ImageCard from './ImageCard';
import { HScrollItem } from '../parts';

const CharactersBox = ({
  contentDark,
  title,
  data,
  placeholderImage,
  onViewAllPress,
}) => (
  <ScrollableSection
    contentDark={contentDark}
    title={title}
    onViewAllPress={onViewAllPress}
    data={data}
    renderItem={({ item }) => (
      <HScrollItem key={item.key}>
        <ImageCard
          variant="portrait"
          title={item.character.name}
          source={{ uri: item.character.image ? item.character.image.original : placeholderImage }}
        />
      </HScrollItem>
    )}
  />
);

CharactersBox.propTypes = {
  contentDark: PropTypes.bool,
  title: PropTypes.string,
  placeholderImage: PropTypes.string,
  onViewAllPress: PropTypes.func,
  data: PropTypes.array,
};

CharactersBox.defaultProps = {
  contentDark: false,
  title: '',
  placeholderImage: '',
  onViewAllPress: null,
  data: [],
};


export default CharactersBox;
