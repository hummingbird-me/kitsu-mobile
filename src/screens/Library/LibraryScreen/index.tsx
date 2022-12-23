import { connect } from 'react-redux';
import { updateUserLibraryEntry, deleteUserLibraryEntry, fetchUserLibrary } from 'kitsu/store/profile/actions';
import { LibraryScreenComponent } from './component';

const mapStateToProps = ({ user, profile }) => {
  const { currentUser } = user;
  const { userLibrary } = profile;
  const library = currentUser && userLibrary && userLibrary[currentUser.id];

  return {
    currentUser,
    library,
  };
};

export const LibraryScreen = connect(mapStateToProps, {
  fetchUserLibrary,
  updateUserLibraryEntry,
  deleteUserLibraryEntry,
})(LibraryScreenComponent);
