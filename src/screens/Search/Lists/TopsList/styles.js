import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.lightPurple,
  },
  contentListContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  contentListHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  contentListHeaderText: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    color: '#392F39',
  },
  contentListActionLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentListActionLinkText: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    color: '#392F39',
  },
  linkIcon: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    color: '#392F39',
  },
});
