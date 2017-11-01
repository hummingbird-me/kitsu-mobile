import { StyleSheet, Platform } from 'react-native';

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
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: 3,
    marginLeft: 8,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 32,
    resizeMode: 'contain',
  },
});
