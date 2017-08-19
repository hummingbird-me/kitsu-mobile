import { StyleSheet } from 'react-native';
import * as colors from '../../constants/colors';

const HEADER_NAVIGATION_IMAGE_HEIGHT = 60;

export const styles = StyleSheet.create({
  followButton: {
    backgroundColor: '#16A085',
    borderRadius: 3,
    height: 20,
    justifyContent: 'center',
    marginRight: 10,
    width: 95,
    margin: 'auto',
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
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  titleText: {
    fontSize: 14,
    marginLeft: 5,
  },
});
