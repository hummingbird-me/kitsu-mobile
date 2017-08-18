import { Platform, StatusBar, StyleSheet } from 'react-native';
import * as colors from '../../constants/colors';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const HEADER_NAVIGATION_IMAGE_HEIGHT = 80;

export const styles = StyleSheet.create({
  backButton: {
    color: '#FFFFFF',
  },
  followButton: {
    backgroundColor: '#16A085',
    borderRadius: 3,
    height: 20,
    justifyContent: 'center',
    marginRight: 10,
    width: 95,
    margin: 'auto',
  },
  followText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'OpenSans',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerContainer: {
    backgroundColor: colors.darkPurple,
    height: HEADER_NAVIGATION_IMAGE_HEIGHT,
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  titleText: {
    color: 'white',
    fontFamily: 'OpenSans',
    fontWeight: '500',
    marginLeft: 5,
    fontSize: 14,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
});
