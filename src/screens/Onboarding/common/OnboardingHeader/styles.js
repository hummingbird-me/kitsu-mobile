import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isX } from 'kitsu/utils/isX';

export default StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    height: 77 + Platform.select({ ios: 0, android: 4 }),
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,
    paddingTop: isX ? 18 : 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: 3,
    marginLeft: 8,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 32,
    resizeMode: 'contain',
  },
  buttonRight: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  buttonRightText: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: colors.lightestGrey,
    backgroundColor: colors.transparent,
  },
  buttonRightEnabled: {
    color: colors.yellow,
  },
});
