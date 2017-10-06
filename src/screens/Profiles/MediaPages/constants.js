import { StyleSheet, Dimensions } from 'react-native';

export const scene = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export const scenePadding = scene.width * 0.03;

export const coverImageHeight = scene.height * 0.35;

export const spacing = {
  xsmall: 8,
  small: 17,
  default: 24,
  large: 36,
};

export const cardSize = {
  portrait: {
    width: scene.width * 0.28,
    height: scene.height * 0.2,
  },
  portraitLarge: {
    width: scene.width * 0.32,
    height: scene.height * 0.24,
  },
  landscape: {
    width: scene.width * 0.3,
    height: 120,
  },
  landscapeLarge: {
    width: scene.width * 0.75,
    height: 140,
  },
  landscapeSmall: {
    width: scene.width * 0.28,
    height: 60,
  },
  square: {
    height: scene.width * 0.32,
    width: scene.width * 0.32,
  },
  filled: {
    width: '100%',
    height: '100%',
  },
};

export const borderWidth = {
  hairline: StyleSheet.hairlineWidth,
};
