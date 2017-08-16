import _ from 'lodash';
import * as types from '../types';
import { Kitsu, setToken } from '../../config/api';

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

const fetchUserLibraryByKindAndStatus = async (userId, kind, status) => {
  const library = await Kitsu.findAll('libraryEntries', {
    filter: {
      userId,
      status,
      kind,
    },
    include: 'anime,manga',
  });

  return library;
};

export const fetchUserLibrary = userId => async (dispatch) => {
  dispatch({ type: types.FETCH_USER_LIBRARY });

  try {
    const [
      animeCompleted, animeCurrent, animeDropped, animeOnHold, animePlanned,
      mangaCompleted, mangaCurrent, mangaDropped, mangaOnHold, mangaPlanned,
    ] = await Promise.all([
      fetchUserLibraryByKindAndStatus(userId, 'anime', 'completed'),
      fetchUserLibraryByKindAndStatus(userId, 'anime', 'current'),
      fetchUserLibraryByKindAndStatus(userId, 'anime', 'dropped'),
      fetchUserLibraryByKindAndStatus(userId, 'anime', 'on_hold'),
      fetchUserLibraryByKindAndStatus(userId, 'anime', 'planned'),
      fetchUserLibraryByKindAndStatus(userId, 'manga', 'completed'),
      fetchUserLibraryByKindAndStatus(userId, 'manga', 'current'),
      fetchUserLibraryByKindAndStatus(userId, 'manga', 'dropped'),
      fetchUserLibraryByKindAndStatus(userId, 'manga', 'on_hold'),
      fetchUserLibraryByKindAndStatus(userId, 'manga', 'planned'),
    ]);

    dispatch({
      type: types.FETCH_USER_LIBRARY_SUCCESS,
      payload: {
        anime: {
          animeCompleted,
          animeCurrent,
          animeDropped,
          animeOnHold,
          animePlanned,
        },
        manga: {
          mangaCompleted,
          mangaCurrent,
          mangaDropped,
          mangaOnHold,
          mangaPlanned,
        },
      },
    });
  } catch (e) {
    dispatch({
      type: types.FETCH_USER_LIBRARY_FAIL,
      payload: 'Failed to load user library',
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
