import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    padding: 8,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    backgroundColor: colors.transparent,
  },
  rowSelected: {
    backgroundColor: colors.white,
  },
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
  username: {
    color: colors.white,
    fontFamily: 'OpenSans',
    fontWeight: '600',
  },
  libraryCount: {
    color: colors.white,
    fontFamily: 'OpenSans',
    fontWeight: '200',
    fontSize: 11,
  },
  textSelected: {
    color: colors.darkPurple,
  },
  ps: {
    marginVertical: 32,
    color: colors.white,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontSize: 11,
  },
});
