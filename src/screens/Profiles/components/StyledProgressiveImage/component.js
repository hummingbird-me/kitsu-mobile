import React from 'react';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { styles } from './styles';

export const StyledProgressiveImage = ({ ...props }) => (
  <ProgressiveImage style={styles.filled} {...props} />
);
