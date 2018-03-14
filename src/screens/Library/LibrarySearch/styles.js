import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.listBackPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    zIndex: 2,
  },
  listHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  listHeaderText: {
    fontFamily: 'OpenSans',
    fontWeight: '800',
    fontSize: 10,
    color: colors.grey,
    paddingVertical: 8,
  },
  searchBox: {
    height: 35,
    margin: 10,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
});
