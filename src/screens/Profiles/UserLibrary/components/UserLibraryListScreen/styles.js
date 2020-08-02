import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple,
    flex: 1,
  },
  searchBox: {
    height: 35,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  searchText: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 12,
    fontWeight: '600',
    color: colors.lightGrey,
    textAlign: 'center',
  },
  searchIcon: {
    paddingHorizontal: 4,
    color: colors.lightGrey,
  },
});
