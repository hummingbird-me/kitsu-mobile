import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const commonStyles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  centerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 10,
  },
  textHeavy: {
    fontWeight: '800',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  colorWhite: {
    color: colors.white,
  },
  colorActiveRed: {
    color: colors.activeRed,
  },
  colorLightGrey: {
    color: colors.lightGrey,
  },
});

export const flattenCommon = (...styles) => {
  const includedStyles = styles.map(style => commonStyles[style]);
  return StyleSheet.flatten(includedStyles);
};
