import * as types from '../types';
import { Kitsu } from '../../config/api';

const defaultSort = {
  popular: '-userCount',
  topAiring: '-userCount',
  highest: '-averageRating',
};

const defaultFilter = {
  topAiring: {
    status: 'current',
  },
  topUpcoming: {
    status: 'upcoming',
  },
};

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

export const search = (filter = {}, sort = {}, pageIndex, field) => async (dispatch, getState) => {
  let data = [];
  if (pageIndex > 0) {
    data = [...getState().anime.results];
  }
  dispatch({ type: pageIndex > 0 ? types.SEARCH_MORE : types.SEARCH, field: 'results' });
  try {
    let query = {
      fields: {
        anime: 'posterImage',
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
    const results = await Kitsu.findAll('anime', query);
    data = [...data, ...results];
    dispatch({ type: types.SEARCH_SUCCESS, field: 'results', payload: data });
  } catch (e) {
    console.log(e);
  }
};
export const getDefaults = field => async (dispatch) => {
  dispatch({ type: types.SEARCH, field });
  try {
    let query = {
      fields: {
        anime: 'posterImage',
      },
    };

    if (defaults[field]) {
      query = {
        ...query,
        ...defaults[field],
      };
    }
    const results = await Kitsu.findAll('anime', query);
    dispatch({ type: types.SEARCH_SUCCESS, payload: results, field });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.SEARCH_FAIL, payload: `${e[0].title}: ${e[0].detail}` });
  }
};
