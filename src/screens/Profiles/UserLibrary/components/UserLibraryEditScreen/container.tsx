import { connect } from 'react-redux';
import { deleteUserLibraryEntry } from 'kitsu/store/profile/actions';
import { UserLibraryEditScreenComponent } from './component';

export const UserLibraryEditScreen = connect(null, {
  deleteUserLibraryEntry,
})(UserLibraryEditScreenComponent);
