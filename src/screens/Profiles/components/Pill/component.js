import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { orange } from 'kitsu/constants/colors';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const Pill = ({ color, label, onPress }) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={[styles.pill, { backgroundColor: color }]} onPress={onPress}>
      <StyledText color="light" size="xsmall">{label}</StyledText>
    </Container>
  );
};

Pill.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  onPress: PropTypes.func,
};

Pill.defaultProps = {
  color: orange,
  label: '',
  onPress: null,
};
