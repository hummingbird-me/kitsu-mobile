import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';
import { statusBarHeight, navigationBarHeight } from 'kitsu/constants/app';

// Don't need to check for iPhone X as the container is the one that will pad the content with it.
const TABBAR_HEIGHT = (navigationBarHeight - 1) + statusBarHeight;
const WINDOW_WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
    paddingTop: isX ? paddingX : 0,
  },
  contentContainer: {
    width: WINDOW_WIDTH,
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
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: 0,
  },
  tabBarItem: {
    height: navigationBarHeight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
