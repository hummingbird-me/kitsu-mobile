import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

type ImageStatusProps = {
  title: string;
  text: string;
  image: object;
  style?: object;
};

export const ImageStatus = ({
  title,
  text,
  image,
  style,
}: ImageStatusProps) => (
  <View style={[styles.statusWrapper, style]}>
    <Text style={styles.statusTitle}>{title}</Text>
    <Text style={styles.statusText}>{text}</Text>
    <Image style={styles.statusImage} source={image} />
  </View>
);
