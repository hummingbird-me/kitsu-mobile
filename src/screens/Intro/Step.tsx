import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import styles from './styles';

const Step = ({ title, desc, image }) => (
  <View style={styles.stepContainer}>
    <View style={styles.slide}>
      <FastImage style={styles.stepImage} source={image} cache="web" />
      <Text style={styles.text}>{title.toUpperCase()}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  </View>
);

Step.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default Step;
