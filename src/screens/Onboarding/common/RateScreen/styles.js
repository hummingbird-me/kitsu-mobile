import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  contentWrapper: {
    flex: 1,
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkGrey,
    marginVertical: 10,
  },
  carouselWrapper: {
    height: Dimensions.get('window').height * 0.58,
    marginTop: 10,
  },
  poster: {
    width: Dimensions.get('window').width * 0.7, // should match carousel component itemWidth prop value.
    height: Dimensions.get('window').height * 0.58,
    borderRadius: 8,
    justifyContent: 'flex-end',
  },
  posterInnerContainer: {
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  showTitle: {
    marginBottom: 12,
    fontFamily: 'OpenSans',
    marginHorizontal: 4,
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  buttonWatchlist: {
    minWidth: 140,
    backgroundColor: colors.transparent,
    borderRadius: 8,
    borderColor: colors.grey,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonWatchlistTitle: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: colors.transparent,
  },
  ratingWrapper: {
    marginVertical: 20,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
