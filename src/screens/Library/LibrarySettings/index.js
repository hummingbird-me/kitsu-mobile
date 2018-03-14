import { connect } from 'react-redux';
import { fetchUserLibrary, setLibrarySort } from 'kitsu/store/profile/actions';
import { LibrarySettingsComponent } from './component';

const mapStateToProps = ({ user, profile }) => {
  const { currentUser } = user;
  const { librarySort: sort } = profile;

  return {
    currentUser,
    sort,
  };
};

export const LibrarySettings = connect(mapStateToProps, {
  fetchUserLibrary,
  setLibrarySort,
})(LibrarySettingsComponent);
