import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
  },
  tutorialText: {
    marginHorizontal: 16,
  },
  startButton: {
    marginBottom: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  brandImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'contain',
  },
  textWrapper: {
    marginHorizontal: 8,
    flex: 1,
  },
  libraryCount: {
    color: colors.white,
    fontFamily: 'OpenSans',
    fontWeight: '200',
    fontSize: 11,
  },
  ps: {
    marginVertical: 16,
    color: colors.white,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontSize: 11,
  },
  iceBackground: {
    width: Dimensions.get('window').width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iceCube: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    bottom: -32,
  },
  errorContainer: {
    flex: 1,
    padding: 8,
  },
  errorText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
