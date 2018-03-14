import capitalize from 'lodash/capitalize';
import map from 'lodash/map';
import * as types from 'kitsu/store/types';
import { Kitsu } from 'kitsu/config/api';
import { KitsuLibrary, KitsuLibraryEventSource, KitsuLibrarySort } from 'kitsu/utils/kitsuLibrary';
import { getState } from '../user/actions';

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

/**
 * Get the sort string.
 *
 * @param {any} sort An object with the format { by: <string>, ascending: <bool> }
 * @param {string} kind 'anime' or 'manga'
 * @returns The sort string.
 */
function getSortString(sort, kind) {
  const titleSort = `${kind}.titles.canonical`;
  if (!sort || !sort.by) return titleSort;

  const ascending = sort.ascending ? '' : '-';
  let defaultSort = sort.by;

  switch (sort.by) {
    case KitsuLibrarySort.TITLE:
      return `${ascending}${titleSort}`;

    case KitsuLibrarySort.LENGTH: {
      const itemType = kind === 'anime' ? 'episode_count' : 'chapter_count';
      defaultSort = `${kind}.${itemType}`;
      break;
    }
    case KitsuLibrarySort.POPULARITY: {
      defaultSort = `${kind}.user_count`;
      break;
    }
    case KitsuLibrarySort.AVERAGE_RATING: {
      defaultSort = `${kind}.average_rating`;
      break;
    }
    default:
      break;
  }

  return `${ascending}${defaultSort},${titleSort}`;
}

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

  const { userLibrary, userLibrarySearch, librarySort } = getState().profile;

  let data;
  if (options.searchTerm) {
    data = userLibrarySearch[options.userId][options.library][options.status].data;
    filter.title = options.searchTerm;
  } else {
    data = userLibrary[options.userId][options.library][options.status].data;
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
    refresh: options.refresh || false,
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
        offset: options.refresh ? 0 : data.length,
      },
      sort: getSortString(librarySort, options.library),
    });

    if (options.searchTerm || options.refresh) {
      data = libraryEntries;
    } else {
      // If we refresh then we need to reset data
      data = data.concat(libraryEntries);
    }

    data.meta = libraryEntries.meta;

    dispatch({
      data,
      meta: libraryEntries.meta,
      type: actions.fetchSuccess,
      refresh: () => {
        const newOptions = {
          ...options,
          refresh: true,
        };
        console.log(options);
        fetchUserLibraryByType(newOptions)(dispatch, getState);
      },
      fetchMore: () => {
        if (data.length < libraryEntries.meta.count) {
          const newOptions = {
            ...options,
            refresh: false,
          };
          fetchUserLibraryByType(newOptions)(dispatch, getState);
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
  const { currentUser } = getState().user;
  if (!currentUser || !currentUser.id || !userLibrary[currentUser.id]) return;

  const libraryEntries = userLibrary[currentUser.id][libraryType][libraryStatus].data;
  const previousLibraryEntry = libraryEntries.find(({ id }) => id === newLibraryEntry.id);

  try {
    const updateEntry = { ...newLibraryEntry };

    // optimistically update state
    onLibraryEntryUpdate(currentUser.id, libraryType, libraryStatus, updateEntry, isSearchEntry)(dispatch, getState);

    const record = await Kitsu.update('libraryEntries', updateEntry);
    KitsuLibrary.onLibraryEntryUpdate(previousLibraryEntry, record, libraryType, KitsuLibraryEventSource.STORE);
  } catch (e) {
    throw e;
  }
};

export const updateUserLibrarySearchEntry = (
  libraryType, libraryStatus, newLibraryEntry,
) => async (dispatch, getState) => {
  updateUserLibraryEntry(libraryType, libraryStatus, newLibraryEntry, true)(dispatch, getState);
};

export const deleteUserLibraryEntry = (id, libraryType, libraryStatus) => async (dispatch, getState) => {
  const { currentUser } = getState().user;
  if (!currentUser || !currentUser.id) return;

  try {
    await Kitsu.destroy('libraryEntries', id);
    dispatch(onLibraryEntryDelete(id, currentUser.id, libraryType, libraryStatus));
    KitsuLibrary.onLibraryEntryDelete(id, libraryType, libraryStatus, KitsuLibraryEventSource.STORE);
  } catch (e) {
    throw e;
  }
};

export function onLibraryEntryCreate(
  newLibraryEntry,
  userId,
  libraryType,
  libraryStatus,
) {
  return (dispatch, getState) => {
    const { userLibrary } = getState().profile;
    if (!userLibrary[userId]) return {};

    const libraryEntries = userLibrary[userId][libraryType][libraryStatus].data;
    const previousLibraryEntry = libraryEntries.find(({ id }) => id === newLibraryEntry.id);

    // Make sure that we aren't adding a duplicate entry
    if (previousLibraryEntry) {
      onLibraryEntryUpdate(userId, libraryType, libraryStatus, newLibraryEntry)(dispatch, getState);
    } else {
      const updateEntry = { ...newLibraryEntry };

      // Add the new entry
      dispatch({
        type: types.CREATE_USER_LIBRARY_ENTRY,
        userId,
        libraryStatus,
        libraryType,
        newLibraryEntry: updateEntry,
      });
    }
  };
}

export function onLibraryEntryUpdate(
  userId,
  libraryType,
  libraryStatus,
  newLibraryEntry,
  isSearchEntry,
) {
  return (dispatch, getState) => {
    const { userLibrary } = getState().profile;
    if (!userLibrary[userId]) return {};

    const libraryEntries = userLibrary[userId][libraryType][libraryStatus].data;
    const previousLibraryEntry = libraryEntries.find(({ id }) => id === newLibraryEntry.id);

    // Combine relationship data on the entries
    const combined = newLibraryEntry;
    if (previousLibraryEntry) {
      if (!combined.anime) combined.anime = previousLibraryEntry.anime;
      if (!combined.manga) combined.manga = previousLibraryEntry.manga;
      if (!combined.user) combined.user = previousLibraryEntry.user;
    }

    const updateEntry = { ...combined };

    // update the state
    dispatch({
      userId,
      libraryStatus,
      libraryType,

      previousLibraryStatus: previousLibraryEntry.status,
      newLibraryStatus: updateEntry.status,

      previousLibraryEntry,
      newLibraryEntry: updateEntry,

      type: isSearchEntry ?
        types.UPDATE_USER_LIBRARY_SEARCH_ENTRY : types.UPDATE_USER_LIBRARY_ENTRY,
    });
  };
}

export function onLibraryEntryDelete(
  id,
  userId,
  libraryType,
  libraryStatus,
) {
  return (dispatch, getState) => {
    const { userLibrary } = getState().profile;

    // Delete if we have the state set
    if (userLibrary && userId in userLibrary) {
      dispatch({
        type: types.DELETE_USER_LIBRARY_ENTRY,
        userId,
        libraryStatus,
        libraryType,
        id,
      });
    }
  };
}

export function updateLibrarySearchTerm(searchTerm) {
  return {
    type: types.UPDATE_USER_LIBRARY_SEARCH_TERM,
    searchTerm,
  };
}

export function setLibrarySort(sort, ascending) {
  return {
    type: types.UPDATE_LIBRARY_SORT,
    by: sort,
    ascending,
  };
}
