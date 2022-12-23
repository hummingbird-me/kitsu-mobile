import { lowerCase } from 'lodash';

export function getTitleField(preference) {
  switch (preference) {
    case 'english':
      return 'en';
    case 'romanized':
      return 'en_jp';
    default:
      return 'canonical';
  }
  return 'canonical';
}

export function getComputedTitle(user, media) {
  if (!user) { return media.canonicalTitle; }
  const preference = lowerCase(user.titleLanguagePreference);
  const key = getTitleField(preference);
  return (media.titles && media.titles[key]) || media.canonicalTitle;
}

export default {
  getTitleField,
  getComputedTitle,
};
