import { includes } from 'lodash';
import { Linking } from 'react-native';

/**
 * Open the given url in `Linking`.
 * Checks to see if the url is supported by an app before opening it.
 *
 * @param {any} url The url to open
 */
async function openUrl(url) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    }
  } catch (e) {
    console.log(`Error handling ${url}: ${e}`);
  }
}

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

  // If it's not a kitsu url then we open it
  if (!includes(hostname.toLowerCase(), 'kitsu') || paths.length < 2) {
    openUrl(url);
    return;
  }

  switch (paths[0]) {
    case 'users':
      // For this we just pray that they use the kitsu link properly
      params = ['UserProfile', { userName: paths[1] }];
      break;
    case 'anime': {
      // If we have an id (i.e a number)
      if (/^\d+$/.test(paths[1])) {
        params = ['MediaPages', { mediaId: parseInt(paths[1], 10), mediaType: 'anime' }];
      }
      break;
    }
    case 'manga': {
      // If we have an id (i.e a number)
      if (/^\d+$/.test(paths[1])) {
        params = ['MediaPages', { mediaId: parseInt(paths[1], 10), mediaType: 'manga' }];
      }
      break;
    }
    // TODO: Handle posts and comments
    default:
      openUrl(url);
      break;
  }

  if (params) {
    navigation.navigate(...params);
  }
}
