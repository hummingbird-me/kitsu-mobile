import { Linking } from 'react-native';
import { isEmpty } from 'lodash';
import { Screens, NavigationActions } from 'kitsu/navigation';
import { Navigation } from 'react-native-navigation';
import { DeepLinking } from 'react-native-deep-linking';
import { openUrl } from './deeplink';

/**
 * Check whether a url is a kitsu url.
 * Kitsu url being that it has the `kitsu` in the host name.
 *
 * @param {string} url The url to check.
 * @returns Whether a url is a kitsu url.
 */
export function isKitsuUrl(url) {
  // Parse it
  const parsed = parseURL((url || ''));
  if (!parsed) return false;

  // Check if we have a kitsu image
  const { hostname } = parsed;
  return (hostname || '').toLowerCase().includes('kitsu');
}

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
 * Checks whether a url is a gif url.
 *
 * @param {string} url The url to check.
 * @returns If the url is a gif url.
 */
export function isGIFUrl(url) {
  const info = parseURL((url || '').toLowerCase());
  if (!info) return false;

  const regex = /\.(gif)$/;
  return regex.test((info.pathname || '').trim());
}

/**
 * Checks whether a url is an image url.
 * This is a very basic check and it supports gif, jpg, jpeg, png and bmp detection.
 *
 * @param {string} url The url to check
 * @returns If the url is an image url.
 */
export function isImageUrl(url) {
  const info = parseURL((url || '').toLowerCase());
  if (!info) return false;

  const regex = /\.(gif|jpg|jpeg|png|bmp)$/;
  return regex.test((info.pathname || '').trim());
}

/**
 * Extract urls from a given string.
 *
 * @param {String} text The string to extract urls from
 * @returns An array of urls.
 */
export function extractUrls(text) {
  if (!text) return [];
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return text.match(regex) || [];
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
  if (typeof url !== 'string' || isEmpty(url)) return null;

  const regex = /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/i;
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
 * Checks to see if a url is an image.
 * If not then it passes it off to deep linking.
 *
 * @param {string} url The url to handle.
 */
export async function handleURL(url) {
  if (!url) return;

  // Check if it's an image url
  if (isImageUrl(url)) {
    NavigationActions.showLightBox([url]);
    return;
  }

  // Pass the url to deep linking
  openUrl(url);
}
