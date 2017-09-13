import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.lightPurple,
  },
  contentListContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  darkBg: {
    backgroundColor: colors.lightPurple,
  },
  lightBg: {
    backgroundColor: colors.white,
  },
  lightText: {
    color: colors.white,
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
    fontSize: 10,
    fontWeight: '200',
    fontFamily: 'OpenSans',
    paddingLeft: 4,
  },
  iconDark: {
    color: '#392F39',
  },
  iconLight: {
    color: colors.white,
  },
});
