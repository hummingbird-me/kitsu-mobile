import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 3,
    borderWidth: 0,
  },
  searchIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    padding: 10,
    paddingRight: 120,
  },
  searchIconFocus: {
    left: 0,
    paddingRight: 0,
  },
  input: {
    flex: 1,
    height: 30,
    textAlign: 'center',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
  },
});
