import React from 'react';
import { Platform } from 'react-native';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';

interface StyledProgressiveImageProps {
  borderRadius?: number;
}

export const StyledProgressiveImage = props: StyledProgressiveImageProps => (
  <ProgressiveImage
    style={{
      width: '100%',
      height: '100%',
      borderRadius: props.borderRadius,
    }}
    {...props}
  />
);

StyledProgressiveImage.defaultProps = {
  borderRadius: 0,
};
