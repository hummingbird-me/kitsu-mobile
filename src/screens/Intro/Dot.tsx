import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const Dot = ({ active }) => <View style={[styles.stepDot, active ? styles.stepDotActive : '']} />;

Dot.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default Dot;
