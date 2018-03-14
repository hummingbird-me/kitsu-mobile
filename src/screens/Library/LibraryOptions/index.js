import { connect } from 'react-redux';
import { fetchUserLibrary, setLibrarySort } from 'kitsu/store/profile/actions';
import { LibraryOptionsComponent } from './component';

const mapStateToProps = ({ user, profile }) => {
  const { currentUser } = user;
  const { librarySort: sort } = profile;

  return {
    currentUser,
    sort,
  };
};

export const LibraryOptions = connect(mapStateToProps, {
  fetchUserLibrary,
  setLibrarySort,
})(LibraryOptionsComponent);
