import React from 'react';
import PropTypes from 'prop-types';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { HScrollItem } from 'kitsu/screens/Profiles/parts';

const EpisodesBox = ({ contentDark, title, data, placeholderImage, onViewAllPress }) => (
  <ScrollableSection
    contentDark={contentDark}
    title={title}
    onViewAllPress={onViewAllPress}
    data={data}
    renderItem={({ item }) => (
      <HScrollItem>
        <ImageCard
          subtitle="Ep. 1 of 12"
          title={item.canonicalTitle}
          variant="landscapeLarge"
          source={{ uri: item.thumbnail ? item.thumbnail.original : placeholderImage }}
        />
      </HScrollItem>
    )}
  />
);

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
