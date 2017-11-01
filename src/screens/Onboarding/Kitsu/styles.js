import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  contentWrapper: {
    flex: 1,
  },
  buttonMedia: {
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: 47,
    borderRadius: 8,
  },
  buttonLogo: {
    width: 120,
    height: 30,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: colors.white,
    padding: 2,
    borderRadius: 4,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  cardText: {
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  cardLogo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    height: 50,
    fontSize: 14,
  },
  poster: {
    width: 260,
    height: 360,
    borderRadius: 8,
    justifyContent: 'flex-end',
  },
  posterContainer: {
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  showTitle: {
    marginBottom: 12,
    fontFamily: 'OpenSans',
    color: colors.white,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSimple: {
    width: 50,
    height: 50,
    marginHorizontal: 4,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'OpenSans',
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    fontSize: 12,
    top: -3,
    marginBottom: 3,
  },
  buttonWatchlistWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonWatchlist: {
    width: 140,
    backgroundColor: colors.transparent,
    borderRadius: 8,
    borderColor: colors.grey,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  buttonWatchlistTitle: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: colors.transparent,
  },
});
