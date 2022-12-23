import * as types from 'kitsu/store/types';
import { Kitsu } from 'kitsu/config/api';

export const fetchMedia = (id, type) => async (dispatch, getState) => {
  // console.log("##### Fetching media: ", id)
  dispatch({ type: types.FETCH_MEDIA });
  try {
    const media = await Kitsu.one(type, id).get({
      include: `categories,mediaRelationships.destination${type === 'anime' ? ',episodes' : ',chapters'}`,
    });
    // console.log(media);
    dispatch({ type: types.FETCH_MEDIA_SUCCESS, payload: { mediaId: id, media } });
  } catch (e) {
    // console.log(e);
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
    // console.log(castings);
    data = [...data, ...castings];
    dispatch({ type: types.FETCH_MEDIA_CASTINGS_SUCCESS, payload: { castings: data, mediaId } });
  } catch (e) {
    // console.log(e);
    dispatch({
      type: types.FETCH_MEDIA_CASTINGS_FAIL,
      payload: `Failed to load media ${e[0] && e[0].detail}`,
    });
  }
};

export const fetchMediaReactions = (mediaId, mediaType, limit = 20, pageIndex = 0) => async (
  dispatch,
  getState,
) => {
  dispatch({ type: types.FETCH_MEDIA_REACTIONS });
  let data = [];
  if (pageIndex > 0) {
    data = [...getState().media.reactions[mediaId]];
  }
  try {
    const reactions = await Kitsu.findAll('mediaReactions', {
      filter: {
        [`${mediaType}Id`]: mediaId,
      },
      include: 'user',
      sort: '-upVotesCount',
    });
    data = [...data, ...reactions];
    dispatch({
      type: types.FETCH_MEDIA_REACTIONS_SUCCESS,
      payload: {
        mediaId,
        reactions: data,
      },
    });
  } catch (e) {
    // console.log(e);
    dispatch({
      type: types.FETCH_MEDIA_REACTIONS_FAIL,
      payload: {
        error: 'Failed to load reactions',
      },
    });
  }
};
