export const idExtractor = item => item.id;
// eslint-disable-next-line no-underscore-dangle
export const underscoreIdExtractor = item => item._id;

export const isIdForCurrentUser = (id, currentUser) => currentUser.id === id;
