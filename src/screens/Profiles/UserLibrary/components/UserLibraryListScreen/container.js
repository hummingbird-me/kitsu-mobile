import { connect } from 'react-redux';
import { fetchUserLibraryByType, updateUserLibraryEntry } from 'kitsu/store/profile/actions';
import { UserLibraryListScreenComponent } from './component';

const mapStateToProps = ({ user, profile }, ownProps) => {
  const { userLibrary } = profile;
  const { libraryStatus, libraryType, profile: userProfile } = ownProps.navigation.state.params;
  const libraryEntries = userLibrary[userProfile.id][libraryType][libraryStatus];

  return {
    currentUser: user.currentUser,
    libraryEntries,
    libraryStatus,
    libraryType,
    profile: userProfile,
    loading: userLibrary[userProfile.id].loading || libraryEntries.loading,
  };
};

export const UserLibraryListScreen = connect(mapStateToProps, {
  fetchUserLibraryByType,
  updateUserLibraryEntry,
})(UserLibraryListScreenComponent);
