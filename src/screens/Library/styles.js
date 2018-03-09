import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';
import { isX, paddingX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple,
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#3C2D3B',
    borderTopWidth: 0,
  },
  tabBarContainer: {
    paddingVertical: 8,
  },
  tabItem: {
    backgroundColor: colors.extraDarkPurple,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  tabItem__selected: {
    backgroundColor: colors.white,
  },
  statusText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  countText: {
    color: colors.white,
  },
  tabText__selected: {
    color: colors.extraDarkPurple,
  },

  headerContainer: {
    height: navigationBarHeight + statusBarHeight + (isX ? paddingX : 0),
    paddingTop: statusBarHeight + (isX ? paddingX : 0),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
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

  typeContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  opacityFill: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
  },
  typeSelectContainer: {
    backgroundColor: colors.darkPurple,
  },
  typeTextContainer: {
    backgroundColor: colors.listBackPurple,
    padding: 14,
    justifyContent: 'center',
    marginTop: 1,
  },
  typeText: {
    textAlignVertical: 'center',
  },
});
