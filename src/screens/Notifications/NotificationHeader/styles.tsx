import { StyleSheet } from 'react-native';

import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  customHeaderWrapper: {
    height: navigationBarHeight + statusBarHeight + (isX ? paddingX : 0),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: colors.darkPurple,
    paddingHorizontal: 10,
    paddingTop: 10 + (isX ? paddingX : 0),
    paddingBottom: 10,
  },
  customHeaderText: {
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    color: colors.white,
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  customHeaderButton: {
    minWidth: 120,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.transparentWhite,
  },
  customHeaderButtonText: {
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: colors.darkPurple,
    fontSize: 12,
  },
});
