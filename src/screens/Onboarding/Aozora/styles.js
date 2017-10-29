import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  brandImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    marginVertical: 32,
    color: colors.white,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontSize: 11,
  },
});
