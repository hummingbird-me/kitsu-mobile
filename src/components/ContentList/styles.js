import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  contentListContainer: {
    padding: 10,
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
  landscapeImageContainer: {
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  landscapeImage: {
    width: 200,
    height: 100,
    resizeMode: 'cover',
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
