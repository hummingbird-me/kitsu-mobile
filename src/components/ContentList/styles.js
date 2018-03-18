import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  contentListContainer: {
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
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  contentListHeaderText: {
    fontSize: 12,
    fontWeight: '400',
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
    fontWeight: '400',
    fontFamily: 'OpenSans',
    color: '#392F39',
  },
  linkIcon: {
    fontSize: 12,
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
  landscapeImageContainer: {
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  landscapeImage: {
    width: 210,
    height: 100,
    zIndex: 0,
  },
  landscapeImageTitle: {
    color: colors.white,
    zIndex: 1,
    position: 'absolute',
    top: 40,
    backgroundColor: 'transparent',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
