import { StyleSheet, Dimensions } from 'react-native';

export const scene = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export const scenePadding = scene.width * 0.03;
