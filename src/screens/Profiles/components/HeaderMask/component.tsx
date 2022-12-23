import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';

export const HeaderMask = () => <LinearGradient colors={['#000000', 'transparent']} style={styles.headerMaskView} />;
