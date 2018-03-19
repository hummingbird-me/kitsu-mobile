import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { flattenCommon } from 'kitsu/common/styles';
import * as constants from './constants';

const emptyBorderStyle = {
  borderColor: 'rgba(255,255,255,0.1)',
  borderRadius: constants.CARD_BORDER_RADIUS,
  borderStyle: 'dashed',
  borderWidth: 2,
};

export const styles = StyleSheet.create({
  browseText: {
    paddingBottom: 10,
    textAlign: 'center',
  },
  browseButton: {
    ...flattenCommon('centerCenter'),
    width: 125,
    height: 30,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  container: {
    ...flattenCommon('centerCenter'),
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  emptyList: {
    ...flattenCommon('centerCenter'),
    ...emptyBorderStyle,
    flex: 1,
    height: constants.EMPTY_LIST_HEIGHT,
    marginHorizontal: 15,
  },
  emptyPosterImageCard: {
    ...emptyBorderStyle,
    height: constants.POSTER_CARD_HEIGHT,
    marginHorizontal: 4,
    width: constants.POSTER_CARD_WIDTH,
  },
  listLastChild: {
    marginBottom: 12,
  },
  listLoadingSpinnerContainer: {
    ...flattenCommon('centerCenter'),
    height: constants.POSTER_CARD_HEIGHT,
    width: constants.POSTER_CARD_WIDTH / 2,
  },
  posterImageCardFirstChild: {
    marginLeft: 12,
  },
  posterImageLoading: {
    backgroundColor: colors.lightPurple,
  },
  loadingList: {
    width: '100%',
    height: constants.POSTER_CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    height: 35,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  searchText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    fontWeight: '600',
    color: colors.lightGrey,
    textAlign: 'center',
  },
  searchIcon: {
    paddingHorizontal: 4,
    color: colors.lightGrey,
  },
});
