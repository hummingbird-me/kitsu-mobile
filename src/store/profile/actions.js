import capitalize from 'lodash/capitalize';
import map from 'lodash/map';
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
        itemType: capitalize(type),
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
    status: options.status,
    kind: options.library,
  };

  const { userLibrary, userLibrarySearch } = getState().profile;

  let data;
  if (options.searchTerm) {
    data = userLibrarySearch[options.library][options.status].data;
    filter.title = options.searchTerm;
  } else {
    data = userLibrary[options.library][options.status].data;
  }

  const actions = {
    fetchStart: options.searchTerm.length ?
      types.SEARCH_USER_LIBRARY_TYPE : types.FETCH_USER_LIBRARY_TYPE,
    fetchSuccess: options.searchTerm.length ?
      types.SEARCH_USER_LIBRARY_TYPE_SUCCESS : types.FETCH_USER_LIBRARY_TYPE_SUCCESS,
    fetchFail: options.searchTerm.length ?
      types.SEARCH_USER_LIBRARY_TYPE_FAIL : types.FETCH_USER_LIBRARY_TYPE_FAIL,
  };

  dispatch({
    searchTerm: options.searchTerm,
    type: actions.fetchStart,
    library: options.library,
    status: options.status,
    userId: options.userId,
  });

  try {
    const libraryEntries = await Kitsu.findAll('libraryEntries', {
      fields: {
        anime: 'canonicalTitle,posterImage,episodeCount',
        manga: 'canonicalTitle,posterImage,chapterCount',
        libraryEntries: 'anime,finishedAt,manga,notes,private,progress,ratingTwenty,reconsumeCount,startedAt,status',
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
      type: actions.fetchSuccess,
      fetchMore: () => {
        if (data.length < libraryEntries.meta.count) {
          fetchUserLibraryByType(options)(dispatch, getState);
        }
      },
      library: options.library,
      status: options.status,
      userId: options.userId,
    });
  } catch (error) {
    console.error(error);
    dispatch({
      error,
      type: actions.fetchFail,
      library: options.library,
      status: options.status,
      userId: options.userId,
    });
  }
};

export const fetchUserLibrary = fetchOptions => async (dispatch, getState) => {
  const options = {
    searchTerm: '',
    limit: 10,
    ...fetchOptions,
  };

  const actions = {
    fetchStart: options.searchTerm.length ?
      types.SEARCH_USER_LIBRARY : types.FETCH_USER_LIBRARY,
    fetchSuccess: options.searchTerm.length ?
      types.SEARCH_USER_LIBRARY_SUCCESS : types.FETCH_USER_LIBRARY_SUCCESS,
    fetchFail: options.searchTerm.length ?
      types.SEARCH_USER_LIBRARY_FAIL : types.FETCH_USER_LIBRARY_FAIL,
  };

  dispatch({
    searchTerm: options.searchTerm,
    userId: options.userId,
    type: actions.fetchStart,
  });

  const fetchUserTypeOptions = {
    limit: options.limit,
    userId: options.userId,
    searchTerm: options.searchTerm,
  };

  try {
    await Promise.all([
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'current' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'planned' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'completed' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'on_hold' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'anime', status: 'dropped' })(dispatch, getState),
    ]);

    await Promise.all([
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'current' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'planned' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'completed' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'on_hold' })(dispatch, getState),
      fetchUserLibraryByType({ ...fetchUserTypeOptions, library: 'manga', status: 'dropped' })(dispatch, getState),
    ]);

    dispatch({
      type: actions.fetchSuccess,
      userId: options.userId,
    });
  } catch (error) {
    console.error(error);
    dispatch({
      error,
      type: actions.fetchFail,
      userId: options.userId,
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

    map(network, async (item) => {
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

export const updateUserLibraryEntry = (
  libraryType, libraryStatus, newLibraryEntry, isSearchEntry,
) => async (dispatch, getState) => {
  const { userLibrary } = getState().profile;
  const libraryEntries = userLibrary[libraryType][libraryStatus].data;
  const previousLibraryEntry = libraryEntries.find(({ id }) => id === newLibraryEntry.id);

  try {
    const updateEntry = { ...newLibraryEntry };

    // optimistically update state
    dispatch({
      libraryStatus,
      libraryType,

      previousLibraryStatus: previousLibraryEntry.status,
      newLibraryStatus: newLibraryEntry.status,

      previousLibraryEntry,
      newLibraryEntry: updateEntry,
      type: isSearchEntry ?
        types.UPDATE_USER_LIBRARY_SEARCH_ENTRY : types.UPDATE_USER_LIBRARY_ENTRY,
    });

    await Kitsu.update('libraryEntries', updateEntry);
  } catch (e) {
    // TODO: handle the case where the entry update fails
  }
};

export const updateUserLibrarySearchEntry = (
  libraryType, libraryStatus, newLibraryEntry,
) => async (dispatch, getState) => {
  updateUserLibraryEntry(libraryType, libraryStatus, newLibraryEntry, true)(dispatch, getState);
};

export const deleteUserLibraryEntry = (id, libraryStatus, libraryType) => async (dispatch) => {
  await Kitsu.destroy('libraryEntries', id);

  dispatch({
    type: types.DELETE_USER_LIBRARY_ENTRY,
    id,
    libraryStatus,
    libraryType,
  });
};

export function updateLibrarySearchTerm(searchTerm) {
  return {
    type: types.UPDATE_USER_LIBRARY_SEARCH_TERM,
    searchTerm,
  };
}
