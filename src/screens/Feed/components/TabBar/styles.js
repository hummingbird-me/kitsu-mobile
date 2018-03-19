import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import { statusBarHeight, navigationBarHeight } from 'kitsu/constants/app';

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingTop: statusBarHeight,
    paddingHorizontal: scenePadding,
    backgroundColor: colors.listBackPurple,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.7,
    elevation: 3,
    zIndex: 2,
  },
  tabStyle: {
    flex: 1,
    height: navigationBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabStyle__active: {
    borderBottomWidth: 4,
    borderBottomColor: colors.orange,
  },
  tabAvatar: {
    marginRight: 20,
  },
});
