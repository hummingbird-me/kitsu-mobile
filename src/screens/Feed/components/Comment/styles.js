import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    paddingLeft: scenePadding,
  },
  bubble: {
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.lightestGrey,
  },
});
