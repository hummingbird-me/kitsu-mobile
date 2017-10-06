import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { cardSize } from '../constants';

const Container = glamorous.view(
  {
    borderRadius: 6,
    overflow: 'hidden',
  },
  ({ variant }) => ({
    width: cardSize[variant].width,
    height: cardSize[variant].height,
  }),
);

const MediaCard = ({ variant, ...props }) => (
  <Container variant={variant} {...props} />
);

MediaCard.propTypes = {
  variant: PropTypes.oneOf(['landscape', 'portrait', 'square', 'landscapeLarge', 'portraitLarge']),
};

MediaCard.defaultProps = {
  variant: 'portrait',
};

export default MediaCard;
