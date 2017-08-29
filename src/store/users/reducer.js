import * as types from 'kitsu/store/types';

const initialState = {};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CAPTURE_USERS_DATA: {
      const users = {};
      action.payload.filter(u => u.type !== 'user').map(u => (users[u.id] = u));
      return {
        ...state,
        ...users,
      };
    }
    case types.USER_FOLLOW_SUCCESS: {
      const { id } = action.payload;
      state[id] = { ...state[id], following: true };
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};
