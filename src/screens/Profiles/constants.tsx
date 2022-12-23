import { StyleSheet, Dimensions } from 'react-native';

export const scene = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export const scenePadding = scene.width * 0.03;

// The height of the cover image in relation to the scene
export const coverImageHeight = scene.height * 0.35;

export const spacing = {
  xsmall: 8,
  small: 17,
  default: 24,
  large: 36,
};

export const cardSize = {
  portrait: {
    width: 100,
    height: 150,
  },
  portraitLarge: {
    width: 110,
    height: 165,
  },
  landscape: {
    width: 240,
    height: 120,
  },
  landscapeLarge: {
    width: 280,
    height: 140,
  },
  landscapeSmall: {
    width: 120,
    height: 60,
  },
  square: {
    width: 110,
    height: 110,
  },
  thumbnail: {
    height: 100,
    width: 100,
  },
  filled: {
    width: '100%',
    height: '100%',
  },
};

export const borderWidth = {
  hairline: StyleSheet.hairlineWidth,
};
