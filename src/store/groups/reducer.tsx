import * as types from 'kitsu/store/types';

const INITIAL_STATE = {
  loadingGroups: false,
  groupMemberships: [],
  error: '',
};

export const groupsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_GROUP_MEMBERSHIPS:
      return {
        ...state,
        loadingGroups: true,
      };
    case types.FETCH_GROUP_MEMBERSHIPS_SUCCESS:
      return {
        ...state,
        loadingGroups: false,
        groupMemberships: action.payload,
      };
    case types.FETCH_GROUP_MEMBERSHIPS_FAIL:
      return {
        ...state,
        loadingGroups: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
