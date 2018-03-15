import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
  },
  tabBar: {
    backgroundColor: colors.darkPurple,
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
