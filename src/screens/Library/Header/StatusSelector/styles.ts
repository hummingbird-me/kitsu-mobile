import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';
import { OpenSans } from 'app/constants/fonts';

export default StyleSheet.create({
  tabBar: {
    backgroundColor: '#3C2D3B',
    paddingVertical: 8,
    paddingHorizontal: 4,
    width: '100%',
    flexDirection: 'row',
  },
  tabItem: {
    backgroundColor: colors.extraDarkPurple,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
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
});
