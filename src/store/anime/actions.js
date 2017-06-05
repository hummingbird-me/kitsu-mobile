import * as types from '../types';
import { Kitsu } from '../../config/api';

const defaults = {
  popular: {
    sort: '-userCount',
  },
  topAiring: {
    sort: '-userCount',
    filter: { status: 'current' },
  },
  topUpcoming: {
    filter: { status: 'upcoming' },
  },
  highest: {
    sort: '-averageRating',
  },
};

export const search = (filter = {}, sort = {}, pageIndex, field, type = 'anime') => async (
  dispatch,
  getState,
) => {
  let data = [];
  if (pageIndex > 0) {
    data = [...getState().anime.results];
  }
  dispatch({ type: pageIndex > 0 ? types.SEARCH_MORE : types.SEARCH, field: 'results' });
  try {
    let query = {
      fields: {
        [type]: 'posterImage,titles',
      },
      filter,
      sort,
      page: {
        limit: 20,
        offset: pageIndex * 20,
      },
    };
    if (defaults[field]) {
      query = {
        ...query,
        ...defaults[field],
      };
    }
    const results = await Kitsu.findAll([type], query);
    data = [...data, ...results];
    dispatch({ type: types.SEARCH_SUCCESS, field: 'results', payload: data });
  } catch (e) {
    console.log(e);
  }
};
export const getDefaults = (field, type = 'anime') => async (dispatch) => {
  dispatch({ type: types.SEARCH, field });
  try {
    let query = {
      fields: {
        [type]: 'posterImage,titles',
      },
    };

    if (defaults[field]) {
      query = {
        ...query,
        ...defaults[field],
      };
    }
    const results = await Kitsu.findAll(type, query);
    dispatch({ type: types.SEARCH_SUCCESS, payload: results, field });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.SEARCH_FAIL, payload: `${e[0].title}: ${e[0].detail}` });
  }
};
