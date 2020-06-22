import { connect } from 'react-redux';
import { fetchUserLibrary, setLibrarySort } from 'app/store/profile/actions';
import { fetchCurrentUser } from 'app/store/user/actions';
import { LibrarySettingsComponent } from './component';

const mapStateToProps = ({ user, profile }, ownProps) => {
  const { currentUser } = user;
  const { librarySort: sort } = profile;

  return {
    currentUser,
    sort,
  };
};

export const LibrarySettings = connect(mapStateToProps, {
  fetchUserLibrary,
  fetchCurrentUser,
  setLibrarySort,
})(LibrarySettingsComponent);
