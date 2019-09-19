import { capitalize, map, lowerCase, isEmpty, camelCase } from 'lodash';
import * as types from 'kitsu/store/types';
import { Kitsu } from 'kitsu/config/api';
import { KitsuLibrary, KitsuLibraryEventSource, KitsuLibrarySort } from 'kitsu/utils/kitsuLibrary';
import { getTitleField } from 'kitsu/utils/getTitleField';

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
    console.warn(error);
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
    console.warn(error);
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
    console.warn(error);
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
  limit: 25,
};

/**
 * Get the sort string.
 *
 * @param {any} sort An object with the format { by: <string>, ascending: <bool> }
 * @param {string} kind 'anime' or 'manga'
 * @param {any} user The current user or null.
 * @returns The sort string.
 */
function getSortString(sort, kind, user) {
  // Get the user preference
  const preference = (user && lowerCase(user.titleLanguagePreference));
  const key = (preference && getTitleField(preference)) || 'canonical';

  const titleSort = `${kind}.titles.${key}`;
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

  const { userLibrary, librarySort } = getState().profile;
  const { currentUser } = getState().user;

  let data = userLibrary[options.userId][options.library][options.status].data;

  dispatch({
    type: types.FETCH_USER_LIBRARY_TYPE,
    library: options.library,
    status: options.status,
    userId: options.userId,
    refresh: options.refresh || false,
  });

  try {
    const libraryEntries = await Kitsu.findAll('libraryEntries', {
      fields: {
        anime: 'titles,canonicalTitle,posterImage,episodeCount,startDate,endDate',
        manga: 'titles,canonicalTitle,posterImage,chapterCount,startDate,endDate',
        libraryEntries: 'anime,finishedAt,manga,notes,private,progress,ratingTwenty,reconsumeCount,startedAt,status',
      },
      filter,
      include: 'anime,manga',
      page: {
        limit: options.limit,
        offset: options.refresh ? 0 : data.length,
      },
      sort: getSortString(librarySort, options.library, currentUser),
    });

    if (options.refresh) {
      data = libraryEntries;
    } else {
      // If we refresh then we need to reset data
      data = data.concat(libraryEntries);
    }

    data.meta = libraryEntries.meta;

    dispatch({
      data,
      meta: libraryEntries.meta,
      type: types.FETCH_USER_LIBRARY_TYPE_SUCCESS,
      refresh: () => {
        const newOptions = {
          ...options,
          refresh: true,
        };
        console.log(options);
        fetchUserLibraryByType(newOptions)(dispatch, getState);
      },
      fetchMore: (limit = 10) => {
        const state = getState().profile;
        if (!state || !options.userId || !options.library || !options.status) return;

        /*
        We need to fetch the meta count dynamically here incase they were changed manually.
        This can happen when user added/moved/deleted library entries.

        Doing this dynamically vs statically avoids this issue:
          - User has 26 entries in completed and only loaded 25 entries.
            - data.length = 25 and count = 26
          - User moves a media to completed
            - data.length is now 26 and count = 26 (static), but count should be 27 instead.

        We check the count dynamically as we know that when a user moves media between statuses, the status counts will be updated.
        */
        const userLibrary = state.userLibrary[options.userId];
        const meta = userLibrary && userLibrary.meta;
        const statusCounts = meta && meta[options.library] && meta[options.library].statusCounts;
        if (isEmpty(meta) || isEmpty(statusCounts)) return;

        const metaEntryCount = statusCounts[camelCase(options.status)] || 0;
        const entries = userLibrary[options.library] && userLibrary[options.library][options.status];
        const data = (entries && entries.data) || [];

        if (data.length < metaEntryCount) {
          const newOptions = {
            ...options,
            limit,
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
    console.warn(error);
    dispatch({
      error,
      type: types.FETCH_USER_LIBRARY_TYPE_FAIL,
      library: options.library,
      status: options.status,
      userId: options.userId,
    });
  }
};

export const fetchUserLibrary = fetchOptions => async (dispatch, getState) => {
  const options = {
    ...defaultFetchUserLibraryOptions,
    ...fetchOptions,
  };

  dispatch({
    userId: options.userId,
    type: types.FETCH_USER_LIBRARY,
  });

  const fetchUserTypeOptions = {
    limit: options.limit,
    userId: options.userId,
    refresh: options.refresh,
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
      type: types.FETCH_USER_LIBRARY_SUCCESS,
      userId: options.userId,
    });
  } catch (error) {
    console.warn(error);
    dispatch({
      error,
      type: types.FETCH_USER_LIBRARY_FAIL,
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
    console.warn(error);
    dispatch({
      type: types.FETCH_USER_NETWORK_FAIL,
      payload: 'Failed to load user',
    });
  }
};

export const updateUserLibraryEntry = (
  libraryType, libraryStatus, newLibraryEntry,
) => async (dispatch, getState) => {
  const { userLibrary } = getState().profile;
  const { currentUser } = getState().user;
  if (!currentUser || !currentUser.id || !userLibrary[currentUser.id]) return;

  const libraryEntries = userLibrary[currentUser.id][libraryType][libraryStatus].data;
  const previousLibraryEntry = libraryEntries.find(({ id }) => id === newLibraryEntry.id);

  try {
    const updateEntry = { ...newLibraryEntry };

    // optimistically update state
    onLibraryEntryUpdate(currentUser.id, libraryType, libraryStatus, updateEntry)(dispatch, getState);

    const record = await Kitsu.update('libraryEntries', updateEntry);
    KitsuLibrary.onLibraryEntryUpdate(previousLibraryEntry, record, libraryType, KitsuLibraryEventSource.STORE);
  } catch (e) {
    throw e;
  }
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

      // Update meta counts
      const counts = {};
      const meta = userLibrary[userId].meta && userLibrary[userId].meta[libraryType];
      if (!isEmpty(meta)) {
        // We need to convert status to camelCase because that's what we recieve in the library meta
        const camelStatus = camelCase(libraryStatus);
        counts[camelStatus] = (meta.statusCounts[camelStatus] || 0) + 1;
      }

      // Add the new entry
      dispatch({
        type: types.CREATE_USER_LIBRARY_ENTRY,
        userId,
        libraryStatus,
        libraryType,
        newLibraryEntry: updateEntry,
        statusCounts: counts,
      });
    }
  };
}

export function onLibraryEntryUpdate(
  userId,
  libraryType,
  libraryStatus,
  newLibraryEntry,
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

    // Update meta counts
    const counts = {};
    const meta = userLibrary[userId].meta && userLibrary[userId].meta[libraryType];
    const newStatus = newLibraryEntry.status;
    if (!isEmpty(meta) && newStatus && libraryStatus !== newStatus) {
      // We need to convert statuses to camelCase because that's what we recieve in the library meta
      const camelLibraryStatus = camelCase(libraryStatus);
      const camelNewStatus = camelCase(newStatus);
      counts[camelLibraryStatus] = (meta.statusCounts[camelLibraryStatus] || 0) - 1;
      counts[camelNewStatus] = (meta.statusCounts[camelNewStatus] || 0) + 1;
    }

    // update the state
    dispatch({
      type: types.UPDATE_USER_LIBRARY_ENTRY,
      userId,
      libraryStatus,
      libraryType,

      previousLibraryStatus: previousLibraryEntry.status,
      newLibraryStatus: updateEntry.status,

      previousLibraryEntry,
      newLibraryEntry: updateEntry,

      statusCounts: counts,
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

      // Update meta counts
      const counts = {};
      const meta = userLibrary[userId].meta && userLibrary[userId].meta[libraryType];
      if (!isEmpty(meta)) {
        // We need to convert status to camelCase because that's what we recieve in the library meta
        const camelStatus = camelCase(libraryStatus);
        counts[camelStatus] = (meta.statusCounts[camelStatus] || 0) - 1;
      }

      dispatch({
        type: types.DELETE_USER_LIBRARY_ENTRY,
        userId,
        libraryStatus,
        libraryType,
        id,
        statusCounts: counts,
      });
    }
  };
}

export function setLibrarySort(sort, ascending) {
  return {
    type: types.UPDATE_LIBRARY_SORT,
    by: sort,
    ascending,
  };
}
