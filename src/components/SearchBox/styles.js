import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 3,
    height: 40,
  },
  searchIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  searchIconFocus: {
    left: 0,
    paddingRight: 0,
  },
  input: {
    flex: 1,
    color: colors.black,
    textAlign: 'center',
  },
});
