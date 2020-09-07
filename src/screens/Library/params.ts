import { LibraryEntryStatus, Media_Type } from 'app/types/graphql';

export type LibraryParams = {
  type: Media_Type;
  status: LibraryEntryStatus;
};
