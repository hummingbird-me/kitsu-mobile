import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 3,
    height: 40,
  },
  searchIcon: {
    backgroundColor: 'transparent',
    paddingLeft: 8,
    paddingRight: 6,
  },
  clearContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  clearIcon: {
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: '80%',
    color: colors.black,
    textAlignVertical: 'center',
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
});
