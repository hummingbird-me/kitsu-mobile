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
    elevation: 3,
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

  emptyStateContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusWrapper: {
    marginTop: 4,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkPurple,
  },
  statusTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.white,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    margin: 4,
    maxWidth: '85%',
  },
  statusText: {
    maxWidth: '85%',
    fontSize: 12,
    color: colors.lightGrey,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    margin: 4,
  },
  statusImage: {
    marginTop: 16,
    width: 140,
    height: 160,
    resizeMode: 'contain',
  },
});
