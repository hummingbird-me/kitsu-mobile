import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { statusBarHeight, navigationBarHeight } from 'kitsu/constants/app';
import { isX, paddingX } from 'kitsu/utils/isX';

const HEADER_NAVIGATION_IMAGE_HEIGHT = navigationBarHeight + statusBarHeight + (isX ? paddingX : 0);

export const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 10,
  },
  followButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 3,
    height: 20,
    justifyContent: 'center',
    marginRight: 10,
    width: 95,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: navigationBarHeight,
  },
  headerContainer: {
    backgroundColor: colors.darkPurple,
    height: HEADER_NAVIGATION_IMAGE_HEIGHT,
  },
  headerWrapper: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  profileImage: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  titleOnlyContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    backgroundColor: 'transparent',
    fontSize: 14,
  },
  overlay: {
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
