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
  imageSimpleShadow: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    zIndex: 99,
    marginHorizontal: 3,
  },
  imageSimple: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
    marginHorizontal: 3,
  },
  imageSimpleShadowBackground: {
    backgroundColor: 'rgba(0,0,0,0.4)',
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
  modalStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '34%',
  },
  modalRatingText: {
    color: 'rgb(255, 218, 168)',
    fontSize: 40,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    marginLeft: 12,
  },
  modalNoRatingText: {
    color: colors.lightGrey,
    fontSize: 20,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    minHeight: 36,
    textAlignVertical: 'center',
  },
  modalSlider: {
    marginHorizontal: 30,
  },
  textStar: {
    color: colors.yellow,
    fontWeight: '700',
  },
  textNotRated: {
    color: colors.lightGrey,
    fontWeight: '700',
  },
  textAwful: {
    color: colors.red,
    fontWeight: '700',
  },
  textMeh: {
    color: colors.yellow,
    fontWeight: '700',
  },
  textGood: {
    color: colors.green,
    fontWeight: '700',
  },
  textGreat: {
    color: colors.blue,
    fontWeight: '700',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
