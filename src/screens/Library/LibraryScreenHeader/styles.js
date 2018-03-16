import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';
import { isX, paddingX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  headerContainer: {
    height: navigationBarHeight + statusBarHeight + (isX ? paddingX : 0),
    paddingTop: statusBarHeight + (isX ? paddingX : 0),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.listBackPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    elevation: 3,
    zIndex: 2,
  },
  headerContent: {
    flex: 1,
    width: '100%',
  },
  headerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 4,
  },
  arrowIcon: {
    fontSize: 14,
    paddingTop: 2,
    marginLeft: 6,
  },

  rightButtons: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    right: 8,
    flexDirection: 'row',
  },
  rightButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  rightIcon: {
    fontSize: 22,
  },
});
