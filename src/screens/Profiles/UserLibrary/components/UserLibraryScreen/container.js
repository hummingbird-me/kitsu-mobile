import { connect } from 'react-redux';
import {
  fetchUserLibrary,
  fetchUserLibraryByType,
  searchUserLibrary,
} from 'kitsu/store/profile/actions';
import { UserLibraryScreenComponent } from './component';

const mapStateToProps = ({ user, profile }) => {
  const { userLibrary, userLibrarySearch } = profile;

  return {
    currentUser: user.currentUser,
    userLibrary,
    userLibrarySearch,
  };
};

export const UserLibraryScreen = connect(mapStateToProps, {
  fetchUserLibrary,
  fetchUserLibraryByType,
  searchUserLibrary,
})(UserLibraryScreenComponent);
