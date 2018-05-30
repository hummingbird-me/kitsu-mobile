import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import styles from './styles';

export const ImageStatus = ({ title, text, image, style }) => (
  <View style={[styles.statusWrapper, style]}>
    <Text style={styles.statusTitle}>{title}</Text>
    <Text style={styles.statusText}>{text}</Text>
    <FastImage style={styles.statusImage} source={image} />
  </View>
);

ImageStatus.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  style: PropTypes.object,
};
