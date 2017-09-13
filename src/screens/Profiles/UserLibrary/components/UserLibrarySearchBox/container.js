import { connect } from 'react-redux';
import {
  fetchUserLibrary,
  updateLibrarySearchTerm,
} from 'kitsu/store/profile/actions';
import { UserLibrarySearchBoxComponent } from './component';

const mapStateToProps = ({ profile }) => {
  const { userLibrarySearch } = profile;

  return {
    userLibrarySearch,
  };
};

export const UserLibrarySearchBox = connect(mapStateToProps, {
  fetchUserLibrary,
  updateLibrarySearchTerm,
})(UserLibrarySearchBoxComponent);
