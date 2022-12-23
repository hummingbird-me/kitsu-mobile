import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';

export const StyledProgressiveImage = props => (
  <ProgressiveImage
    style={{
      width: '100%',
      height: '100%',
      borderRadius: props.borderRadius,
    }}
    {...props}
  />
);

StyledProgressiveImage.propTypes = {
  borderRadius: PropTypes.number,
};

StyledProgressiveImage.defaultProps = {
  borderRadius: 0,
};
