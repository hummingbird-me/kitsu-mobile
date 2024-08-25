import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

import { styles } from './styles';

export const HeaderMask = () => (
  <LinearGradient
    colors={['#000000', 'transparent']}
    style={styles.headerMaskView}
  />
);
