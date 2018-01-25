import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import { statusBarHeight } from 'kitsu/constants/app';

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingTop: statusBarHeight,
    paddingHorizontal: scenePadding,
    backgroundColor: colors.listBackPurple,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabStyle: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
