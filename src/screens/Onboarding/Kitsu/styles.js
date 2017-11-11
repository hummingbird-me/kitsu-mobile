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
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkGrey,
    marginVertical: 10,
  },
  carouselWrapper: {
    height: 380,
    marginTop: 10,
  },
  poster: {
    width: 260, // should match carousel component itemWidth prop value.
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
  imageSimpleShadow: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 99,
    marginHorizontal: 2,
  },
  imageSimple: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginHorizontal: 2,
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
    marginTop: 20,
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
  ratingWrapper: {},
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
