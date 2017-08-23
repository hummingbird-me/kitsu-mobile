import * as colors from 'kitsu/constants/colors';
import * as constants from './constants';

export const styles = {
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
  posterImageContainer: {
    width: constants.POSTER_CARD_WIDTH,
    marginLeft: 4,
    marginRight: 4,
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
    marginLeft: 10,
    marginRight: 10,
  },
};
