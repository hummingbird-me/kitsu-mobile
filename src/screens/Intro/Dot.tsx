import React from 'react';
import { View } from 'react-native';

import styles from './styles';

interface DotProps {
  active: boolean;
}

const Dot = ({ active }: DotProps) => (
  <View style={[styles.stepDot, active ? styles.stepDotActive : '']} />
);

export default Dot;
