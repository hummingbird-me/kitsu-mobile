import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../types';

const INITIAL_STATE = {
  media: {},
  loading: false,
  reviews: {},
  loadingReviews: false,
  castings: {},
  loadingCastings: false,
};

export default(state = INITIAL_STATE, action) => {
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
    case types.FETCH_MEDIA_REVIEWS:
      return {
        ...state,
        loadingReviews: true,
        reviews: {},
        error: '',
      };
    case types.FETCH_MEDIA_REVIEWS_SUCCESS:
      return {
        ...state,
        loadingReviews: false,
        reviews: { [action.payload.mediaId]: action.payload.reviews },
        error: '',
      };
    case types.FETCH_MEDIA_REVIEWS_FAIL:
      return {
        ...state,
        loadingReviews: false,
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
