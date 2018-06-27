import { parseURL } from 'kitsu/common/utils/url';
import { kitsuConfig } from 'kitsu/config/env';
import { coverImageDimensions } from 'kitsu/constants/app';
import { isEmpty } from 'lodash';


/**
 * Check whether a url is a kitsu url.
 * This can be a handy function when you need to check if imgix is going to be applied to a url.
 *
 * @param {string} url The url to check.
 * @returns Whether a url is a kitsu url.
 */
export function isKitsuUrl(url) {
  if (isEmpty(url)) return false;

  // Parse it
  const parsed = parseURL(url);
  if (!parsed) return false;

  // Check if we have a kitsu image
  const { hostname } = parsed;
  return hostname.toLowerCase().includes('kitsu');
}

export const defaultImgixOptions = {
  fit: 'crop',
  crop: 'faces,edges',
  auto: 'format',
};

/**
 * Get the imgix image url from the given url.
 *
 * This will convert the url from kitsu to imgix and apply all the necessary filters.
 * If it can't convert the url then the original url will be returned.
 *
 * @param {string} url The image url.
 * @param {object} imageOptions Image options to pass to imgix.
 */
export function getImgixImage(url, imageOptions = {}) {
  const options = {
    ...defaultImgixOptions,
    ...imageOptions,
  };

  if (isEmpty(url)) return null;

  // Parse it
  const parsed = parseURL(url);
  if (!parsed) return null;

  // Check if we have a kitsu image
  const { hostname, pathname } = parsed;
  if (!hostname.toLowerCase().includes('kitsu')) return url;

  // Build the search params
  const mappings = Object.keys(options).filter(k => options[k]).map(key => `${key}=${options[key]}`);
  const searchParams = mappings.join('&');

  // Make the new url
  return `https://${kitsuConfig.imgixBaseUrl}${pathname}?${searchParams}`;
}


export const defaultImgixCoverOptions = {
  ...defaultImgixOptions,
  w: coverImageDimensions.width,
  'max-h': coverImageDimensions.height,
};


/**
 * Get the imgix cover image url from the given coverImages.
 *
 * This will convert the cover url from kitsu to imgix and apply all the necessary filters.
 * If it can't convert the url then the original cover image will be returned.
 *
 * @param {object} coverImage An object containing coverImage urls.
 * @param {object} imageOptions Image options to pass to imgix.
 */
export function getImgixCoverImage(coverImage, imageOptions = {}) {
  const options = {
    ...defaultImgixCoverOptions,
    ...imageOptions,
  };

  if (isEmpty(coverImage) || typeof coverImage !== 'object') return null;

  // Get the cover url
  const coverURL = coverImage.original ||
  coverImage.large ||
  coverImage.medium ||
  coverImage.small ||
  null;

  return getImgixImage(coverURL, options);
}
