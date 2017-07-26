import _ from 'lodash';
import * as types from '../types';
import { Kitsu, setToken } from '../../config/api';

export const fetchMedia = (id, type) => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_MEDIA });
  try {
    const media = await Kitsu.one(type, id).get({
      include: `categories,mediaRelationships.destination${type === 'anime' ? ',episodes' : ',chapters'}`,
    });
    console.log(media);
    dispatch({ type: types.FETCH_MEDIA_SUCCESS, payload: { mediaId: id, media } });
  } catch (e) {
    console.log(e);
    dispatch({
      type: types.FETCH_MEDIA_FAIL,
      payload: `Failed to load media ${e[0] && e[0].detail}`,
    });
  }
};

export const fetchMediaCastings = (mediaId, limit = 20, pageIndex = 0) => async (
  dispatch,
  getState,
) => {
  dispatch({ type: types.FETCH_MEDIA_CASTINGS });
  let data = [];
  if (pageIndex > 0) {
    data = [...getState().media.castings[mediaId]];
  }
  try {
    const castings = await Kitsu.findAll('castings', {
      filter: {
        mediaId,
        isCharacter: true,
      },
      sort: '-featured',
      include: 'character',
    });
    console.log(castings);
    data = [...data, ...castings];
    dispatch({ type: types.FETCH_MEDIA_CASTINGS_SUCCESS, payload: { castings: data, mediaId } });
  } catch (e) {
    console.log(e);
    dispatch({
      type: types.FETCH_MEDIA_CASTINGS_FAIL,
      payload: `Failed to load media ${e[0] && e[0].detail}`,
    });
  }
};

export const fetchMediaReviews = (mediaId, limit = 20, pageIndex = 0) => async (
  dispatch,
  getState,
) => {
  dispatch({ type: types.FETCH_MEDIA_REVIEWS });
  let data = [];
  if (pageIndex > 0) {
    data = [...getState().media.reviews[mediaId]];
  }
  try {
    const reviews = await Kitsu.findAll('reviews', {
      filter: {
        mediaId,
      },
      include: 'user',
      sort: '-likesCount',
    });
    data = [...data, ...reviews];
    dispatch({
      type: types.FETCH_MEDIA_REVIEWS_SUCCESS,
      payload: {
        mediaId,
        reviews: data,
      },
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: types.FETCH_MEDIA_REVIEWS_FAIL,
      payload: {
        error: 'Failed to load reviews',
      },
    });
  }
};
