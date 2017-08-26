import { StyleSheet } from 'react-native';
import * as colors from '../../constants/colors';

const HEADER_NAVIGATION_IMAGE_HEIGHT = 60;

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
    paddingBottom: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
});
