import React from 'react';
import PropTypes from 'prop-types';
import ScrollableSection from 'kitsu/screens/Profiles/components/ScrollableSection';
import ReactionBox from 'kitsu/screens/Profiles/components/ReactionBox';
import { HScrollItem } from 'kitsu/screens/Profiles/parts';

const ReactionsBox = ({
  reactedMedia,
  title,
  titleAction,
  titleLabel,
  data,
  onViewAllPress,
}) => (
  <ScrollableSection
    title={title}
    titleAction={titleAction}
    titleLabel={titleLabel}
    onViewAllPress={onViewAllPress}
    data={data}
    renderItem={({ item }) => (
      <HScrollItem key={item.key}>
        <ReactionBox
          boxed
          reactedMedia={reactedMedia}
          reaction={item}
        />
      </HScrollItem>
    )}
  />
);

ReactionsBox.propTypes = {
  reactedMedia: PropTypes.string,
  title: PropTypes.string,
  titleLabel: PropTypes.string,
  onViewAllPress: PropTypes.func,
  titleAction: PropTypes.func,
  data: PropTypes.array,
};

ReactionsBox.defaultProps = {
  reactedMedia: '',
  title: '',
  titleLabel: null,
  titleAction: null,
  onViewAllPress: null,
  data: [],
};


export default ReactionsBox;
