import * as types from 'kitsu/store/types';

const INITIAL_STATE = {
  media: {},
  loading: false,
  reactions: {},
  loadingReviews: false,
  castings: {},
  loadingCastings: false,
};

export const mediaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_MEDIA:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case types.FETCH_MEDIA_SUCCESS:
      return {
        ...state,
        loading: false,
        media: { ...state.media, [action.payload.mediaId]: action.payload.media },
        error: '',
      };
    case types.FETCH_MEDIA_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.FETCH_MEDIA_REACTIONS:
      return {
        ...state,
        loadingReactions: true,
        error: '',
      };
    case types.FETCH_MEDIA_REACTIONS_SUCCESS:
      return {
        ...state,
        loadingReactions: false,
        reactions: { [action.payload.mediaId]: action.payload.reactions },
        error: '',
      };
    case types.FETCH_MEDIA_REACTIONS_FAIL:
      return {
        ...state,
        loadingReactions: false,
        error: action.payload,
      };
    case types.FETCH_MEDIA_CASTINGS:
      return {
        ...state,
        loadingCastings: true,
        castings: {},
        error: '',
      };
    case types.FETCH_MEDIA_CASTINGS_SUCCESS:
      return {
        ...state,
        loadingCastings: false,
        castings: { [action.payload.mediaId]: action.payload.castings },
        error: '',
      };
    case types.FETCH_MEDIA_CASTINGS_FAIL:
      return {
        ...state,
        loadingCastings: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
