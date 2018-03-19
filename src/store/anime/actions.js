import { Kitsu } from 'kitsu/config/api';
import * as types from 'kitsu/store/types';

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
    sort: '-userCount',
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
    data = [...getState().anime[`results${type}`]];
  }
  dispatch({ type: pageIndex > 0 ? types.SEARCH_MORE : types.SEARCH, field: 'results' });
  try {
    let query = {
      fields: {
        [type]: 'posterImage,titles,canonicalTitle',
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

    dispatch({ type: types.SEARCH_SUCCESS, field: 'results', payload: data, selected: type });
  } catch (e) {
    console.log('search failed', e);
  }
};
export const getDefaults = (field, type = 'anime') => async (dispatch) => {
  dispatch({ type: types.SEARCH, field });
  try {
    let query = {
      fields: {
        [type]: 'posterImage,titles,canonicalTitle',
      },
    };

    if (defaults[field]) {
      query = {
        ...query,
        ...defaults[field],
      };
    }
    const results = await Kitsu.findAll(type, query);
    dispatch({ type: types.SEARCH_SUCCESS, payload: results, field, selected: type });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.SEARCH_FAIL, payload: `${e[0].title}: ${e[0].detail}` });
  }
};

export const getCategories = (id = '_none', parent = 'level0') => async (dispatch, getState) => {
  dispatch({ type: types.GET_CATEGORIES });
  try {
    const query = {
      fields: {
        categories: 'title,childCount,nsfw',
      },
      filter: {
        parentId: id,
      },
      page: {
        limit: 50,
      },
    };

    const results = await Kitsu.all('categories').get(query);
    let data = results.reduce((acc, curr) => {
      acc[curr.id] = { title: curr.title, id: curr.id, childCount: curr.childCount };
      return acc;
    }, {});
    const { categories } = getState().anime;
    data = { ...categories, [parent]: data };
    dispatch({ type: types.GET_CATEGORIES_SUCCESS, payload: data });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.GET_CATEGORIES_FAIL, payload: `${e[0].title}: ${e[0].detail}` });
  }
};

export const getStreamers = () => async (dispatch) => {
  dispatch({ type: types.GET_STREAMERS });
  try {
    const query = {
      fields: {
        streamers: 'siteName',
      },
    };

    const results = await Kitsu.all('streamers').get(query);
    dispatch({ type: types.GET_STREAMERS_SUCCESS, payload: results });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.GET_STREAMERS_FAIL, payload: `${e[0].title}: ${e[0].detail}` });
  }
};
