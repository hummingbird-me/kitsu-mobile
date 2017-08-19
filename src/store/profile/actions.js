import _ from 'lodash';
import * as types from 'kitsu/store/types';
import { Kitsu } from 'kitsu/config/api';

export const fetchProfile = id => async (dispatch) => {
  dispatch({ type: types.FETCH_USER });
  try {
    const user = await Kitsu.findAll('users', {
      filter: {
        id,
      },
      fields: {
        users: 'waifuOrHusbando,gender,location,birthday,createdAt,followersCount,followingCount' +
          ',coverImage,avatar,about,name,waifu',
      },
      include: 'waifu',
    });
    dispatch({ type: types.FETCH_USER_SUCCESS, payload: user[0] });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.FETCH_USER_FAIL, payload: 'Failed to load user' });
  }
};

export const fetchUserFeed = (userId, limit = 20) => async (dispatch) => {
  dispatch({ type: types.FETCH_USER_LIB_ENTRIES });
  try {
    const results = await Kitsu.one('userFeed', userId).get({
      page: { limit },
      filter: {
        kind: 'media',
      },
      include: 'media',
    });

    dispatch({
      type: types.FETCH_USER_LIB_ENTRIES_SUCCESS,
      payload: {
        userId,
        entries: [...results],
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const fetchProfileFavorites = (userId, type = 'anime', limit = 20, pageIndex = 0) => async (
  dispatch,
  getState,
) => {
  dispatch({
    type: types.FETCH_USER_FAVORITES,
    payload: {
      type,
    },
  });
  let data = [];
  if (pageIndex > 0) {
    data = [...getState().profile[type]];
  }
  try {
    const favorites = await Kitsu.findAll('favorites', {
      filter: {
        userId,
        itemType: _.capitalize(type),
      },
      page: {
        limit,
        offset: pageIndex * limit,
      },
      fields: {
        favorites: 'favRank,id,item',
      },
      include: 'item',
    });
    data = [...data, ...favorites];
    dispatch({
      type: types.FETCH_USER_FAVORITES_SUCCESS,
      payload: {
        type,
        userId,
        favorites: data,
      },
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: types.FETCH_USER_FAVORITES_FAIL,
      payload: {
        error: `Failed to load ${type}s`,
        type,
      },
    });
  }
};

const defaultFetchUserLibraryOptions = {
  limit: 10,
  fetchType: 'fetch',
  searchText: '',
};

export const fetchUserLibraryByType = fetchOptions => async (dispatch, getState) => {
  const options = {
    ...defaultFetchUserLibraryOptions,
    ...fetchOptions,
  };

  const filter = {
    userId: options.userId,
    status: status === 'onHold' ? 'on_hold' : status,
    kind: options.library,
  };

  const { userLibrary, userLibrarySearch } = getState().profile;
  let { data } = userLibrary[options.library][status];
  let fetchingAction = types.FETCH_USER_LIBRARY_TYPE;
  let successAction = types.FETCH_USER_LIBRARY_TYPE;
  let failAction = types.FETCH_USER_LIBRARY_TYPE;
  if (options.fetchType === 'search') {
    data = userLibrarySearch[options.library][status].data;
    fetchingAction = types.SEARCH_USER_LIBRARY_TYPE;
    successAction = types.SEARCH_USER_LIBRARY_TYPE;
    failAction = types.SEARCH_USER_LIBRARY_TYPE;
    filter.text = options.searchText;
  }

  dispatch({
    type: fetchingAction,
    library: options.library,
    status,
    fetchType: options.fetchType,
  });

  try {
    const libraryEntries = await Kitsu.findAll('libraryEntries', {
      filter,
      page: {
        limit: options.limit,
        offset: data.length,
      },
      include: 'anime,manga',
    });

    dispatch({
      type: successAction,
      library: options.library,
      status,
      data: libraryEntries,
    });
  } catch (error) {
    dispatch({
      type: failAction,
      error,
    });
  }
};

export const fetchUserLibrary = userId => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_USER_LIBRARY });

  try {
    await Promise.all([
      fetchUserLibraryByType({ userId, library: 'anime', status: 'completed' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'anime', status: 'current' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'anime', status: 'dropped' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'anime', status: 'onHold' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'anime', status: 'planned' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'manga', status: 'completed' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'manga', status: 'current' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'manga', status: 'dropped' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'manga', status: 'onHold' })(dispatch, getState),
      fetchUserLibraryByType({ userId, library: 'manga', status: 'planned' })(dispatch, getState),
    ]);

    dispatch({
      type: types.FETCH_USER_LIBRARY_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_USER_LIBRARY_FAIL,
      error,
    });
  }
};

export const searchUserLibrary = (userId, searchText) => async (dispatch, getState) => {
  dispatch({ type: types.SEARCH_USER_LIBRARY });

  const searchOptions = {
    userId,
    searchText,
    fetchType: 'search',
  };

  try {
    await Promise.all([
      fetchUserLibraryByType({ ...searchOptions, library: 'anime', status: 'completed' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'anime', status: 'current' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'anime', status: 'dropped' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'anime', status: 'onHold' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'anime', status: 'planned' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'manga', status: 'completed' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'manga', status: 'current' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'manga', status: 'dropped' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'manga', status: 'onHold' })(dispatch, getState),
      fetchUserLibraryByType({ ...searchOptions, library: 'manga', status: 'planned' })(dispatch, getState),
    ]);

    dispatch({
      type: types.SEARCH_USER_LIBRARY_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: types.SEARCH_USER_LIBRARY_FAIL,
      error,
    });
  }
};

export const fetchNetwork = (userId, type = 'followed', limit = 20, pageIndex = 0) => async (
  dispatch,
  getState,
) => {
  const networkType = {
    followed: 'follower',
    follower: 'followed',
  };
  dispatch({ type: types.FETCH_USER_NETWORK, payload: { type } });
  let data = [];
  if (pageIndex > 0) {
    data = [...getState().profile[type][userId]];
  }
  const { currentUser } = getState().user;
  try {
    const network = await Kitsu.findAll('follows', {
      filter: {
        [networkType[type]]: userId,
      },
      sort: '-created_at',
      fields: {
        users: 'avatar,name,followersCount',
      },
      page: {
        limit,
        offset: pageIndex * limit,
      },
      include: type,
    });

    dispatch({
      type: types.FETCH_USER_NETWORK_SUCCESS,
      payload: { network: [...data, ...network], type, userId },
    });

    _.map(network, async (item) => {
      const aaaa = await Kitsu.findAll('follows', {
        filter: {
          followed: item[type].id,
          follower: currentUser.id,
        },
      });
      if (aaaa.length === 1) dispatch({ type: types.FETCH_NETWORK_FOLLOW, payload: item[type].id });
    });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.FETCH_USER_NETWORK_FAIL, payload: 'Failed to load user' });
  }
};
