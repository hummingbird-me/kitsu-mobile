import { connect } from 'react-redux';
import { fetchUserLibrary, setLibrarySort } from 'kitsu/store/profile/actions';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { LibrarySettingsComponent } from './component';

const mapStateToProps = ({ user, profile }, ownProps) => {
  const { currentUser } = user;
  const { librarySort: sort } = profile;
  const navigateBackOnSave = (ownProps.navigation.state.params &&
    ownProps.navigation.state.params.navigateBackOnSave);

  return {
    currentUser,
    sort,
    navigateBackOnSave,
  };
};

export const LibrarySettings = connect(mapStateToProps, {
  fetchUserLibrary,
  fetchCurrentUser,
  setLibrarySort,
})(LibrarySettingsComponent);
