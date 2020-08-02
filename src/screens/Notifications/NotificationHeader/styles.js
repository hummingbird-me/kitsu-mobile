import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';
import { isX, paddingX } from 'app/utils/isX';
import { navigationBarHeight, statusBarHeight } from 'app/constants/app';


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
    fontFamily: 'OpenSans_400Regular',
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
    fontFamily: 'OpenSans_400Regular',
    color: colors.darkPurple,
    fontSize: 12,
  },
});
