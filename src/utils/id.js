export const isIdForCurrentUser = (id, currentUser) => (!!currentUser) && (currentUser.id == id);
