import React from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const Step = ({ title, desc, image }) => (
  <View style={styles.stepContainer}>
    <View style={styles.slide}>
      <Image style={styles.stepImage} source={image} />
      <Text style={styles.text}>{title.toUpperCase()}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  </View>
);

Step.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  image: Image.propTypes.source.isRequired,
};

export default Step;
