import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const commonStyles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    fontWeight: '600',
  },
  textHeavy: {
    fontWeight: '800',
  },
  colorPeach: {
    color: colors.peach,
  },
  colorLightGrey: {
    color: colors.lightGrey,
  },
});
