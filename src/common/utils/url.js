import { includes } from 'lodash';
import { Linking } from 'react-native';
import { Kitsu } from 'kitsu/config/api';

/**
 * Checks to see if `url` belongs to Kitsu.
 * If so then it will navigate to the corresponding page in the app
 * Otherwise it will pass it to `Linking`
 *
 * @param {string} url The url to handle.
 * @param {object} navigation The navigation object.
 */
export async function handleURL(url, navigation) {
  const { hostname, pathname } = new URL(url);
  const paths = pathname.split('/').slice(1);

  // If it's not a kitsu url then pass it onto `Linking`
  if (!includes(hostname.toLowerCase(), 'kitsu') || paths.length < 2) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      }
    } catch (e) {
      console.log(`Error handling ${url}: ${e}`);
    }
  }

  let params = null;

  switch (paths[0]) {
    case 'users':
      params = ['UserProfile', { userName: paths[1] }];
      break;
    case 'anime': {
      let id = null;
      // If we have an id (i.e a number)
      if (/^\d+$/.test(paths[1])) {
        id = paths[1];
      } else {
        try {
          const anime = await Kitsu.findAll('anime', {
            filter: { slug: paths[1] },
          });
          id = (anime.length > 0 && anime[0].id) || null;
        } catch (e) {
          console.log(`Failed to fetch anime ${paths[1]}: ${e}`);
        }
      }

      if (id) params = ['MediaPages', { mediaId: id, mediaType: 'anime' }];
      break;
    }
    case 'manga': {
      let id = null;
      // If we have an id (i.e a number)
      if (/^\d+$/.test(paths[1])) {
        id = paths[1];
      } else {
        try {
          const manga = await Kitsu.findAll('anime', {
            filter: { slug: paths[1] },
          });
          id = (manga.length > 0 && manga[0].id) || null;
        } catch (e) {
          console.log(`Failed to fetch manga ${paths[1]}: ${e}`);
        }
      }

      if (id) params = ['MediaPages', { mediaId: id, mediaType: 'manga' }];
      break;
    }
    // TODO: Handle posts and comments
    default:
  }

  if (params) {
    navigation.navigate(...params);
  }
}
