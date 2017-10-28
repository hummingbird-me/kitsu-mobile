import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  logoWrapper: { // TODO: set a height to fix top and bottom space.
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.select({ ios: 20, android: 24 }),
  },
  logo: {
    width: 150,
    height: 42,
    resizeMode: 'contain',
  },
});

