import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export default StyleSheet.create({
  logoWrapper: { // TODO: set a height to fix top and bottom space.
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.select({ ios: 20, android: 24 }),
  },
  logo: {
    marginTop: 4,
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 34,
    color: colors.white,
    fontFamily: 'Asap-Bold',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

