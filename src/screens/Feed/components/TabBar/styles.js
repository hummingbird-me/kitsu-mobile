import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingHorizontal: scenePadding,
    backgroundColor: colors.listBackPurple,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabStyle: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
