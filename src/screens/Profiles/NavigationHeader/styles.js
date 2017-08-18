import { Platform, StatusBar, StyleSheet } from 'react-native';
import * as colors from '../../../constants/colors';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const HEADER_NAVIGATION_IMAGE_HEIGHT = 80;

export const styles = StyleSheet.create({
  backButton: {
    color: '#FFFFFF',
  },
  header: {
    borderColor: 'yellow',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  profileName: {
    color: 'white',
    fontFamily: 'OpenSans',
    fontWeight: '700',
    marginLeft: 5,
  },
  statusBar: {
    borderWidth: 1,
    borderColor: 'red',
    height: STATUS_BAR_HEIGHT,
  },
});
