import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';

export const TitleTag = ({ title, style, textStyle }) => (
  <LinearGradient
    start={{ x: 0.0, y: 0.0 }}
    end={{ x: 1.0, y: 1.0 }}
    colors={['#E8784A', '#EA4C89']}
    style={[styles.tag, style]}
  >
    <Text style={[styles.tagText, textStyle]} numberOfLines={1}>{title}</Text>
  </LinearGradient>
);

TitleTag.propTypes = {
  title: PropTypes.string.isRequired,
  style: PropTypes.any,
  textStyle: Text.propTypes.style,
};

TitleTag.defaultProps = {
  style: null,
  textStyle: null,
};
