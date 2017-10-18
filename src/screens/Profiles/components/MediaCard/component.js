import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { cardSize } from 'kitsu/screens/Profiles/constants';
import { styles } from './styles';

export const MediaCard = ({ variant, borderRadius, ...props }) => (
  <View
    style={[
      styles.mediaCard,
      {
        borderRadius,
        width: cardSize[variant].width,
        height: cardSize[variant].height,
      },
    ]}
    {...props}
  />
);

MediaCard.propTypes = {
  variant: PropTypes.oneOf(['landscape', 'portrait', 'square', 'landscapeLarge', 'portraitLarge', 'filled']),
  borderRadius: PropTypes.number,
};

MediaCard.defaultProps = {
  variant: 'portrait',
  borderRadius: 6,
};
