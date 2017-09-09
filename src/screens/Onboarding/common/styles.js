import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export default StyleSheet.create({
  logoWrapper: { // TODO: set a height to fix top and bottom space.
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '16%', // TODO: lacks symmetry
  },
  logo: {
    width: 50,
    height: 50,
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

