import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

const TABBAR_HEIGHT = 60;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
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
    paddingTop: 20,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    marginRight: 28,
    marginLeft: 28,
  },
  tabBarItem: {
    height: 27,
    marginTop: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  tabBarTextActive: {
    color: colors.tabbarSelectedTextColor,
    fontFamily: 'OpenSans',
    fontWeight: '600',
    opacity: 1,
    fontSize: 12,
  },
  tabBarText: {
    color: '#ffffff',
    fontFamily: 'OpenSans',
    fontWeight: '600',
    opacity: 0.6,
    fontSize: 12,
  },
});
