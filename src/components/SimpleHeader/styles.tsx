import { StyleSheet } from 'react-native';

import { flattenCommon } from 'kitsu/common/styles';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'flex-end',
    backgroundColor: colors.listBackPurple,
    flexDirection: 'row',
    height: navigationBarHeight + statusBarHeight + (isX ? paddingX : 0),
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    elevation: 3,
    zIndex: 2,
  },
  headerItemText: {
    ...flattenCommon('text'),
    color: colors.lightGrey,
    fontSize: 16,
  },
  headerTitleText: {
    ...flattenCommon('text', 'textHeavy'),
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  leftContainer: {
    marginRight: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  titleContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  rightContainer: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
