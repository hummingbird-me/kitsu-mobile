import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

type StepProps = {
  title: string;
  desc: string;
};

const Step = ({ title, desc, image }: StepProps) => (
  <View style={styles.stepContainer}>
    <View style={styles.slide}>
      <Image style={styles.stepImage} source={image} />
      <Text style={styles.text}>{title.toUpperCase()}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  </View>
);

export default Step;
