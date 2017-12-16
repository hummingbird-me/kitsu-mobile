import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';

const TABBAR_HEIGHT = Platform.select({ ios: 62, android: 54 });

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
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: colors.listBackPurple,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    height: TABBAR_HEIGHT,
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    marginTop: 0,
    justifyContent: 'center',
  },
  tabBarItem: {
    height: 27,
    marginTop: Platform.select({ ios: 8, android: 6 }),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
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
