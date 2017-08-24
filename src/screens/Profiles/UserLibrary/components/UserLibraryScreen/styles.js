import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import * as constants from './constants';

export const styles = StyleSheet.create({
  browseText: {
    paddingBottom: 10,
  },
  browseButton: {
    width: 125,
    height: 30,
    borderRadius: 4,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.darkPurple,
    justifyContent: 'center',
  },
  emptyList: {
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: colors.lightGrey,
    flex: 1,
    height: constants.EMPTY_LIST_HEIGHT,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  emptyPosterImageCard: {
    borderColor: colors.lightGrey,
    borderStyle: 'dashed',
    borderWidth: 2,
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
    borderRadius: 3,
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
  searchBar: {
    marginHorizontal: 10,
  },
});
