import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';
import { statusBarHeight } from 'kitsu/constants/app';

const TABBAR_HEIGHT = 43 + statusBarHeight;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
    paddingTop: isX ? paddingX : 0,
  },
  sceneContainer: {
    flex: 1,
    marginBottom: 10,
  },
  scrollView: {
    backgroundColor: colors.listBackPurple,
  },
  scrollViewContentContainer: {
    paddingBottom: TABBAR_HEIGHT,
  },
  searchBox: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 2,
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: colors.listBackPurple,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    height: TABBAR_HEIGHT,
    justifyContent: 'flex-end',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginVertical: 0,
  },
  tabBarItem: {
    height: 28,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarTextActive: {
    color: colors.red,
    fontWeight: 'bold',
  },
  tabBarText: {
    color: '#ffffff',
    fontFamily: 'OpenSans',
    fontWeight: '600',
    fontSize: 12,
  },
});
