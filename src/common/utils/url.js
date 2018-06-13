import { Linking } from 'react-native';
import { Lightbox } from 'kitsu/utils/lightbox';

/**
 * Checks whether a url is a data url.
 * E.g data:image/png;base64, data:text/plain, etc ...
 *
 * @param {string} url The url to check.
 * @returns If the url is a data url.
 */
export function isDataUrl(url) {
  const regex = /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)$/i;
  return regex.test((url || '').trim());
}

/**
 * Checks whether a url is an image url.
 * This is a very basic check and it supports gif, jpg, jpeg, png and bmp detection.
 *
 * @param {string} url The url to check
 * @returns If the url is an image url.
 */
export function isImageUrl(url) {
  const info = parseURL(url.toLowerCase());
  if (!info) {
    return false;
  }

  const regex = /\.(gif|jpg|jpeg|png|bmp)$/;
  return regex.test((info.pathname || '').trim());
}

/**
 * Open the given url in `Linking`.
 * Checks to see if the url is supported by an app before opening it.
 *
 * @param {string} url The url to open
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
 * Extract protocol, host, hostname, port, pathname, search and hash from a given URL.
 * Note: URL must not be relative or this function will return null.
 *
 * @param {string} url the url.
 * @returns a Dictionary or null if not a valid url.
 */
export function parseURL(url) {
  /**
   * The Regex below is as follows:
    '^(https?:)//', protocol
    '(([^:/?#]*)(?::([0-9]+))?)', host (hostname and port)
    '(/{0,1}[^?#]*)', pathname
    '(\\?[^#]*|)', search params
    '(#.*|)$' hash
  */
  if (typeof url !== 'string') return null;

  const regex = /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/;
  const match = url.match(regex);
  return match && {
    url,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7],
  };
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
  // Get url information
  const info = parseURL(url);
  if (!info) {
    openUrl(url);
    return;
  }

  // Check if it's an image url
  if (isImageUrl(url)) {
    Lightbox.show([url]);
    return;
  }

  const { hostname, pathname } = info;
  const paths = pathname.split('/').slice(1);

  // If it's not a kitsu url then we open it
  if (!hostname.toLowerCase().includes('kitsu') || paths.length < 2) {
    openUrl(url);
    return;
  }

  let params = null;

  switch (paths[0]) {
    case 'users':
      if (/^\d+$/.test(paths[1])) {
        params = ['ProfilePages', { userId: parseInt(paths[1], 10) }];
      }
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
