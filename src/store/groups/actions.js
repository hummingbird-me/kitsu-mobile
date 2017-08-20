import * as types from 'kitsu/store/types';
import { Kitsu, setToken } from 'kitsu/config/api';

export const fetchGroupMemberships = () => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_GROUP_MEMBERSHIPS });
  try {
    const groups = await Kitsu.findAll('groupMembers', {
      include: 'group',
      filter: { user: getState().user.currentUser.id },
    });
    console.log(groups);
    dispatch({ type: types.FETCH_GROUP_MEMBERSHIPS_SUCCESS, payload: groups[0] });
  } catch (e) {
    console.log(e);
    dispatch({ type: types.FETCH_GROUP_MEMBERSHIPS_FAIL, payload: 'Failed to load groups' });
  }
};
