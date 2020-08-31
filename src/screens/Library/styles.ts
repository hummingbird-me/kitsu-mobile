import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';
import { OpenSans } from 'app/constants/fonts';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
  },
  tabBar: {
    backgroundColor: colors.darkPurple,
    paddingVertical: 8,
    width: '100%',
    flexDirection: 'row',
  },
  tabItem: {
    backgroundColor: colors.extraDarkPurple,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem__selected: {
    backgroundColor: colors.white,
  },
  statusText: {
    alignSelf: 'center',
    fontSize: 16,
    textAlignVertical: 'center',
    lineHeight: 24,
    color: colors.white,
    fontFamily: OpenSans.bold,
  },
  countText: {
    fontWeight: 'normal',
    fontFamily: OpenSans.normal,
  },
  tabText__selected: {
    color: colors.extraDarkPurple,
  },

  typeContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  opacityFill: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
  },
  typeSelectContainer: {
    backgroundColor: colors.listBackPurple,
  },
  typeTextContainer: {
    borderBottomColor: colors.darkPurple,
    borderBottomWidth: 1,
    padding: 14,
    justifyContent: 'center',
  },
  typeText: {
    textAlignVertical: 'center',
  },
});
