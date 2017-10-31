import { StyleSheet } from 'react-native';
import { lightestGrey } from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  separator: {
    alignSelf: 'stretch',
    backgroundColor: lightestGrey,
  },
  separator__default: {
    height: StyleSheet.hairlineWidth,
  },
  separator__medium: {
    height: StyleSheet.hairlineWidth * 10,
  },
  separator__large: {
    height: StyleSheet.hairlineWidth * 20,
  },
  separator__transparent: {
    backgroundColor: 'transparent',
  },
});
