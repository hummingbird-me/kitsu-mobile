import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { orange } from 'kitsu/constants/colors';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const Pill = ({ color, label }) => (
  <View style={[styles.pill, { backgroundColor: color }]}>
    <StyledText color="light" size="xsmall">{label}</StyledText>
  </View>
);

Pill.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
};

Pill.defaultProps = {
  color: orange,
  label: '',
};
