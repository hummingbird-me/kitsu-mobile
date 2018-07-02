import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  seperator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightGrey,
  },
  item: {
    paddingVertical: 8,
  },
  item__selected: {
    backgroundColor: colors.green,
  },
  itemUrl: {
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  itemUrl__selected: {
    color: colors.white,
  },
});
