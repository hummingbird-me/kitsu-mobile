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
  posterImageContainer: {
    width: constants.POSTER_CARD_WIDTH,
    marginHorizontal: 4,
  },
  posterImageCard: {
    backgroundColor: colors.lightPurple,
    width: constants.POSTER_CARD_WIDTH,
    height: constants.POSTER_CARD_HEIGHT,
    marginBottom: 2,
    borderRadius: constants.CARD_BORDER_RADIUS,
  },
  posterImageCardFirstChild: {
    marginLeft: 12,
  },
  posterImageLoading: {
    backgroundColor: colors.lightPurple,
  },
  rating: {
    marginTop: 2,
  },
  searchBox: {
    height: 35,
    marginHorizontal: 10,
  },
});
