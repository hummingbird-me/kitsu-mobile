import _ from 'lodash';
import * as types from 'kitsu/store/types';
import { Kitsu } from 'kitsu/config/api';

export const fetchProfile = userId => async (dispatch) => {
  dispatch({ type: types.FETCH_USER });
  try {
    const user = await Kitsu.findAll('users', {
      filter: {
        id: userId,
      },
      fields: {
        users: 'waifuOrHusbando,gender,location,birthday,createdAt,followersCount,followingCount' +
          ',coverImage,avatar,about,name,waifu',
      },
      include: 'waifu',
    });
    dispatch({ type: types.FETCH_USER_SUCCESS, payload: user[0] });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.FETCH_USER_FAIL,
      payload: 'Failed to load user',
    });
  }
};

export const fetchUserFeed = (userId, limit = 20) => async (dispatch) => {
  dispatch({ type: types.FETCH_USER_FEED });
  try {
    const results = await Kitsu.one('userFeed', userId).get({
      page: { limit },
      filter: {
        kind: 'media',
      },
      include: 'media',
    });

    dispatch({
      type: types.FETCH_USER_FEED_SUCCESS,
      payload: {
        userId,
        entries: [...results],
      },
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.FETCH_USER_FEED_FAIL,
      payload: {
        error,
      },
    });
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
  } catch (error) {
    console.error(error);
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
  searchTerm: '',
};

export const fetchUserLibraryByType = fetchOptions => async (dispatch, getState) => {
  const options = {
    ...defaultFetchUserLibraryOptions,
    ...fetchOptions,
  };

  const filter = {
    userId: options.userId,
    status: options.status === 'onHold' ? 'on_hold' : options.status,
    kind: options.library,
  };

  const { userLibrary } = getState().profile;
  let { data } = userLibrary[options.library][options.status];
  const searchTerm = options.searchTerm || userLibrary.searchTerm;
  if (options.searchTerm) {
    filter.title = searchTerm;
  }

  dispatch({
    searchTerm,
    type: types.FETCH_USER_LIBRARY_TYPE,
    library: options.library,
    status: options.status,
    fetchType: options.fetchType,
  });

  try {
    const libraryEntries = await Kitsu.findAll('libraryEntries', {
      fields: {
        anime: 'canonicalTitle,posterImage,episodeCount',
        manga: 'canonicalTitle,posterImage,chapterCount',
        libraryEntries: 'anime,manga,progress,ratingTwenty,status',
      },
      filter,
      include: 'anime,manga',
      page: {
        limit: options.limit,
        offset: data.length,
      },
      sort: '-updatedAt',
    });

    if (options.searchTerm) {
      data = libraryEntries;
    } else {
      data = data.concat(libraryEntries);
      data.meta = libraryEntries.meta;
    }

    dispatch({
      data,
      type: types.FETCH_USER_LIBRARY_TYPE_SUCCESS,
      fetchMore: () => {
        if (data.length < libraryEntries.meta.count) {
          fetchUserLibraryByType(options)(dispatch, getState);
        }
      },
      library: options.library,
      status: options.status,
    });
  } catch (error) {
    console.error(error);
    dispatch({
      error,
      type: types.FETCH_USER_LIBRARY_TYPE_FAIL,
    });
  }
};

export const fetchUserLibrary = fetchOptions => async (dispatch, getState) => {
  const options = {
    searchTerm: '',
    limit: 10,
    ...fetchOptions,
  };

  dispatch({
    searchTerm: options.searchTerm,
    userId: options.userId,
    type: types.FETCH_USER_LIBRARY,
  });

  const fetchUserTypeOptions = {
    limit: options.limit,
    userId: options.userId,
    searchTerm: options.searchTerm,
  };

  try {
    await Promise.all([
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'completed' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'current' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'dropped' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'onHold' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'planned' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'completed' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'current' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'dropped' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'onHold' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'planned' })(dispatch, getState),
    ]);

    dispatch({
      type: types.FETCH_USER_LIBRARY_SUCCESS,
    });
  } catch (error) {
    console.error(error);
    dispatch({
      error,
      type: types.FETCH_USER_LIBRARY_FAIL,
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
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.FETCH_USER_NETWORK_FAIL,
      payload: 'Failed to load user',
    });
  }
};

export const updateUserLibraryEntry = (libraryType, libraryStatus, newLibraryEntry) => async (
  dispatch, getState,
) => {
  const { userLibrary } = getState().profile;
  const libraryEntries = userLibrary[libraryType][libraryStatus].data;
  const previousLibraryEntry = libraryEntries.find(({ id }) => id === newLibraryEntry.id);

  try {
    const updateEntry = { ...newLibraryEntry };
    if (updateEntry.status === 'onHold') {
      updateEntry.status = 'on_hold';
    }

    // optimistically update state
    dispatch({
      libraryStatus,
      libraryType,

      previousLibraryStatus: previousLibraryEntry.status === 'on_hold' ? 'onHold' : previousLibraryEntry.status,
      newLibraryStatus: newLibraryEntry.status === 'on_hold' ? 'onHold' : newLibraryEntry.status,

      previousLibraryEntry,
      newLibraryEntry: updateEntry,
      type: types.UPDATE_USER_LIBRARY_ENTRY,
    });

    await Kitsu.update('libraryEntries', updateEntry);
  } catch (e) {
    // TODO: handle the case where the entry update fails
  }
};
