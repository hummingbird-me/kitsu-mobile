import { connect } from 'react-redux';
import { fetchUserLibrary, setLibrarySort } from 'kitsu/store/profile/actions';
import { LibraryOptionsComponent } from './component';

const mapStateToProps = ({ user, profile }) => {
  const { currentUser } = user;
  const { userLibrary } = profile;
  const sort = userLibrary && userLibrary.sort;

  return {
    currentUser,
    sort,
  };
};

export const LibraryOptions = connect(mapStateToProps, {
  fetchUserLibrary,
  setLibrarySort,
})(LibraryOptionsComponent);
