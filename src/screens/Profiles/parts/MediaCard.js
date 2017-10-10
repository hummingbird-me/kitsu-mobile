import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { cardSize } from 'kitsu/screens/Profiles/constants';

const Container = glamorous.view(
  {
    overflow: 'hidden',
  },
  ({ variant, borderRadius }) => ({
    width: cardSize[variant].width,
    height: cardSize[variant].height,
    borderRadius,
  }),
);

const MediaCard = ({ variant, ...props }) => (
  <Container variant={variant} {...props} />
);

MediaCard.propTypes = {
  variant: PropTypes.oneOf(['landscape', 'portrait', 'square', 'landscapeLarge', 'portraitLarge', 'filled']),
  borderRadius: PropTypes.number,
};

MediaCard.defaultProps = {
  variant: 'portrait',
  borderRadius: 6,
};

export default MediaCard;
