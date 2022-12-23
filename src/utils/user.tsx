import { isEmpty, isNil, isNull } from 'lodash';

export const isIdForCurrentUser = (id, currentUser) =>
  !!currentUser && currentUser.id == id;

/**
 * Check whether a user is PRO.
 *
 * @param {object} user The user.
 * @returns Whether the user is pro or not.
 */
export function isPro(user) {
  const current = new Date();
  const expireDate =
    user && !isNull(user.proExpiresAt) ? new Date(user.proExpiresAt) : null;
  return expireDate && expireDate > current;
}

/**
 * Check whether a user is an Aozora PRO.
 * NOTE: Currently `aoPro` is only returned in the current logged in user.
 *
 * @param {object} user The user.
 * @returns Whether the user is aoPro or not.
 */
export function isAoPro(user) {
  // Check that aoPro is not null or undefined
  return user && !isNil(user.aoPro);
}

/**
 * Check whether a user is PRO with Azora or Kitsu.
 *
 * @param {object} user The user.
 * @returns Whether the user is PRO with Aozora or Kitsu.
 */
export function isAoProOrKitsuPro(user) {
  return isPro(user) || isAoPro(user);
}

/**
 * Get the title of the user.
 * This will prioritize kitsu title before pro title.
 *
 * @param {object} user the user.
 * @returns Kitsu title, Pro or null if no title is present.
 */
export function getUserTitle(user) {
  // Check for kitsu set title
  if (user && !isEmpty(user.title)) return user.title;

  // Check for pro
  if (user && isPro(user)) return 'PRO';

  return null;
}
