import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './styles';

interface ImageStatusProps {
  title: string;
  text: string;
  image: object;
  style?: object;
}

export const ImageStatus = ({
  title,
  text,
  image,
  style
}: ImageStatusProps) => (
  <View style={[styles.statusWrapper, style]}>
    <Text style={styles.statusTitle}>{title}</Text>
    <Text style={styles.statusText}>{text}</Text>
    <FastImage style={styles.statusImage} source={image} cache="web" />
  </View>
);
