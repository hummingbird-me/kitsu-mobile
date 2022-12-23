import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './styles';

interface StepProps {
  title: string;
  desc: string;
}

const Step = ({
  title,
  desc,
  image
}: StepProps) => (
  <View style={styles.stepContainer}>
    <View style={styles.slide}>
      <FastImage style={styles.stepImage} source={image} cache="web" />
      <Text style={styles.text}>{title.toUpperCase()}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  </View>
);

export default Step;
