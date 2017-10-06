import React from 'react';
import PropTypes from 'prop-types';
import SectionBox from './SectionBox';
import ReactionBox from './ReactionBox';
import { HScrollItem } from '../parts';

const ReactionsBox = ({
  reactedMedia,
  title,
  titleAction,
  titleLabel,
  data,
  onViewAllPress,
}) => {
  const items = data.map(item => (
    <HScrollItem key={item.key}>
      <ReactionBox
        boxed
        reactedMedia={reactedMedia}
        reaction={item}
      />
    </HScrollItem>
  ));
  return (
    <SectionBox
      title={title}
      titleAction={titleAction}
      titleLabel={titleLabel}
      onViewAllPress={onViewAllPress}
    >
      {items}
    </SectionBox>
  );
};

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
