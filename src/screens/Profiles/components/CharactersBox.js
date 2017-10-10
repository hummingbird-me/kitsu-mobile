import React from 'react';
import PropTypes from 'prop-types';
import ScrollableSection from 'kitsu/screens/Profiles/components/ScrollableSection';
import ImageCard from 'kitsu/screens/Profiles/components/ImageCard';
import { HScrollItem } from 'kitsu/screens/Profiles/parts';

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
