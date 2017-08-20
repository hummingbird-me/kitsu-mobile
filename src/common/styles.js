import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const commonStyles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    fontWeight: '600',
  },
  textHeavy: {
    fontWeight: '800',
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
